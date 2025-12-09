import type { AuthStack } from '../auth/AuthStack.js'
import type { SynthAuthStackOutput } from '../auth/types.js'
import type { CDNStack } from '../cdn/CDNStack.js'
import type { SynthCDNStackOutput } from '../cdn/types.js'
import type { ClusterStack } from '../cluster/ClusterStack.js'
import type { SynthClusterStackOutput } from '../cluster/types.js'
import type { DatabaseStack } from '../db/DatabaseStack.js'
import type { SynthDatabaseStackOutput } from '../db/types.js'
import type { LoadBalancerStack } from '../load-balancer/LoadBalancerStack.js'
import type { SynthLoadBalancerStackOutput } from '../load-balancer/types.js'
import type { MeiliAppStack } from '../meili-search/MeiliAppStack.js'
import type { SynthMeiliStackOutput } from '../meili-search/types.js'
import type { NetworkStack } from '../network/NetworkStack.js'
import type { SynthNetworkStackOutput } from '../network/types.js'
import type { RedisAppStack } from '../redis/RedisAppStack.js'
import type { SynthRedisStackOutput } from '../redis/types.js'
import type { StorageStack } from '../storage/StorageStack.js'
import type { SynthStorageStackOutput } from '../storage/types.js'
import type { BaseComponentProps, BaseStackProps } from '../types.js'
import type { ServerIamComponent } from './components/ServerIam.js'
import type { ServerTaskComponent } from './components/ServerTask.js'
import type { ServerAppStack } from './ServerAppStack.js'
import type { ECRStack } from '../ecr/ECRStack.js'
import type { SynthECRStackOutput } from '../ecr/types.js'

export interface ServerIamComponentProps extends BaseComponentProps {
  auth: AuthStack
  storage: StorageStack
}

export interface ServerTaskComponentProps extends BaseComponentProps {
  auth: AuthStack
  storage: StorageStack
  database: DatabaseStack
  cdn: CDNStack
  ecr: ECRStack

  iam: ServerIamComponent

  meili: MeiliAppStack
  redis: RedisAppStack
}

export interface ServerServiceComponentProps extends BaseComponentProps {
  network: NetworkStack
  cluster: ClusterStack
  loadBalancer: LoadBalancerStack

  taskComponent: ServerTaskComponent
}

export interface ServerAppStackProps extends BaseStackProps {
  network: NetworkStack
  auth: AuthStack
  storage: StorageStack
  database: DatabaseStack
  cdn: CDNStack
  cluster: ClusterStack
  loadBalancer: LoadBalancerStack
  ecr: ECRStack

  meili: MeiliAppStack
  redis: RedisAppStack
}

export interface SynthServerServiceStackProps extends BaseStackProps {
  networkStack: SynthNetworkStackOutput
  authStack: SynthAuthStackOutput
  storageStack: SynthStorageStackOutput
  databaseStack: SynthDatabaseStackOutput
  cdnStack: SynthCDNStackOutput
  clusterStack: SynthClusterStackOutput
  loadBalancerStack: SynthLoadBalancerStackOutput
  ecrStack: SynthECRStackOutput

  meiliStack: SynthMeiliStackOutput
  redisStack: SynthRedisStackOutput
}

export interface SynthServerStackOutput {
  app: ServerAppStack
}