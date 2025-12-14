import type { SynthCertStackOutput, SynthCertStackProps } from './types.js'
import { CertStack } from './CertStack.js'

export const synthCertStack = (props: SynthCertStackProps): SynthCertStackOutput => {
  const { app } = props

  const cert = new CertStack({ app })

  return { cert }
}