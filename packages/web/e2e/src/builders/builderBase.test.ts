import {
  describe,
  expect,
  it,
} from 'vitest'

import { BuilderBase } from '@/builders/builderBase'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

interface Widget {
  uuid: string
  name: string
  tags: string[]
}

class WidgetBuilder extends BuilderBase<Widget> {
  constructor(initial?: Partial<Widget>) {
    super({
      uuid: BuilderBase.randomUuid(),
      name: 'Default',
      tags: [],
      ...initial,
    })
  }

  withName(name: string): this {
    this.value.name = name

    return this
  }

  withTags(tags: string[]): this {
    this.value.tags = tags

    return this
  }
}

describe('builderBase', () => {
  it('builds an object with the seeded defaults', () => {
    const widget = new WidgetBuilder().build()

    expect(widget.name).toBe('Default')
    expect(widget.tags).toEqual([])
    expect(widget.uuid).toMatch(UUID_REGEX)
  })

  it('applies chained with* overrides', () => {
    const widget = new WidgetBuilder()
      .withName('Renamed')
      .withTags([
        'a',
        'b',
      ])
      .build()

    expect(widget.name).toBe('Renamed')
    expect(widget.tags).toEqual([
      'a',
      'b',
    ])
  })

  it('returns a deep clone so later mutation does not leak into built objects', () => {
    const builder = new WidgetBuilder().withTags([
      'a',
    ])
    const first = builder.build()

    builder.withTags([
      'a',
      'b',
    ])

    const second = builder.build()

    expect(first.tags).toEqual([
      'a',
    ])
    expect(second.tags).toEqual([
      'a',
      'b',
    ])
  })

  it('honours the initial partial passed to the constructor', () => {
    const widget = new WidgetBuilder({
      name: 'Seeded',
    }).build()

    expect(widget.name).toBe('Seeded')
  })

  it('generates unique uuids', () => {
    expect(BuilderBase.randomUuid()).not.toBe(BuilderBase.randomUuid())
  })
})
