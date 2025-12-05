import type { AuthStack } from '../auth/AuthStack.js'
import type { CDNStack } from '../cdn/CDNStack.js'
import type { ClusterStack } from '../cluster/ClusterStack.js'
import type { DatabaseStack } from '../db/DatabaseStack.js'
import type { MeiliTaskStack } from '../meili-search/MeiliTaskStack.js'
import type { NetworkStack } from '../network/NetworkStack.js'
import type { StorageStack } from '../storage/StorageStack.js'
import type { AppInfraProps } from '../types.js'
import type { ServerECRStack } from './ServerECRStack.js'
import type { ServerLoadBalancerStack } from './ServerLoadBalancerStack.js'
import type { ServerTaskStack } from './ServerTaskStack.js'

export interface ServerECRStackProps extends AppInfraProps {}

export interface ServerIamStackProps extends AppInfraProps {
  auth: AuthStack
  storage: StorageStack
}

export interface ServerLoadBalancerStackProps extends AppInfraProps {
  network: NetworkStack
}

export interface ServerServiceStackProps extends AppInfraProps {
  network: NetworkStack
  cluster: ClusterStack
  task: ServerTaskStack
  lb: ServerLoadBalancerStack
}

export interface ServerTaskStackProps extends AppInfraProps {
  ecr: ServerECRStack
  db: DatabaseStack
  storage: StorageStack
  auth: AuthStack
  cdn: CDNStack
  meili: MeiliTaskStack
}