import type { NetworkStack } from '../network/NetworkStack.js'
import type { SynthNetworkStackOutput } from '../network/types.js'
import type { BaseInfraProps } from '../types.js'
import type { DatabaseStack } from './DatabaseStack.js'

export interface DatabaseStackProps extends BaseInfraProps {
  network: NetworkStack
}

export interface SynthDatabaseStackProps extends BaseInfraProps {
  networkStack: SynthNetworkStackOutput
}

export interface SynthDatabaseStackOutput {
  database: DatabaseStack
}