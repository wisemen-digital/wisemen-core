import { describe, it } from 'node:test'
import { expect } from 'expect'
import { Typesense } from '../index.js'
import {
  getTypesenseCollectorCollection,
  isTypesenseCollector,
  RegisterTypesenseCollector
} from './typesense-collector.decorator.js'

describe('RegisterTypesenseCollector', () => {
  it('stores collection metadata using a collection object', () => {
    const contacts = Typesense.collection('contacts', {
      id: Typesense.string()
    })

    @RegisterTypesenseCollector(contacts)
    class ContactCollector {}

    expect(isTypesenseCollector(ContactCollector)).toBe(true)
    expect(getTypesenseCollectorCollection(ContactCollector)).toBe('contacts')
  })
})
