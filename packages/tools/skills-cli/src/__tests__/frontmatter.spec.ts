import {
  describe,
  expect,
  it,
} from 'vitest'

import { parseFrontmatter } from '../frontmatter.js'

describe('parseFrontmatter', () => {
  it('parses required fields and body', () => {
    const source = '---\nname: foo\ndescription: does a thing\n---\n# Heading\n\nBody.'
    const {
      body, frontmatter,
    } = parseFrontmatter(source)

    expect(frontmatter.name).toBe('foo')
    expect(frontmatter.description).toBe('does a thing')
    expect(body.trim()).toBe('# Heading\n\nBody.')
  })

  it('rejects missing frontmatter', () => {
    expect(() => parseFrontmatter('# No frontmatter')).toThrowError('frontmatter')
  })

  it('rejects frontmatter without name', () => {
    expect(() => parseFrontmatter('---\ndescription: only description\n---\nbody')).toThrowError('name')
  })

  it('rejects frontmatter without description', () => {
    expect(() => parseFrontmatter('---\nname: only-name\n---\nbody')).toThrowError('description')
  })

  it('preserves unknown frontmatter fields', () => {
    const source = '---\nname: x\ndescription: y\nlibrary: foo\nlibrary_version: ">=1.0.0"\n---\n'
    const {
      frontmatter,
    } = parseFrontmatter(source)

    expect(frontmatter.library).toBe('foo')
    expect(frontmatter.library_version).toBe('>=1.0.0')
  })
})
