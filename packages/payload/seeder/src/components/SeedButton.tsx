import type React from 'react'

import { seedingEnabled } from '#guard'

import type { SeedButtonProps } from './SeedButtonClient'
import { SeedButtonClient } from './SeedButtonClient'

export type { SeedButtonProps }

export const SeedButton: React.FC<SeedButtonProps> = ({
  endpoint,
}) => (seedingEnabled() ? <SeedButtonClient endpoint={endpoint} /> : null)

export default SeedButton
