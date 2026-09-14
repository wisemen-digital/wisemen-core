
import { describe, it } from 'node:test'
import { expect } from 'expect'
import { createSearchParamsBuilder } from '../../params-builder/search-params.builder.js'
import { FilterOperator } from '../../params-builder/enums/typesense-filter-options.enum.js'
import { TypesenseJoinStrategy } from '../../params-builder/enums/typesense-join-strategy.enum.js'
import { SortDirection } from '@wisemen/pagination'
import { Typesense, TypesenseMissingValues, type InferDocumentType, type InferSearchResultDocument } from '../../index.js'

export type Uuid<Brand extends string> = string
  & { readonly _brand: 'uuid' }
  & { readonly _uuid: Brand }

type ContactUuid = Uuid<'Contact'>

describe('typesenseCollection', () => {
  it('keeps typed fields on the collection object', () => {
    const contacts = Typesense.collection('contacts', {
      id: Typesense.string().brand<ContactUuid>(),
      name: Typesense.string().sort().infix(),
      email: Typesense.string().optional().sort(),
      country: Typesense.string().optional().index(false),
      isActive: Typesense.bool().facet(),
      coordinates: Typesense.geopoint().optional()
    })

    expect(contacts.name.name).toBe('name')
    expect(contacts.country.index).toBe(false)
    expect(contacts.email.optional).toBe(true)
    expect(Object.keys(contacts)).toEqual(['id', 'name', 'email', 'country', 'isActive', 'coordinates'])
  })

  it('adds referenced fields', () => {
    const users = Typesense.collection('users', {
      id: Typesense.string()
    })

    const contacts = Typesense.collection('contacts', {
      id: Typesense.string().brand<ContactUuid>(),
      name: Typesense.string().sort().infix(),
      email: Typesense.string().optional().sort(),
      country: Typesense.string().optional().index(false),
      isActive: Typesense.bool().facet(),
      coordinates: Typesense.geopoint().optional(),
      userId: Typesense.string().reference(users.id)
    })

    expect(contacts.userId.reference).toBe(users.id)
  })

  it('builds a schema from field builders', () => {
    const contacts = Typesense.collection('contacts', {
      id: Typesense.string().brand<ContactUuid>(),
      name: Typesense.string().sort().infix(),
      email: Typesense.string().optional().sort(),
      country: Typesense.string().optional().index(false),
      age: Typesense.int32().sort(),
      isActive: Typesense.bool().facet(),
      coordinates: Typesense.geopoint().optional()
    })

    createSearchParamsBuilder(contacts)
      .addSearchOn(contacts.name)
      .addSearchOn(contacts.email)
      .addFilterBrackets(qb => {
        qb.where(contacts.email, FilterOperator.EQUALS, 'kobe.kwanten@wisemen.digital' )
      })


    expect(contacts).toMatchObject({
      id: {
        name: 'id',
        type: 'string',
        optional: false,
        index: true,
        sort: false,
        facet: false,
        infix: false
      },
      name: {
        name: 'name',
        type: 'string',
        optional: false,
        index: true,
        sort: true,
        facet: false,
        infix: true
      },
      email: {
        name: 'email',
        type: 'string',
        optional: true,
        index: true,
        sort: true,
        facet: false,
        infix: false
      },
      country: {
        name: 'country',
        type: 'string',
        optional: true,
        index: false,
        sort: false,
        facet: false,
        infix: false
      },
      age: {
        name: 'age',
        type: 'int32',
        optional: false,
        index: true,
        sort: true,
        facet: false,
        infix: false
      },
      isActive: {
        name: 'isActive',
        type: 'bool',
        optional: false,
        index: true,
        sort: false,
        facet: true,
        infix: false
      },
      coordinates: {
        name: 'coordinates',
        type: 'geopoint',
        optional: true,
        index: true,
        sort: false,
        facet: false,
        infix: false
      }
    })
  })

  it('exposes schema generation as a helper', () => {
    const users = Typesense.collection('users', {
      id: Typesense.string()
    })

    const contacts = Typesense.collection('contacts', {
      id: Typesense.string().brand<ContactUuid>(),
      name: Typesense.string().sort().infix(),
      country: Typesense.string().optional().index(false),
      isActive: Typesense.bool().facet(),
      userId: Typesense.string().facet().reference(users.id)
    })

    expect(Typesense.collectionSchema(contacts)).toEqual({
      name: 'contacts',
      fields: [
        {
          name: 'id',
          type: 'string',
          optional: false
        },
        {
          name: 'name',
          type: 'string',
          optional: false,
          sort: true,
          infix: true
        },
        {
          name: 'isActive',
          type: 'bool',
          optional: false,
          facet: true
        },
        {
          name: 'userId',
          type: 'string',
          optional: false,
          facet: true,
          reference: 'users.id',
          async_reference: true
        }
      ]
    })
  })

  it('exposes stable hashing as a helper', () => {
    const users = Typesense.collection('users', {
      id: Typesense.string()
    })

    const contactsA = Typesense.collection('contacts', {
      id: Typesense.string(),
      name: Typesense.string().sort().infix(),
      country: Typesense.string().optional().index(false),
      userId: Typesense.string().reference(users.id)
    })

    const contactsB = Typesense.collection('contacts', {
      userId: Typesense.string().reference(users.id),
      country: Typesense.string().optional().index(false),
      name: Typesense.string().sort().infix(),
      id: Typesense.string()
    })

    const contactsC = Typesense.collection('contacts', {
      id: Typesense.string(),
      name: Typesense.string().sort(),
      country: Typesense.string().optional().index(false),
      userId: Typesense.string().reference(users.id)
    })

    expect(Typesense.collectionHash(contactsA)).toBe(Typesense.collectionHash(contactsB))
    expect(Typesense.collectionHash(contactsA)).not.toBe(Typesense.collectionHash(contactsC))
  })

  it('infers document field names from the collection keys', () => {
    const contacts = Typesense.collection('contacts', {
      id: Typesense.string(),
      email: Typesense.string().optional()
    })

    type ContactDocument = InferDocumentType<typeof contacts>

    const document: ContactDocument = {
      id: 'contact_1'
    }

    expect(document.id).toBe('contact_1')
  })

  it('serializes typed filter operators', () => {
    const contacts = Typesense.collection('contacts', {
      name: Typesense.string().sort().infix(),
      age: Typesense.int32().sort(),
      isActive: Typesense.bool().facet()
    })

    const params = createSearchParamsBuilder(contacts)
      .addFilterOn(contacts.name, FilterOperator.NON_EXACT, 'Steve')
      // eslint-disable-next-line no-magic-numbers
      .addFilterOn(contacts.age, FilterOperator.GREATER_THAN_OR_EQUALS, 18)
      .addFilterOn(contacts.isActive, FilterOperator.EQUALS, true)
      .addFilterBrackets(qb => {
        qb.where(contacts.isActive, FilterOperator.EQUALS, true)
          .orWhere(contacts.name, FilterOperator.NON_EXACT, 'hi')
      })
      .build()

    expect(params.filter_by).toBe('name:Steve && age:>=18 && isActive:=true && (isActive:=true || name:hi)')
  })

  it('serializes sorting with and without missing value placement', () => {
    const contacts = Typesense.collection('contacts', {
      name: Typesense.string().sort(),
      age: Typesense.int32().optional().sort(),
      email: Typesense.string().optional().sort()
    })

    const params = createSearchParamsBuilder(contacts)
      .addSortOn(contacts.name, SortDirection.ASC)
      .addSortOn(contacts.age, SortDirection.DESC, TypesenseMissingValues.FIRST)
      .addSortOn(contacts.email, SortDirection.ASC, TypesenseMissingValues.LAST)
      .build()

    expect(params.sort_by).toBe(
      'name:asc,age(missing_values: first):desc,email(missing_values: last):asc'
    )
  })

  it('serializes typed joins', () => {
    const users = Typesense.collection('users', {
      id: Typesense.string(),
      email: Typesense.string(),
      age: Typesense.int32()
    })

    const contacts = Typesense.collection('contacts', {
      userId: Typesense.string().reference(users.id),
      name: Typesense.string().sort().infix(),
      isActive: Typesense.bool().facet()
    })

    const params = createSearchParamsBuilder(contacts)
      .innerJoin(contacts.userId, {
        select: [users.id, users.email]
      })
      .build()

    const inverseJoinParams = createSearchParamsBuilder(users)
      .inverseJoin(contacts, qb => {
        qb.where(contacts.isActive, FilterOperator.EQUALS, true)
      }, {
        select: [contacts.userId, contacts.name]
      })
      .build()

    expect(params.include_fields).toBe('$users(id,email, strategy: nest) as users')
    expect(params.filter_by).toBe('$users(id: *)')
    expect(inverseJoinParams.include_fields).toBe('$contacts(userId,name, strategy: nest) as contacts')
    expect(inverseJoinParams.filter_by).toBe('$contacts(isActive:=true)')
  })

  it('infers joined response shapes from the builder', () => {
    const users = Typesense.collection('users', {
      id: Typesense.string(),
      email: Typesense.string(),
      age: Typesense.int32()
    })

    const contacts = Typesense.collection('contacts', {
      id: Typesense.string(),
      userId: Typesense.string().reference(users.id),
      name: Typesense.string().sort().infix()
    })

    const nestedJoin = createSearchParamsBuilder(contacts)
      .innerJoin(contacts.userId, {
        select: [users.id, users.email]
      })
      .build()

    const mergedJoin = createSearchParamsBuilder(contacts)
      .innerJoin(contacts.userId, {
        strategy: TypesenseJoinStrategy.MERGE,
        select: [users.email]
      })
      .build()

    const leftJoin = createSearchParamsBuilder(contacts)
      .leftJoin(contacts.userId, {
        select: [users.email]
      })
      .build()

    type NestedJoinDocument = InferSearchResultDocument<typeof nestedJoin>
    type MergedJoinDocument = InferSearchResultDocument<typeof mergedJoin>
    type LeftJoinDocument = InferSearchResultDocument<typeof leftJoin>

    const nestedDocument: NestedJoinDocument = {
      id: 'contact_1',
      userId: 'user_1',
      name: 'Kobe',
      users: {
        id: 'user_1',
        email: 'kobe@example.com'
      }
    }

    const mergedDocument: MergedJoinDocument = {
      id: 'contact_1',
      userId: 'user_1',
      name: 'Kobe',
      email: 'kobe@example.com'
    }

    const leftJoinedDocument: LeftJoinDocument = {
      id: 'contact_1',
      userId: 'user_1',
      name: 'Kobe'
    }

    expect(nestedDocument.users.email).toBe('kobe@example.com')
    expect(mergedDocument.email).toBe('kobe@example.com')
    expect(leftJoinedDocument.id).toBe('contact_1')
  })
})
