/* eslint-disable no-magic-numbers */
import { describe, it } from 'node:test'
import { expect } from 'expect'
import {
  type InferDocument,
  type IndexedFieldNames,
  type QueryByFieldNames,
  type SortableFieldNames,
  bool,
  geopoint,
  getTypesenseCollectionName,
  getTypesenseCollectionSchema,
  string,
  typesenseCollection
} from '../../index.js'

type Equal<TLeft, TRight> = (
  <T>() => T extends TLeft ? 1 : 2
) extends (
  <T>() => T extends TRight ? 1 : 2
)
  ? true
  : false

type Expect<T extends true> = T

const contacts = typesenseCollection('contacts', {
  name: string().sort().infix(),
  email: string().optional().sort(),
  country: string().optional().index(false),
  isActive: bool().facet(),
  coordinates: geopoint().optional()
})


type ContactsQueryByField = QueryByFieldNames<typeof contacts>
type ContactsIndexedField = IndexedFieldNames<typeof contacts>
type ContactsSortableField = SortableFieldNames<typeof contacts>
type ContactsDocument = InferDocument<typeof contacts>

type QueryByFieldAssertion = Expect<Equal<ContactsQueryByField, 'name' | 'email'>>
type IndexedFieldAssertion = Expect<Equal<ContactsIndexedField, 'name' | 'email' | 'isActive' | 'coordinates'>>
type SortableFieldAssertion = Expect<Equal<ContactsSortableField, 'name' | 'email'>>
type DocumentAssertion = Expect<Equal<
ContactsDocument,
{
  name: string
  isActive: boolean
  email?: string
  country?: string
  coordinates?: [number, number]
}
>>

function acceptsQueryByField<TCollection extends typeof contacts> (
  _collection: TCollection,
  field: QueryByFieldNames<TCollection>
): QueryByFieldNames<TCollection> {
  return field
}

acceptsQueryByField(contacts, 'name')
acceptsQueryByField(contacts, 'email')
// @ts-expect-error `country` is stored but not indexed, so it cannot be used in `query_by`.
acceptsQueryByField(contacts, 'country')
// @ts-expect-error `isActive` is indexed but not a string field, so it cannot be used in `query_by`.
acceptsQueryByField(contacts, 'isActive')

describe('typesenseCollection', () => {
  it('keeps typed fields on the collection object', () => {
    expect(contacts.name.name).toBe('name')
    expect(contacts.country.index).toBe(false)
    expect(contacts.email.optional).toBe(true)
  })

  it('builds a schema from field builders', () => {
    expect(getTypesenseCollectionName(contacts)).toBe('contacts')
    expect(getTypesenseCollectionSchema(contacts)).toEqual({
      name: 'contacts',
      fields: [
        {
          name: 'name',
          type: 'string',
          optional: false,
          index: true,
          sort: true,
          facet: false,
          infix: true
        },
        {
          name: 'email',
          type: 'string',
          optional: true,
          index: true,
          sort: true,
          facet: false,
          infix: false
        },
        {
          name: 'country',
          type: 'string',
          optional: true,
          index: false,
          sort: false,
          facet: false,
          infix: false
        },
        {
          name: 'isActive',
          type: 'bool',
          optional: false,
          index: true,
          sort: false,
          facet: true,
          infix: false
        },
        {
          name: 'coordinates',
          type: 'geopoint',
          optional: true,
          index: true,
          sort: false,
          facet: false,
          infix: false
        }
      ]
    })
  })
})
