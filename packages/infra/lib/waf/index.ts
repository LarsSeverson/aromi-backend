import type { SynthWAFStackProps } from './types.js'
import { WAFStack } from './WAFStack.js'

export const synthWAFStack = (props: SynthWAFStackProps) => {
  const { app } = props

  const waf = new WAFStack({ app })

  return { waf }
}