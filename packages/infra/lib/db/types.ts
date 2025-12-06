import type { NetworkStack } from '../network/NetworkStack.js'
import type { SynthNetworkStackOutput } from '../network/types.js'
import type { AppInfraProps } from '../types.js'
import type { DatabaseStack } from './DatabaseStack.js'

export interface DatabaseStackProps extends AppInfraProps {
  network: NetworkStack
}

export interface SynthDatabaseStackProps extends AppInfraProps {
  networkStack: SynthNetworkStackOutput
}

export interface SynthDatabaseStackOutput {
  database: DatabaseStack
}