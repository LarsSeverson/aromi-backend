import type { ClusterStack } from '../cluster/ClusterStack.js'
import type { SynthClusterStackOutput } from '../cluster/types.js'
import type { NetworkStack } from '../network/NetworkStack.js'
import type { SynthNetworkStackOutput } from '../network/types.js'
import type { AppInfraProps } from '../types.js'
import type { RedisServiceStack } from './RedisServiceStack.js'
import type { RedisTaskStack } from './RedisTaskStack.js'

export interface RedisServiceStackProps extends AppInfraProps {
  network: NetworkStack
  cluster: ClusterStack
  task: RedisTaskStack
}

export interface RedisTaskStackProps extends AppInfraProps {}

export interface SynthRedisServiceStackProps extends AppInfraProps {
  networkStack: SynthNetworkStackOutput
  clusterStack: SynthClusterStackOutput
}

export interface SynthRedisStackOutput {
  task: RedisTaskStack
  service: RedisServiceStack
}