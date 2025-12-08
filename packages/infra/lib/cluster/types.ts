import type { NetworkStack } from '../network/NetworkStack.js'
import type { SynthNetworkStackOutput } from '../network/types.js'
import type { BaseStackProps } from '../types.js'
import type { ClusterStack } from './ClusterStack.js'

export interface ClusterStackProps extends BaseStackProps {
  network: NetworkStack
}

export interface SynthClusterStackProps extends BaseStackProps {
  networkStack: SynthNetworkStackOutput
}

export interface SynthClusterStackOutput {
  cluster: ClusterStack
}