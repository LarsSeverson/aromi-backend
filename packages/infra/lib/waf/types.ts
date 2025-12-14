import type { BaseStackProps } from '../types.js'
import type { WAFStack } from './WAFStack.js'

export interface WAFStackProps extends BaseStackProps {}

export interface SynthWAFStackProps extends BaseStackProps {}

export interface SynthWAFStackOutput {
  waf: WAFStack
}