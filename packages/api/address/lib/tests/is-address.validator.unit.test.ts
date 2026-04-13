import { describe, it } from 'node:test'
import { validate } from 'class-validator'
import { expect } from 'expect'
import { plainToInstance } from 'class-transformer'
import { AddressCommand } from '../address-command.js'
import { IsAddress } from '../is-address.validator.js'

class TestClass {
  @IsAddress()
  address: AddressCommand
}

class TestClassWithRequiredFields {
  @IsAddress({
    countryRequired: true,
    cityRequired: true,
    postalCodeRequired: true,
    streetNameRequired: true
  })
  address: AddressCommand
}

class TestClassWithPlaceIdRequired {
  @IsAddress({
    placeIdRequired: true
  })
  address: AddressCommand
}

class TestClassWithPlaceNameRequired {
  @IsAddress({
    placeNameRequired: true
  })
  address: AddressCommand
}

describe('IsAddress decorator test', () => {
  it('should pass validation when the address has all fields', async () => {
    const testInstance = new TestClass()
    const addressCommand = new AddressCommand()

    addressCommand.country = 'Belgium'
    addressCommand.countryCode = 'BE'
    addressCommand.city = 'Brussels'
    addressCommand.postalCode = '1000'
    addressCommand.streetName = 'Main Street'
    addressCommand.streetNumber = '123'
    addressCommand.unit = null
    addressCommand.placeName = null
    addressCommand.placeId = null
    addressCommand.coordinates = null

    testInstance.address = addressCommand

    const errors = await validate(testInstance)

    expect(errors.length).toBe(0)
  })

  it('should pass validation when the address has only some fields', async () => {
    const testInstance = new TestClass()
    const addressCommand = new AddressCommand()

    addressCommand.country = 'Belgium'
    addressCommand.countryCode = null
    addressCommand.city = null
    addressCommand.postalCode = null
    addressCommand.streetName = null
    addressCommand.streetNumber = null
    addressCommand.unit = null
    addressCommand.placeName = null
    addressCommand.placeId = null
    addressCommand.coordinates = null

    testInstance.address = addressCommand

    const errors = await validate(testInstance)

    expect(errors.length).toBe(0)
  })

  it('should fail validation when required fields are missing', async () => {
    const testInstance = new TestClassWithRequiredFields()
    const addressCommand = new AddressCommand()

    addressCommand.country = null
    addressCommand.city = null
    addressCommand.postalCode = null
    addressCommand.streetName = null
    addressCommand.streetNumber = null
    addressCommand.unit = null
    addressCommand.placeName = null
    addressCommand.placeId = null
    addressCommand.coordinates = null

    testInstance.address = addressCommand

    const errors = await validate(testInstance)

    expect(errors.length).toBe(1)
    expect(errors[0].constraints?.isAddress).toContain('countryRequired')
    expect(errors[0].constraints?.isAddress).toContain('cityRequired')
    expect(errors[0].constraints?.isAddress).toContain('postalCodeRequired')
    expect(errors[0].constraints?.isAddress).toContain('streetNameRequired')
  })

  it('should pass validation when all required fields are provided', async () => {
    const testInstance = new TestClassWithRequiredFields()
    const addressCommand = new AddressCommand()

    addressCommand.country = 'Belgium'
    addressCommand.countryCode = null
    addressCommand.city = 'Brussels'
    addressCommand.postalCode = '1000'
    addressCommand.streetName = 'Main Street'
    addressCommand.streetNumber = null
    addressCommand.unit = null
    addressCommand.placeName = null
    addressCommand.placeId = null
    addressCommand.coordinates = null

    testInstance.address = addressCommand

    const errors = await validate(testInstance)

    expect(errors.length).toBe(0)
  })

  it('should fail validation when some required fields are missing', async () => {
    const testInstance = new TestClassWithRequiredFields()
    const addressCommand = new AddressCommand()

    addressCommand.country = 'Belgium'
    addressCommand.city = 'Brussels'
    addressCommand.postalCode = null
    addressCommand.streetName = null
    addressCommand.streetNumber = null
    addressCommand.unit = null
    addressCommand.placeName = null
    addressCommand.placeId = null
    addressCommand.coordinates = null

    testInstance.address = addressCommand

    const errors = await validate(testInstance)

    expect(errors.length).toBe(1)
    expect(errors[0].constraints?.isAddress).toContain('postalCodeRequired')
    expect(errors[0].constraints?.isAddress).toContain('streetNameRequired')
  })

  it('should fail validation when the address is not an AddressCommand instance', async () => {
    const testInstance = new TestClass()

    testInstance.address = plainToInstance(AddressCommand, { country: 'Belgium' })

    const errors = await validate(testInstance)

    expect(errors.length).toBeGreaterThan(0)
  })

  it('should fail validation when placeId is required but missing', async () => {
    const testInstance = new TestClassWithPlaceIdRequired()
    const addressCommand = new AddressCommand()

    addressCommand.country = 'Belgium'
    addressCommand.countryCode = 'BE'
    addressCommand.city = 'Brussels'
    addressCommand.postalCode = '1000'
    addressCommand.streetName = 'Main Street'
    addressCommand.streetNumber = '123'
    addressCommand.unit = null
    addressCommand.placeName = null
    addressCommand.placeId = null
    addressCommand.coordinates = null

    testInstance.address = addressCommand

    const errors = await validate(testInstance)

    expect(errors.length).toBe(1)
    expect(errors[0].constraints?.isAddress).toContain('placeIdRequired')
  })

  it('should pass validation when placeId is required and provided', async () => {
    const testInstance = new TestClassWithPlaceIdRequired()
    const addressCommand = new AddressCommand()

    addressCommand.country = 'Belgium'
    addressCommand.countryCode = 'BE'
    addressCommand.city = 'Brussels'
    addressCommand.postalCode = '1000'
    addressCommand.streetName = 'Main Street'
    addressCommand.streetNumber = '123'
    addressCommand.unit = null
    addressCommand.placeName = null
    addressCommand.placeId = 'ChIJN1t_tDeuEmsRUsoyG83frY4'
    addressCommand.coordinates = null

    testInstance.address = addressCommand

    const errors = await validate(testInstance)

    expect(errors.length).toBe(0)
  })

  it('should fail validation when placeName is required but missing', async () => {
    const testInstance = new TestClassWithPlaceNameRequired()
    const addressCommand = new AddressCommand()

    addressCommand.country = 'Belgium'
    addressCommand.countryCode = 'BE'
    addressCommand.city = 'Brussels'
    addressCommand.postalCode = '1000'
    addressCommand.streetName = 'Main Street'
    addressCommand.streetNumber = '123'
    addressCommand.unit = null
    addressCommand.placeName = null
    addressCommand.placeId = null
    addressCommand.coordinates = null

    testInstance.address = addressCommand

    const errors = await validate(testInstance)

    expect(errors.length).toBe(1)
    expect(errors[0].constraints?.isAddress).toContain('placeNameRequired')
  })

  it('should pass validation when placeName is required and provided', async () => {
    const testInstance = new TestClassWithPlaceNameRequired()
    const addressCommand = new AddressCommand()

    addressCommand.country = 'Belgium'
    addressCommand.countryCode = 'BE'
    addressCommand.city = 'Brussels'
    addressCommand.postalCode = '1000'
    addressCommand.streetName = 'Main Street'
    addressCommand.streetNumber = '123'
    addressCommand.unit = null
    addressCommand.placeName = 'wisemen'
    addressCommand.placeId = null
    addressCommand.coordinates = null

    testInstance.address = addressCommand

    const errors = await validate(testInstance)

    expect(errors.length).toBe(0)
  })
})
