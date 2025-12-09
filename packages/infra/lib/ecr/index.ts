import { ECRStack } from './ECRStack.js'
import type { SynthECRProps } from './types.js'

export const synthECRStack = (props: SynthECRProps) => {
  const { app } = props

  const ecr = new ECRStack({ app })

  return {
    ecr
  }
}