import { after, before, describe, it } from 'node:test'
import { expect } from 'expect'
import { Coordinates } from '@wisemen/coordinates'
import { AddressBuilder } from '../address.builder.js'
import { dataSource } from './sql/datasource.js'
import { AddressTest } from './sql/address-test.entity.js'

describe('AddressColumn', () => {
  before(async () => {
    await dataSource.initialize()
    await dataSource.synchronize(true)
  })

  after(async () => {
    await dataSource.destroy()
  })

  describe('serialization and deserialization', () => {
    it('stores and retrieves a complete address with all fields', async () => {
      const address = new AddressBuilder()
        .withPlaceName('Main Office')
        .withPlaceId('place123')
        .withCountry('Belgium')
        .withCity('Brussels')
        .withPostalCode('1000')
        .withStreetName('Grand Place')
        .withStreetNumber('1')
        .withUnit('A')
        .withCoordinates(new Coordinates(50.8503, 4.3517))
        .build()

      await dataSource.manager.upsert(
        AddressTest,
        { id: 1, address },
        { conflictPaths: { id: true } }
      )

      const test = await dataSource.manager.findOneByOrFail(AddressTest, { id: 1 })

      expect(test.address).not.toBeNull()
      expect(test.address?.placeName).toBe('Main Office')
      expect(test.address?.placeId).toBe('place123')
      expect(test.address?.country).toBe('Belgium')
      expect(test.address?.city).toBe('Brussels')
      expect(test.address?.postalCode).toBe('1000')
      expect(test.address?.streetName).toBe('Grand Place')
      expect(test.address?.streetNumber).toBe('1')
      expect(test.address?.unit).toBe('A')
      expect(test.address?.coordinates?.latitude).toBe(50.8503)
      expect(test.address?.coordinates?.longitude).toBe(4.3517)
    })

    it('stores and retrieves an address with partial fields', async () => {
      const address = new AddressBuilder()
        .withCountry('Belgium')
        .withCity('Antwerp')
        .withPostalCode('2000')
        .build()

      await dataSource.manager.upsert(
        AddressTest,
        { id: 2, address },
        { conflictPaths: { id: true } }
      )

      const test = await dataSource.manager.findOneByOrFail(AddressTest, { id: 2 })

      expect(test.address).not.toBeNull()
      expect(test.address?.country).toBe('Belgium')
      expect(test.address?.city).toBe('Antwerp')
      expect(test.address?.postalCode).toBe('2000')
      expect(test.address?.streetName).toBeNull()
      expect(test.address?.streetNumber).toBeNull()
      expect(test.address?.unit).toBeNull()
      expect(test.address?.coordinates).toBeNull()
    })

    it('stores and retrieves an address with coordinates only', async () => {
      const address = new AddressBuilder()
        .withCoordinates(new Coordinates(51.2194, 4.4025))
        .build()

      await dataSource.manager.upsert(
        AddressTest,
        { id: 3, address },
        { conflictPaths: { id: true } }
      )

      const test = await dataSource.manager.findOneByOrFail(AddressTest, { id: 3 })

      expect(test.address).not.toBeNull()
      expect(test.address?.coordinates?.latitude).toBe(51.2194)
      expect(test.address?.coordinates?.longitude).toBe(4.4025)
      expect(test.address?.country).toBeNull()
      expect(test.address?.city).toBeNull()
    })

    it('stores and retrieves a null address', async () => {
      await dataSource.manager.upsert(
        AddressTest,
        { id: 4, address: null },
        { conflictPaths: { id: true } }
      )

      const test = await dataSource.manager.findOneByOrFail(AddressTest, { id: 4 })

      expect(test.address).toBeNull()
    })

    it('stores and retrieves an address with null coordinates', async () => {
      const address = new AddressBuilder()
        .withCountry('Netherlands')
        .withCity('Amsterdam')
        .withCoordinates(null)
        .build()

      await dataSource.manager.upsert(
        AddressTest,
        { id: 5, address },
        { conflictPaths: { id: true } }
      )

      const test = await dataSource.manager.findOneByOrFail(AddressTest, { id: 5 })

      expect(test.address).not.toBeNull()
      expect(test.address?.country).toBe('Netherlands')
      expect(test.address?.city).toBe('Amsterdam')
      expect(test.address?.coordinates).toBeNull()
    })

    it('updates an existing address', async () => {
      const initialAddress = new AddressBuilder()
        .withCountry('France')
        .withCity('Paris')
        .build()

      await dataSource.manager.upsert(
        AddressTest,
        { id: 6, address: initialAddress },
        { conflictPaths: { id: true } }
      )

      const updatedAddress = new AddressBuilder()
        .withCountry('France')
        .withCity('Lyon')
        .withPostalCode('69000')
        .build()

      await dataSource.manager.upsert(
        AddressTest,
        { id: 6, address: updatedAddress },
        { conflictPaths: { id: true } }
      )

      const test = await dataSource.manager.findOneByOrFail(AddressTest, { id: 6 })

      expect(test.address).not.toBeNull()
      expect(test.address?.country).toBe('France')
      expect(test.address?.city).toBe('Lyon')
      expect(test.address?.postalCode).toBe('69000')
    })
  })
})
