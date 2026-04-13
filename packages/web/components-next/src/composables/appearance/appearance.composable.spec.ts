import { useStorage } from '@vueuse/core'
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import { ref } from 'vue'

import type { Appearance } from '@/composables'
import { useAppearance } from '@/composables'

vi.mock('@vueuse/core', () => {
  return {
    useStorage: vi.fn(),
  }
})

describe('useAppearance', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should call useStorage with the correct arguments', () => {
    vi.mocked(useStorage).mockReturnValue(ref<string>('light'))

    useAppearance()

    expect(useStorage).toHaveBeenCalledWith('theme', expect.any(Function))

    const defaultValueFn = vi.mocked(useStorage).mock.calls[0]?.[1] as unknown as () => string

    expect(defaultValueFn()).toBe('light')
  })

  it('should return the ref from useStorage', () => {
    const mockRef = ref<Appearance>('light')

    vi.mocked(useStorage).mockReturnValue(mockRef)

    const result = useAppearance()

    expect(result).toBe(mockRef)
    expect(result.value).toBe('light')
  })

  it('should handle different appearance values', () => {
    const darkRef = ref<Appearance>('dark')

    vi.mocked(useStorage).mockReturnValue(darkRef)

    const darkResult = useAppearance()

    expect(darkResult.value).toBe('dark')

    // Reset the mock
    vi.resetAllMocks()

    const systemRef = ref<Appearance>('system')

    vi.mocked(useStorage).mockReturnValue(systemRef)

    const systemResult = useAppearance()

    expect(systemResult.value).toBe('system')
  })
})
