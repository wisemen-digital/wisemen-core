import { Injectable } from '@nestjs/common'
import { Any, EntityManager, IsNull, Not, QueryFailedError } from 'typeorm'
import { InjectEntityManager, TypeOrmRepository } from '@wisemen/nestjs-typeorm'
import { PushInstallation } from './push-installation.entity.js'
import { PushPlatform } from './push-platform.js'
import { hashPushToken } from '../installation/push-token-hash.js'
import {
  hashInstallationSecret,
  installationSecretMatches
} from './push-installation-secret.js'

const UNIQUE_VIOLATION_CODE = '23505'

export interface UpsertPushInstallationCommand {
  appScope: string
  installationId: string
  /** Client-generated proof that the caller controls this installation. Only its hash is stored. */
  installationSecret: string
  userUuid: string
  token: string
  platform: PushPlatform
  appVersion: string | null
}

/**
 * Thrown when an installation cannot be registered safely. The message contains a stable reason
 * code without identifying another user or installation.
 */
export class PushInstallationConflictError extends Error {}

/** An installation associated with a user. */
export type AssociatedPushInstallation = PushInstallation & { userUuid: string }

@Injectable()
export class PushInstallationRepository {
  private readonly repository: TypeOrmRepository<PushInstallation>

  constructor (
    @InjectEntityManager() private readonly manager: EntityManager
  ) {
    this.repository = new TypeOrmRepository(PushInstallation, manager)
  }

  public async findOneByInstallationId (
    appScope: string,
    installationId: string
  ): Promise<PushInstallation | null> {
    return await this.repository.findOneBy({ appScope, installationId })
  }

  public async findOneActiveByUuid (uuid: string): Promise<PushInstallation | null> {
    return await this.repository.findOneBy({ uuid, revokedAt: IsNull() })
  }

  public async findManyActiveForUsers (
    appScope: string,
    userUuids: string[]
  ): Promise<AssociatedPushInstallation[]> {
    if (userUuids.length === 0) {
      return []
    }

    const installations = await this.repository.find({
      where: { appScope, userUuid: Any(userUuids), revokedAt: IsNull() },
      order: { createdAt: 'ASC' }
    })

    return installations as AssociatedPushInstallation[]
  }

  /**
   * Register an installation or update its user and delivery token.
   *
   * Existing installations require the installation secret. A valid secret also allows account
   * switches, including when the previous logout never reached the server.
   */
  public async upsertOne (
    command: UpsertPushInstallationCommand
  ): Promise<PushInstallation> {
    const tokenHash = hashPushToken(command.token)

    // Releasing a previous token holder and writing the new registration must succeed together.
    return await this.manager.transaction(async (manager) => {
      const installations = new TypeOrmRepository(PushInstallation, manager)
      const existing = await this.findOneWithSecretHash(installations, command)

      if (existing !== null
        && !installationSecretMatches(command.installationSecret, existing.installationSecretHash)) {
        throw new PushInstallationConflictError('installation_possession_proof_failed')
      }

      await this.releaseTokenFromOtherInstallations(installations, command, tokenHash)

      if (existing === null) {
        return await this.insertOne(installations, command, tokenHash)
      }

      return await this.updateOne(installations, existing, command, tokenHash)
    })
  }

  /**
   * Detach the current user from an installation, leaving the registration intact.
   *
   * This is the logout operation. It only succeeds for the current owner and is safe to repeat.
   */
  public async detachUserForOwner (
    appScope: string,
    installationId: string,
    userUuid: string
  ): Promise<boolean> {
    const result = await this.repository.update(
      { appScope, installationId, userUuid, revokedAt: IsNull() },
      { userUuid: null }
    )

    return (result.affected ?? 0) > 0
  }

  /**
   * Permanently remove a device registration on behalf of its current user.
   *
   * The row remains for delivery history, but its token can be claimed by another installation.
   * Use {@link detachUserForOwner} for logout.
   */
  public async revokeOneForOwner (
    appScope: string,
    installationId: string,
    userUuid: string,
    reason: string
  ): Promise<boolean> {
    const result = await this.repository.update(
      { appScope, installationId, userUuid, revokedAt: IsNull() },
      { revokedAt: new Date(), revokedReason: reason }
    )

    return (result.affected ?? 0) > 0
  }

  /**
   * Disable an installation after the provider confirmed the target is gone.
   *
   * Conditional on the generation that was actually sent: a result for an older token must not
   * invalidate the replacement token registered in the meantime.
   */
  public async revokeOneIfGenerationMatches (
    uuid: string,
    sentTokenGeneration: number,
    reason: string
  ): Promise<boolean> {
    const result = await this.repository.update(
      { uuid, tokenGeneration: sentTokenGeneration, revokedAt: IsNull() },
      { revokedAt: new Date(), revokedReason: reason }
    )

    return (result.affected ?? 0) > 0
  }

  public async touchLastSeen (uuid: string): Promise<void> {
    await this.repository.update({ uuid }, { lastSeenAt: new Date() })
  }

  private async findOneWithSecretHash (
    installations: TypeOrmRepository<PushInstallation>,
    command: UpsertPushInstallationCommand
  ): Promise<PushInstallation | null> {
    return await installations
      .createQueryBuilder('installation')
      .addSelect('installation.installationSecretHash')
      .where('installation.appScope = :appScope', { appScope: command.appScope })
      .andWhere('installation.installationId = :installationId', {
        installationId: command.installationId
      })
      .getOne()
  }

  /**
   * A token is active under at most one installation.
   *
   * A reinstall may take a token from another installation owned by the same user, or from a
   * detached installation. A token owned by another user causes a conflict.
   */
  private async releaseTokenFromOtherInstallations (
    installations: TypeOrmRepository<PushInstallation>,
    command: UpsertPushInstallationCommand,
    tokenHash: string
  ): Promise<void> {
    // Keep ownership stable between this check and the token release below.
    const holders = await installations.find({
      where: {
        appScope: command.appScope,
        tokenHash,
        revokedAt: IsNull(),
        installationId: Not(command.installationId)
      },
      lock: { mode: 'pessimistic_write' }
    })

    if (holders.length === 0) {
      return
    }

    const heldByAnotherUser = holders.some(holder =>
      holder.userUuid !== null && holder.userUuid !== command.userUuid
    )

    if (heldByAnotherUser) {
      throw new PushInstallationConflictError('token_active_for_other_user')
    }

    // Match the token as well as the row so a concurrent refresh cannot revoke a newer token.
    await installations.update(
      {
        uuid: Any(holders.map(holder => holder.uuid)),
        tokenHash,
        revokedAt: IsNull()
      },
      { revokedAt: new Date(), revokedReason: 'token_moved_to_other_installation' }
    )
  }

  private async insertOne (
    installations: TypeOrmRepository<PushInstallation>,
    command: UpsertPushInstallationCommand,
    tokenHash: string
  ): Promise<PushInstallation> {
    const installation = installations.create({
      appScope: command.appScope,
      installationId: command.installationId,
      installationSecretHash: hashInstallationSecret(command.installationSecret),
      userUuid: command.userUuid,
      token: command.token,
      tokenHash,
      platform: command.platform,
      appVersion: command.appVersion,
      tokenGeneration: 1,
      lastSeenAt: new Date()
    })

    try {
      await installations.insert(installation)
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new PushInstallationConflictError('installation_registration_conflict')
      }

      throw error
    }

    // Reload so callers see every database default, not just the generated columns TypeORM
    // returns from the insert.
    return await installations.findOneByOrFail({ uuid: installation.uuid })
  }

  /**
   * Replace the registration of an existing installation.
   *
   * The database increments `tokenGeneration` when the token changes or the installation is
   * reactivated. Heartbeats and account switches with the same token keep the current generation.
   */
  private async updateOne (
    installations: TypeOrmRepository<PushInstallation>,
    existing: PushInstallation,
    command: UpsertPushInstallationCommand,
    tokenHash: string
  ): Promise<PushInstallation> {
    try {
      const changed = await installations
        .createQueryBuilder()
        .update(PushInstallation)
        .set({
          token: command.token,
          tokenHash,
          userUuid: command.userUuid,
          platform: command.platform,
          appVersion: command.appVersion,
          tokenGeneration: () => '"tokenGeneration" + 1',
          lastSeenAt: new Date(),
          revokedAt: null,
          revokedReason: null
        })
        .where('uuid = :uuid', { uuid: existing.uuid })
        .andWhere('("tokenHash" != :tokenHash OR "revokedAt" IS NOT NULL)', { tokenHash })
        .execute()

      if ((changed.affected ?? 0) === 0) {
        // The token is unchanged, but account and device metadata may still need updating.
        await installations.update({ uuid: existing.uuid }, {
          userUuid: command.userUuid,
          platform: command.platform,
          appVersion: command.appVersion,
          lastSeenAt: new Date()
        })
      }
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new PushInstallationConflictError('installation_registration_conflict')
      }

      throw error
    }

    return await installations.findOneByOrFail({ uuid: existing.uuid })
  }
}

function isUniqueViolation (error: unknown): boolean {
  return error instanceof QueryFailedError
    && (error.driverError as { code?: string }).code === UNIQUE_VIOLATION_CODE
}
