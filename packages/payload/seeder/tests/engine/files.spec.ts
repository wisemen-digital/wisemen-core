import {
  mkdir,
  mkdtemp,
  rm,
  writeFile,
} from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
} from 'vitest'

import { resolveFilePath } from '#engine/files'

describe('resolveFilePath', () => {
  let root: string

  beforeAll(async () => {
    root = await mkdtemp(join(tmpdir(), 'seed-assets-'))
    await mkdir(join(root, 'media', 'portraits'), {
      recursive: true,
    })
    await mkdir(join(root, 'images'), {
      recursive: true,
    })
    await writeFile(join(root, 'media', 'hero.jpg'), 'x')
    await writeFile(join(root, 'media', 'portraits', 'jane.png'), 'x')
    await writeFile(join(root, 'images', 'logo.jpg'), 'x')
    await writeFile(join(root, 'flat.jpg'), 'x')
  })

  afterAll(async () => {
    await rm(root, {
      force: true,
      recursive: true,
    })
  })

  it('resolves from the collection subdir (slug default)', async () => {
    await expect(resolveFilePath('hero.jpg', root, [
      'media',
      '',
    ])).resolves.toBe(join(root, 'media', 'hero.jpg'))
  })

  it('resolves via an override subdir', async () => {
    await expect(resolveFilePath('logo.jpg', root, [
      'images',
      '',
    ])).resolves.toBe(join(root, 'images', 'logo.jpg'))
  })

  it('resolves a nested subpath under the subdir', async () => {
    await expect(resolveFilePath('portraits/jane.png', root, [
      'media',
      '',
    ])).resolves.toBe(join(root, 'media', 'portraits', 'jane.png'))
  })

  it('falls back to the assets root', async () => {
    await expect(resolveFilePath('flat.jpg', root, [
      'media',
      '',
    ])).resolves.toBe(join(root, 'flat.jpg'))
  })

  it('tolerates an image extension mismatch', async () => {
    await expect(resolveFilePath('hero.png', root, [
      'media',
      '',
    ])).resolves.toBe(join(root, 'media', 'hero.jpg'))
  })

  it('returns an absolute path as-is', async () => {
    const abs = join(root, 'media', 'hero.jpg')

    await expect(resolveFilePath(abs, root, [
      'media',
      '',
    ])).resolves.toBe(abs)
  })

  it('returns null when nothing matches', async () => {
    await expect(resolveFilePath('missing.jpg', root, [
      'media',
      '',
    ])).resolves.toBeNull()
  })
})
