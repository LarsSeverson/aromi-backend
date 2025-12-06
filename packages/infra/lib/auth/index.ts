import { AuthStack } from './AuthStack.js'
import type { SynthAuthStackProps } from './types.js'

export const synthAuthStack = (props: SynthAuthStackProps) => {
  const { app } = props
  const auth = new AuthStack({ app })

  return { auth }
}