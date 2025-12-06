import type { AppInfraProps } from '../types.js'
import type { AuthStack } from './AuthStack.js'

export interface AuthStackProps extends AppInfraProps { }

export interface SynthAuthStackProps extends AppInfraProps {}

export interface SynthAuthStackOutput {
  auth: AuthStack
}