import { EntityManager, In, Not, Repository } from 'typeorm'
import { GoFeatureFlagConfig } from './go-feature-flag.config.js'
import { FeatureFlagEntity } from './typeorm/feature-flag.entity.js'

export class SynchronizeConfigRepository {
  private repo: Repository<FeatureFlagEntity>
  constructor (entityManager: EntityManager) {
    this.repo = entityManager.getRepository(FeatureFlagEntity)
  }

  async getExistingFeatureFlags (): Promise<Map<string, GoFeatureFlagConfig>> {
    const featureFlags = await this.repo.find({
      select: {
        name: true,
        config: true
      }
    })

    return new Map(featureFlags.map(flag => [flag.name, flag.config]))
  }

  async upsert (featureFlags: FeatureFlagEntity[]): Promise<void> {
    if (featureFlags.length === 0) return

    await this.repo.upsert(
      featureFlags as Parameters<typeof this.repo.upsert>[0],
      { conflictPaths: { name: true, set: true } }
    )
  }

  async deleteUnknownFlags (existingFlagNames: string[]): Promise<void> {
    await this.repo.delete({ name: Not(In(existingFlagNames)) })
  }
}
