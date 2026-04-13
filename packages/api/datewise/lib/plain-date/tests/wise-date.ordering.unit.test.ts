import { before, describe, it } from 'node:test'
import { expect } from 'expect'
import { FutureInfinityDate } from '../future-infinity-date.js'
import { PastInfinityDate } from '../past-infinity-date.js'
import { initDayjs } from '../../common/init-dayjs.js'
import { plainDate } from '../index.js'

describe('PlainDate ordering', () => {
  before(() => initDayjs())

  describe('relative order of dates', () => {
    describe('today relative to others', () => {
      it('respects ordering of today relative to tomorrow', () => {
        expect(plainDate.today().isBefore(plainDate.tomorrow())).toBe(true)
        expect(plainDate.today().isAfter(plainDate.tomorrow())).toBe(false)
        expect(plainDate.today().isSame(plainDate.tomorrow())).toBe(false)
      })

      it('respects ordering of today relative to today', () => {
        expect(plainDate.today().isBefore(plainDate.today())).toBe(false)
        expect(plainDate.today().isAfter(plainDate.today())).toBe(false)
        expect(plainDate.today().isSame(plainDate.today())).toBe(true)
      })

      it('respects ordering of today relative to yesterday', () => {
        expect(plainDate.today().isBefore(plainDate.yesterday())).toBe(false)
        expect(plainDate.today().isAfter(plainDate.yesterday())).toBe(true)
        expect(plainDate.today().isSame(plainDate.yesterday())).toBe(false)
      })

      it('respects ordering of today relative to future infinity', () => {
        expect(plainDate.today().isBefore(new FutureInfinityDate())).toBe(true)
        expect(plainDate.today().isAfter(new FutureInfinityDate())).toBe(false)
        expect(plainDate.today().isSame(new FutureInfinityDate())).toBe(false)
      })

      it('respects ordering of today relative to past infinity', () => {
        expect(plainDate.today().isBefore(new PastInfinityDate())).toBe(false)
        expect(plainDate.today().isAfter(new PastInfinityDate())).toBe(true)
        expect(plainDate.today().isSame(new PastInfinityDate())).toBe(false)
      })
    })

    describe('yesterday relative to others', () => {
      it('respects ordering of yesterday relative to tomorrow', () => {
        expect(plainDate.yesterday().isBefore(plainDate.tomorrow())).toBe(true)
        expect(plainDate.yesterday().isAfter(plainDate.tomorrow())).toBe(false)
        expect(plainDate.yesterday().isSame(plainDate.tomorrow())).toBe(false)
      })

      it('respects ordering of yesterday relative to today', () => {
        expect(plainDate.yesterday().isBefore(plainDate.today())).toBe(true)
        expect(plainDate.yesterday().isAfter(plainDate.today())).toBe(false)
        expect(plainDate.yesterday().isSame(plainDate.today())).toBe(false)
      })

      it('respects ordering of yesterday relative to yesterday', () => {
        expect(plainDate.yesterday().isBefore(plainDate.yesterday())).toBe(false)
        expect(plainDate.yesterday().isAfter(plainDate.yesterday())).toBe(false)
        expect(plainDate.yesterday().isSame(plainDate.yesterday())).toBe(true)
      })

      it('respects ordering of yesterday relative to future infinity', () => {
        expect(plainDate.yesterday().isBefore(new FutureInfinityDate())).toBe(true)
        expect(plainDate.yesterday().isAfter(new FutureInfinityDate())).toBe(false)
        expect(plainDate.yesterday().isSame(new FutureInfinityDate())).toBe(false)
      })

      it('respects ordering of yesterday relative to past infinity', () => {
        expect(plainDate.yesterday().isBefore(new PastInfinityDate())).toBe(false)
        expect(plainDate.yesterday().isAfter(new PastInfinityDate())).toBe(true)
        expect(plainDate.yesterday().isSame(new PastInfinityDate())).toBe(false)
      })
    })

    describe('tomorrow relative to others', () => {
      it('respects ordering of tomorrow relative to tomorrow', () => {
        expect(plainDate.tomorrow().isBefore(plainDate.tomorrow())).toBe(false)
        expect(plainDate.tomorrow().isAfter(plainDate.tomorrow())).toBe(false)
        expect(plainDate.tomorrow().isSame(plainDate.tomorrow())).toBe(true)
      })

      it('respects ordering of tomorrow relative to today', () => {
        expect(plainDate.tomorrow().isBefore(plainDate.today())).toBe(false)
        expect(plainDate.tomorrow().isAfter(plainDate.today())).toBe(true)
        expect(plainDate.tomorrow().isSame(plainDate.today())).toBe(false)
      })

      it('respects ordering of tomorrow relative to yesterday', () => {
        expect(plainDate.tomorrow().isBefore(plainDate.yesterday())).toBe(false)
        expect(plainDate.tomorrow().isAfter(plainDate.yesterday())).toBe(true)
        expect(plainDate.tomorrow().isSame(plainDate.yesterday())).toBe(false)
      })

      it('respects ordering of tomorrow relative to future infinity', () => {
        expect(plainDate.tomorrow().isBefore(new FutureInfinityDate())).toBe(true)
        expect(plainDate.tomorrow().isAfter(new FutureInfinityDate())).toBe(false)
        expect(plainDate.tomorrow().isSame(new FutureInfinityDate())).toBe(false)
      })

      it('respects ordering of tomorrow relative to past infinity', () => {
        expect(plainDate.tomorrow().isBefore(new PastInfinityDate())).toBe(false)
        expect(plainDate.tomorrow().isAfter(new PastInfinityDate())).toBe(true)
        expect(plainDate.tomorrow().isSame(new PastInfinityDate())).toBe(false)
      })
    })

    describe('tomorrow relative to others', () => {
      it('respects ordering of tomorrow relative to tomorrow', () => {
        expect(plainDate.tomorrow().isBefore(plainDate.tomorrow())).toBe(false)
        expect(plainDate.tomorrow().isAfter(plainDate.tomorrow())).toBe(false)
        expect(plainDate.tomorrow().isSame(plainDate.tomorrow())).toBe(true)
      })

      it('respects ordering of tomorrow relative to today', () => {
        expect(plainDate.tomorrow().isBefore(plainDate.today())).toBe(false)
        expect(plainDate.tomorrow().isAfter(plainDate.today())).toBe(true)
        expect(plainDate.tomorrow().isSame(plainDate.today())).toBe(false)
      })

      it('respects ordering of tomorrow relative to yesterday', () => {
        expect(plainDate.tomorrow().isBefore(plainDate.yesterday())).toBe(false)
        expect(plainDate.tomorrow().isAfter(plainDate.yesterday())).toBe(true)
        expect(plainDate.tomorrow().isSame(plainDate.yesterday())).toBe(false)
      })

      it('respects ordering of tomorrow relative to future infinity', () => {
        expect(plainDate.tomorrow().isBefore(new FutureInfinityDate())).toBe(true)
        expect(plainDate.tomorrow().isAfter(new FutureInfinityDate())).toBe(false)
        expect(plainDate.tomorrow().isSame(new FutureInfinityDate())).toBe(false)
      })

      it('respects ordering of tomorrow relative to past infinity', () => {
        expect(plainDate.tomorrow().isBefore(new PastInfinityDate())).toBe(false)
        expect(plainDate.tomorrow().isAfter(new PastInfinityDate())).toBe(true)
        expect(plainDate.tomorrow().isSame(new PastInfinityDate())).toBe(false)
      })
    })

    describe('future infinity relative to others', () => {
      it('respects ordering of future infinity relative to tomorrow', () => {
        expect(new FutureInfinityDate().isBefore(plainDate.tomorrow())).toBe(false)
        expect(new FutureInfinityDate().isAfter(plainDate.tomorrow())).toBe(true)
        expect(new FutureInfinityDate().isSame(plainDate.tomorrow())).toBe(false)
      })

      it('respects ordering of future infinity relative to today', () => {
        expect(new FutureInfinityDate().isBefore(plainDate.today())).toBe(false)
        expect(new FutureInfinityDate().isAfter(plainDate.today())).toBe(true)
        expect(new FutureInfinityDate().isSame(plainDate.today())).toBe(false)
      })

      it('respects ordering of future infinity relative to yesterday', () => {
        expect(new FutureInfinityDate().isBefore(plainDate.yesterday())).toBe(false)
        expect(new FutureInfinityDate().isAfter(plainDate.yesterday())).toBe(true)
        expect(new FutureInfinityDate().isSame(plainDate.yesterday())).toBe(false)
      })

      it('respects ordering of future infinity relative to future infinity', () => {
        expect(new FutureInfinityDate().isBefore(new FutureInfinityDate())).toBe(false)
        expect(new FutureInfinityDate().isAfter(new FutureInfinityDate())).toBe(true)
        expect(new FutureInfinityDate().isSame(new FutureInfinityDate())).toBe(true)
      })

      it('respects ordering of future infinity relative to past infinity', () => {
        expect(new FutureInfinityDate().isBefore(new PastInfinityDate())).toBe(false)
        expect(new FutureInfinityDate().isAfter(new PastInfinityDate())).toBe(true)
        expect(new FutureInfinityDate().isSame(new PastInfinityDate())).toBe(false)
      })
    })

    describe('past infinity relative to others', () => {
      it('respects ordering of past infinity relative to tomorrow', () => {
        expect(new PastInfinityDate().isBefore(plainDate.tomorrow())).toBe(true)
        expect(new PastInfinityDate().isAfter(plainDate.tomorrow())).toBe(false)
        expect(new PastInfinityDate().isSame(plainDate.tomorrow())).toBe(false)
      })

      it('respects ordering of past infinity relative to today', () => {
        expect(new PastInfinityDate().isBefore(plainDate.today())).toBe(true)
        expect(new PastInfinityDate().isAfter(plainDate.today())).toBe(false)
        expect(new PastInfinityDate().isSame(plainDate.today())).toBe(false)
      })

      it('respects ordering of past infinity relative to yesterday', () => {
        expect(new PastInfinityDate().isBefore(plainDate.yesterday())).toBe(true)
        expect(new PastInfinityDate().isAfter(plainDate.yesterday())).toBe(false)
        expect(new PastInfinityDate().isSame(plainDate.yesterday())).toBe(false)
      })

      it('respects ordering of past infinity relative to future infinity', () => {
        expect(new PastInfinityDate().isBefore(new FutureInfinityDate())).toBe(true)
        expect(new PastInfinityDate().isAfter(new FutureInfinityDate())).toBe(false)
        expect(new PastInfinityDate().isSame(new FutureInfinityDate())).toBe(false)
      })

      it('respects ordering of past infinity relative to past infinity', () => {
        expect(new PastInfinityDate().isBefore(new PastInfinityDate())).toBe(true)
        expect(new PastInfinityDate().isAfter(new PastInfinityDate())).toBe(false)
        expect(new PastInfinityDate().isSame(new PastInfinityDate())).toBe(true)
      })
    })
  })
})
