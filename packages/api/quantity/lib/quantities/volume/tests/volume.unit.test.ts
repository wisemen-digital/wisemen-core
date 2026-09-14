import { describe, it } from 'node:test'
import { expect } from 'expect'
import { Area } from '#lib/quantities/area/area.js'
import { AreaUnit } from '#lib/quantities/area/area-unit.enum.js'
import { Distance } from '#lib/quantities/distance/distance.js'
import { DistanceUnit } from '#lib/quantities/distance/distance-unit.enum.js'
import { Volume } from '#lib/quantities/volume/volume.js'
import { VolumeUnit } from '#lib/quantities/volume/volume-unit.enum.js'

void describe('Volume class', () => {
  void describe('Volume calculations', () => {
    void it('adds volumes', () => {
      const v1 = new Volume(1, VolumeUnit.CUBIC_METER)
      const v2 = new Volume(500, VolumeUnit.LITER)
      const result = v1.add(v2)

      expect(result.isEqualTo(1.5, VolumeUnit.CUBIC_METER)).toBe(true)
    })

    void it('divides volumes by distances into areas', () => {
      const volume = new Volume(2, VolumeUnit.CUBIC_METER)
      const distance = new Distance(50, DistanceUnit.CENTIMETER)
      const result = volume.divide(distance)

      expect(result.isEqualTo(4, AreaUnit.SQUARE_METER)).toBe(true)
    })

    void it('divides volumes by areas into distances', () => {
      const volume = new Volume(1000, VolumeUnit.LITER)
      const area = new Area(2, AreaUnit.SQUARE_METER)
      const result = volume.divide(area)

      expect(result.isEqualTo(50, DistanceUnit.CENTIMETER)).toBe(true)
    })
  })

  void describe('Volume parsing', () => {
    void it('parses volume strings', () => {
      const volume = new Volume('12m³')

      expect(volume.value).toBe(12)
      expect(volume.unit).toBe(VolumeUnit.CUBIC_METER)
    })
  })
})
