import type { BaseInfraProps } from '../types.js'
import type { NetworkStack } from './NetworkStack.js'

export interface NetworkStackProps extends BaseInfraProps { }

export interface SynthNetworkStackProps extends BaseInfraProps { }

export interface SynthNetworkStackOutput {
  network: NetworkStack
}