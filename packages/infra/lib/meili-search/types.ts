import type { ClusterStack } from '../cluster/ClusterStack.js'
import type { SynthClusterStackOutput } from '../cluster/types.js'
import type { NetworkStack } from '../network/NetworkStack.js'
import type { SynthNetworkStackOutput } from '../network/types.js'
import type { AppInfraProps } from '../types.js'
import type { MeiliServiceStack } from './MeiliServiceStack.js'
import type { MeiliStorageStack } from './MeiliStorageStack.js'
import type { MeiliTaskStack } from './MeiliTaskStack.js'

export interface MeiliStorageStackProps extends AppInfraProps {
  network: NetworkStack
}

export interface MeiliECRStackProps extends AppInfraProps { }

export interface MeiliTaskStackProps extends AppInfraProps {
  storage: MeiliStorageStack
}

export interface MeiliServiceStackProps extends AppInfraProps {
  network: NetworkStack

  cluster: ClusterStack
  storage: MeiliStorageStack
  task: MeiliTaskStack
}

export interface SynthMeiliStackProps extends AppInfraProps {
  networkStack: SynthNetworkStackOutput
  clusterStack: SynthClusterStackOutput
}

export interface SynthMeiliStackOutput {
  storage: MeiliStorageStack
  task: MeiliTaskStack
  service: MeiliServiceStack
}