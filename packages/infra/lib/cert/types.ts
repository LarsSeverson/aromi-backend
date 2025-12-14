import type { BaseStackProps } from '../types.js'
import type { CertStack } from './CertStack.js'

export interface CertStackProps extends BaseStackProps {}

export interface SynthCertStackProps extends BaseStackProps {}

export interface SynthCertStackOutput {
  cert: CertStack
}