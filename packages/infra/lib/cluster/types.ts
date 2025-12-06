import type { NetworkStack } from '../network/NetworkStack.js'
import type { SynthNetworkStackOutput } from '../network/types.js'
import type { AppInfraProps } from '../types.js'
import type { ClusterStack } from './ClusterStack.js'

export interface ClusterStackProps extends AppInfraProps {
  network: NetworkStack
}

export interface SynthClusterStackProps extends AppInfraProps {
  networkStack: SynthNetworkStackOutput
}

export interface SynthClusterStackOutput {
  cluster: ClusterStack
}