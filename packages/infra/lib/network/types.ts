import type { BaseStackProps } from '../types.js'
import type { NetworkStack } from './NetworkStack.js'

export interface NetworkStackProps extends BaseStackProps { }

export interface SynthNetworkStackProps extends BaseStackProps { }

export interface SynthNetworkStackOutput {
  network: NetworkStack
}