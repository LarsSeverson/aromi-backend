import type { BaseInfraProps } from '../types.js'
import type { AuthStack } from './AuthStack.js'

export interface AuthStackProps extends BaseInfraProps { }

export interface SynthAuthStackProps extends BaseInfraProps {}

export interface SynthAuthStackOutput {
  auth: AuthStack
}