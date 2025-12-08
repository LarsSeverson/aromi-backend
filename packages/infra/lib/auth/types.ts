import type { BaseStackProps } from '../types.js'
import type { AuthStack } from './AuthStack.js'

export interface AuthStackProps extends BaseStackProps { }

export interface SynthAuthStackProps extends BaseStackProps {}

export interface SynthAuthStackOutput {
  auth: AuthStack
}