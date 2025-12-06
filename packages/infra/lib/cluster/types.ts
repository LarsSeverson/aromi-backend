import type { NetworkStack } from '../network/NetworkStack.js'
import type { SynthNetworkStackOutput } from '../network/types.js'
import type { BaseInfraProps } from '../types.js'
import type { ClusterStack } from './ClusterStack.js'

export interface ClusterStackProps extends BaseInfraProps {
  network: NetworkStack
}

export interface SynthClusterStackProps extends BaseInfraProps {
  networkStack: SynthNetworkStackOutput
}

export interface SynthClusterStackOutput {
  cluster: ClusterStack
}