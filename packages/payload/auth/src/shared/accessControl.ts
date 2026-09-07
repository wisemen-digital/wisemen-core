import type {
  Access,
  AccessArgs,
  AccessResult,
  CollectionConfig,
  TypeWithID,
} from 'payload'

import type { BaseUserRecord } from '#shared/payloadAuth.types.ts'

type CollectionAccess = NonNullable<CollectionConfig['access']>
type UntypedUser = BaseUserRecord & TypeWithID
type UserAccess<TUser extends BaseUserRecord & TypeWithID> = TUser | null | undefined

type AccessControlKind = 'form' | 'private' | 'public'

let configuredIsAllowedPrivateAccess: IsAllowedPrivateAccess<UntypedUser> | undefined
const accessControlKinds = new WeakMap<CollectionAccess, AccessControlKind>()
const customAccessControls = new WeakMap<CollectionAccess, CustomCollectionAccess<any>>()

export interface AccessControlContext<
  TUser extends BaseUserRecord & TypeWithID,
  TCollectionSlug extends string,
> {
  collectionSlug: TCollectionSlug
  user: UserAccess<TUser>
}

/**
 * Determines whether an authenticated user may access private collection data.
 * Define this in the consuming project so its role model stays explicit.
 */
export type IsAllowedPrivateAccess<
  TUser extends BaseUserRecord & TypeWithID,
  TCollectionSlug extends string = string,
> = (
  context: AccessControlContext<TUser, TCollectionSlug>,
) => boolean | Promise<boolean>

/**
 * A user-based rule for a custom collection operation. Return a Payload `Where`
 * clause when access should be scoped to selected documents.
 */
export type CollectionAccessRule<
  TUser extends BaseUserRecord & TypeWithID,
  TCollectionSlug extends string = string,
> = (
  context: AccessControlContext<TUser, TCollectionSlug>,
) => AccessResult | Promise<AccessResult>

/**
 * Explicit per-operation access rules. Omitted operations are denied.
 */
export interface CustomCollectionAccess<
  TUser extends BaseUserRecord & TypeWithID,
  TCollectionSlug extends string = string,
> {
  admin?: IsAllowedPrivateAccess<TUser, TCollectionSlug>
  create?: CollectionAccessRule<TUser, TCollectionSlug>
  delete?: CollectionAccessRule<TUser, TCollectionSlug>
  read?: CollectionAccessRule<TUser, TCollectionSlug>
  readVersions?: CollectionAccessRule<TUser, TCollectionSlug>
  unlock?: CollectionAccessRule<TUser, TCollectionSlug>
  update?: CollectionAccessRule<TUser, TCollectionSlug>
}

function createPrivateAccess<
  TUser extends BaseUserRecord & TypeWithID,
  TCollectionSlug extends string,
>(
  collectionSlug: TCollectionSlug,
  isAllowedPrivateAccess: IsAllowedPrivateAccess<TUser, TCollectionSlug>,
): Access {
  return ({
    req,
  }: AccessArgs) => isAllowedPrivateAccess({
    collectionSlug,
    user: req.user as UserAccess<TUser>,
  })
}

function createUserAccess<
  TUser extends BaseUserRecord & TypeWithID,
  TCollectionSlug extends string,
>(
  collectionSlug: TCollectionSlug,
  rule?: CollectionAccessRule<TUser, TCollectionSlug>,
): Access {
  if (rule == null) {
    return denyAccess
  }

  return ({
    req,
  }: AccessArgs) => rule({
    collectionSlug,
    user: req.user as UserAccess<TUser>,
  })
}

function createPrivateAdminAccess<
  TUser extends BaseUserRecord & TypeWithID,
  TCollectionSlug extends string,
>(
  collectionSlug: TCollectionSlug,
  isAllowedPrivateAccess: IsAllowedPrivateAccess<TUser, TCollectionSlug>,
): NonNullable<CollectionAccess['admin']> {
  return ({
    req,
  }) => isAllowedPrivateAccess({
    collectionSlug,
    user: req.user as UserAccess<TUser>,
  })
}

function denyAccess(): false {
  return false
}

function allowAccess(): true {
  return true
}

export interface PayloadAccessControl<
  TUser extends BaseUserRecord & TypeWithID,
  TCollectionSlug extends string = string,
> {
  /** Explicit per-operation rules for role- or document-specific policies. */
  customCollection: (access: CustomCollectionAccess<TUser, TCollectionSlug>) => CollectionAccess
  /** Public form submissions. Creating is public; submitted data stays private. */
  formCollection: CollectionAccess
  /** Private data. Every collection and CMS operation requires private access. */
  privateCollection: CollectionAccess
  /** Publicly readable data; management remains restricted to private access. */
  publicCollection: CollectionAccess
}

/**
 * Configures the package-level access controls. This is called by
 * `createPayloadAuthPlugin` and must run before `AccessControl` is used.
 */
export function initializeAccessControl<
  TUser extends BaseUserRecord & TypeWithID,
  TCollectionSlug extends string = string,
>(
  isAllowedPrivateAccess: IsAllowedPrivateAccess<TUser, TCollectionSlug>,
): void {
  if (configuredIsAllowedPrivateAccess != null) {
    throw new Error('Payload access control has already been initialized. Configure it once with createPayloadAuthPlugin().')
  }

  configuredIsAllowedPrivateAccess = isAllowedPrivateAccess as IsAllowedPrivateAccess<UntypedUser>
}

/** Resolves collection access markers after the Payload plugin receives collection slugs. */
export function resolveAccessControl(collections: CollectionConfig[] | undefined): void {
  if (collections == null) {
    return
  }

  getAccessControl()

  for (const collection of collections) {
    const collectionAccess = collection.access

    if (collectionAccess == null) {
      continue
    }

    const customAccess = customAccessControls.get(collectionAccess)

    if (customAccess != null) {
      collection.access = createCollectionAccess(collection.slug, customAccess)

      continue
    }

    const accessControlKind = accessControlKinds.get(collectionAccess)

    switch (accessControlKind) {
      case 'form': {
        collection.access = createFormCollectionAccess(collection.slug)

        break
      }
      case 'private': {
        collection.access = createPrivateCollectionAccess(collection.slug)

        break
      }
      case 'public': {
        collection.access = createPublicCollectionAccess(collection.slug)

        break
      }
    }
  }
}

function getAccessControl(): void {
  if (configuredIsAllowedPrivateAccess == null) {
    throw new Error('Payload access control has not been initialized. Call createPayloadAuthPlugin() before using AccessControl.')
  }
}

/**
 * Package-level collection access policies configured by `createPayloadAuthPlugin`.
 */
export const AccessControl = {
  customCollection: createCustomAccessControlMarker,
  formCollection: createAccessControlMarker('form'),
  privateCollection: createAccessControlMarker('private'),
  publicCollection: createAccessControlMarker('public'),
} satisfies PayloadAccessControl<any>

function createAccessControlMarker(accessControlKind: AccessControlKind): CollectionAccess {
  const marker = createCollectionAccessMarker()

  accessControlKinds.set(marker, accessControlKind)

  return marker
}

function createCollectionAccessMarker(): CollectionAccess {
  return {
    admin: () => false,
    create: denyAccess,
    delete: denyAccess,
    read: denyAccess,
    readVersions: denyAccess,
    unlock: denyAccess,
    update: denyAccess,
  }
}

function createCustomAccessControlMarker<TUser extends BaseUserRecord & TypeWithID>(
  access: CustomCollectionAccess<TUser>,
): CollectionAccess {
  const marker = createCollectionAccessMarker()

  customAccessControls.set(marker, access)

  return marker
}

function createFormCollectionAccess(
  collectionSlug: string,
): CollectionAccess {
  const privateAccess = createPrivateAccess(collectionSlug, getIsAllowedPrivateAccess())
  const privateAdminAccess = createPrivateAdminAccess(collectionSlug, getIsAllowedPrivateAccess())

  return {
    admin: privateAdminAccess,
    create: allowAccess,
    delete: privateAccess,
    read: privateAccess,
    readVersions: privateAccess,
    unlock: privateAccess,
    update: privateAccess,
  }
}

function createPrivateCollectionAccess(
  collectionSlug: string,
): CollectionAccess {
  const privateAccess = createPrivateAccess(collectionSlug, getIsAllowedPrivateAccess())
  const privateAdminAccess = createPrivateAdminAccess(collectionSlug, getIsAllowedPrivateAccess())

  return {
    admin: privateAdminAccess,
    create: privateAccess,
    delete: privateAccess,
    read: privateAccess,
    readVersions: privateAccess,
    unlock: privateAccess,
    update: privateAccess,
  }
}

function createPublicCollectionAccess(
  collectionSlug: string,
): CollectionAccess {
  const privateAccess = createPrivateAccess(collectionSlug, getIsAllowedPrivateAccess())
  const privateAdminAccess = createPrivateAdminAccess(collectionSlug, getIsAllowedPrivateAccess())

  return {
    admin: privateAdminAccess,
    create: privateAccess,
    delete: privateAccess,
    read: allowAccess,
    readVersions: privateAccess,
    unlock: privateAccess,
    update: privateAccess,
  }
}

function getIsAllowedPrivateAccess(): IsAllowedPrivateAccess<UntypedUser> {
  if (configuredIsAllowedPrivateAccess == null) {
    throw new Error('Payload access control has not been initialized. Call createPayloadAuthPlugin() before using AccessControl.')
  }

  return configuredIsAllowedPrivateAccess
}

/**
 * Creates an explicit custom collection policy. Omitted operations are denied.
 */
export function createCollectionAccess<
  TUser extends BaseUserRecord & TypeWithID,
  TCollectionSlug extends string = string,
>(
  collectionSlug: TCollectionSlug,
  access: CustomCollectionAccess<TUser, TCollectionSlug>,
): CollectionAccess {
  return {
    admin: ({
      req,
    }) => access.admin?.({
      collectionSlug,
      user: req.user as UserAccess<TUser>,
    }) ?? false,
    create: createUserAccess(collectionSlug, access.create),
    delete: createUserAccess(collectionSlug, access.delete),
    read: createUserAccess(collectionSlug, access.read),
    readVersions: createUserAccess(collectionSlug, access.readVersions),
    unlock: createUserAccess(collectionSlug, access.unlock),
    update: createUserAccess(collectionSlug, access.update),
  }
}
