import type { ClusterStack } from '../cluster/ClusterStack.js'
import type { SynthClusterStackOutput } from '../cluster/types.js'
import type { NetworkStack } from '../network/NetworkStack.js'
import type { SynthNetworkStackOutput } from '../network/types.js'
import type { BaseComponentProps, BaseInfraProps } from '../types.js'
import type { RedisTaskComponent } from './components/RedisTask.js'
import type { RedisAppStack } from './RedisAppStack.js'

export interface RedisAppStackProps extends BaseInfraProps {
  network: NetworkStack
  cluster: ClusterStack
}

export interface RedisTaskComponentProps extends BaseComponentProps {}

export interface RedisServiceComponentProps extends BaseComponentProps {
  network: NetworkStack
  cluster: ClusterStack
  taskComponent: RedisTaskComponent
}

export interface SynthRedisServiceStackProps extends BaseInfraProps {
  networkStack: SynthNetworkStackOutput
  clusterStack: SynthClusterStackOutput
}

export interface SynthRedisStackOutput {
  app: RedisAppStack
}