import type { AppInfraProps } from '../types.js'
import type { NetworkStack } from './NetworkStack.js'

export interface NetworkStackProps extends AppInfraProps { }

export interface SynthNetworkStackProps extends AppInfraProps { }

export interface SynthNetworkStackOutput {
  network: NetworkStack
}