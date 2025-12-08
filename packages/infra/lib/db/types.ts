import type { NetworkStack } from '../network/NetworkStack.js'
import type { SynthNetworkStackOutput } from '../network/types.js'
import type { BaseStackProps } from '../types.js'
import type { DatabaseStack } from './DatabaseStack.js'

export interface DatabaseStackProps extends BaseStackProps {
  network: NetworkStack
}

export interface SynthDatabaseStackProps extends BaseStackProps {
  networkStack: SynthNetworkStackOutput
}

export interface SynthDatabaseStackOutput {
  database: DatabaseStack
}