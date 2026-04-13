import { after, before, beforeEach, describe, it } from 'node:test'
import { expect } from 'expect'
import { dataSource } from './sql/datasource.js'
import { IntRangeTest } from './sql/int-range-test.entity.js'
import { MultiIntRangeTest } from './sql/multi-int-range-test.entity.js'
import { IntegrationTestSetup } from './sql/test-setup.js'
import { IntRange } from '#src/int-range.js'
import { OverlapsWith } from '#src/typeorm/overlaps-with.js'
import { ContainsValue } from '#src/typeorm/contains-value.js'
import { Succeeds } from '#src/typeorm/succeeds.js'
import { Precedes } from '#src/typeorm/precedes.js'

describe('IntRangeColumn', () => {
  let setup: IntegrationTestSetup

  before(async () => {
    setup = new IntegrationTestSetup()

    await setup.setup()
  })

  beforeEach(async () => {
    await setup.clear(IntRangeTest)
    await setup.clear(MultiIntRangeTest)
  })

  after(async () => {
    await setup.teardown()
  })

  describe('serialization and deserialization', () => {
    it('stores and retrieves int ranges', async () => {
      const range = new IntRange(1, 100)

      await dataSource.manager.upsert(
        IntRangeTest, { id: 1, range }, { conflictPaths: { id: true } })

      const test = await dataSource.manager.findOneByOrFail(IntRangeTest, { id: 1 })

      expect(test.range.isSame(range)).toBe(true)
    })

    it('stores and retrieves negative int ranges', async () => {
      const range = new IntRange(-100, -10)

      await dataSource.manager.upsert(
        IntRangeTest, { id: 2, range }, { conflictPaths: { id: true } })

      const test = await dataSource.manager.findOneByOrFail(IntRangeTest, { id: 2 })

      expect(test.range.isSame(range)).toBe(true)
    })
  })

  describe('OverlapsWith', () => {
    it('finds ranges that overlap with [50, 150]', async () => {
      const range1 = new IntRange(1, 100)
      const range2 = new IntRange(200, 300)

      await dataSource.manager.upsert(
        IntRangeTest, { id: 10, range: range1 }, { conflictPaths: { id: true } })
      await dataSource.manager.upsert(
        IntRangeTest, { id: 11, range: range2 }, { conflictPaths: { id: true } })

      const results = await dataSource.manager.find(IntRangeTest, {
        where: { range: OverlapsWith(new IntRange(50, 150)) }
      })

      expect(results).toHaveLength(1)
      expect(results[0].id).toBe(10)
    })
  })

  describe('ContainsValue', () => {
    it('finds ranges that contain value 50', async () => {
      const range1 = new IntRange(1, 100)
      const range2 = new IntRange(200, 300)

      await dataSource.manager.upsert(
        IntRangeTest, { id: 20, range: range1 }, { conflictPaths: { id: true } })
      await dataSource.manager.upsert(
        IntRangeTest, { id: 21, range: range2 }, { conflictPaths: { id: true } })

      const results = await dataSource.manager.find(IntRangeTest, {
        where: { range: ContainsValue(50) }
      })

      expect(results).toHaveLength(1)
      expect(results[0].id).toBe(20)
    })
  })

  describe('Precedes', () => {
    it('finds ranges that precede [101, 200]', async () => {
      const range1 = new IntRange(1, 100)
      const range2 = new IntRange(200, 300)

      await dataSource.manager.upsert(
        IntRangeTest, { id: 30, range: range1 }, { conflictPaths: { id: true } })
      await dataSource.manager.upsert(
        IntRangeTest, { id: 31, range: range2 }, { conflictPaths: { id: true } })

      const results = await dataSource.manager.find(IntRangeTest, {
        where: { range: Precedes(new IntRange(101, 200)) }
      })

      expect(results).toHaveLength(1)
      expect(results[0].id).toBe(30)
    })
  })

  describe('Succeeds', () => {
    it('finds ranges that succeed [1, 100]', async () => {
      const range1 = new IntRange(1, 100)
      const range2 = new IntRange(101, 200)

      await dataSource.manager.upsert(
        IntRangeTest, { id: 40, range: range1 }, { conflictPaths: { id: true } })
      await dataSource.manager.upsert(
        IntRangeTest, { id: 41, range: range2 }, { conflictPaths: { id: true } })

      const results = await dataSource.manager.find(IntRangeTest, {
        where: { range: Succeeds(new IntRange(1, 100)) }
      })

      expect(results).toHaveLength(1)
      expect(results[0].id).toBe(41)
    })
  })

  describe('MultiIntRangeColumn', () => {
    it('stores and retrieves multiple int ranges', async () => {
      const ranges = [
        new IntRange(1, 10),
        new IntRange(20, 30),
        new IntRange(40, 50)
      ]

      await dataSource.manager.upsert(
        MultiIntRangeTest, { id: 1, ranges }, { conflictPaths: { id: true } })

      const test = await dataSource.manager.findOneByOrFail(MultiIntRangeTest, { id: 1 })

      expect(test.ranges).toHaveLength(3)
      expect(test.ranges[0].isSame(ranges[0])).toBe(true)
      expect(test.ranges[1].isSame(ranges[1])).toBe(true)
      expect(test.ranges[2].isSame(ranges[2])).toBe(true)
    })
  })
})
