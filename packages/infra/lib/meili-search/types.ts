import type { ClusterStack } from '../cluster/ClusterStack.js'
import type { SynthClusterStackOutput } from '../cluster/types.js'
import type { NetworkStack } from '../network/NetworkStack.js'
import type { SynthNetworkStackOutput } from '../network/types.js'
import type { BaseComponentProps, BaseStackProps } from '../types.js'
import type { MeiliEFSComponent } from './components/MeiliEFS.js'
import type { MeiliTaskComponent } from './components/MeiliTask.js'
import type { MeiliAppStack } from './MeiliAppStack.js'
import type { MeiliInfraStack } from './MeiliInfraStack.js'

export interface MeiliEFSComponentProps extends BaseComponentProps {
  network: NetworkStack
}

export interface MeiliTaskComponentProps extends BaseComponentProps {
  efsComponent: MeiliEFSComponent
}

export interface MeiliServiceComponentProps extends BaseComponentProps {
  network: NetworkStack
  cluster: ClusterStack

  taskComponent: MeiliTaskComponent
  efsComponent: MeiliEFSComponent
}

export interface MeiliInfraStackProps extends BaseStackProps {
  network: NetworkStack
}

export interface MeiliAppStackProps extends BaseStackProps {
  network: NetworkStack
  cluster: ClusterStack
  infra: MeiliInfraStack
}

export interface SynthMeiliStackProps extends BaseStackProps {
  networkStack: SynthNetworkStackOutput
  clusterStack: SynthClusterStackOutput
}

export interface SynthMeiliStackOutput {
  infra: MeiliInfraStack
  app: MeiliAppStack
}