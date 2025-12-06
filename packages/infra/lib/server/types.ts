import type { AuthStack } from '../auth/AuthStack.js'
import type { SynthAuthStackOutput } from '../auth/types.js'
import type { CDNStack } from '../cdn/CDNStack.js'
import type { SynthCDNStackOutput } from '../cdn/types.js'
import type { ClusterStack } from '../cluster/ClusterStack.js'
import type { SynthClusterStackOutput } from '../cluster/types.js'
import type { DatabaseStack } from '../db/DatabaseStack.js'
import type { SynthDatabaseStackOutput } from '../db/types.js'
import type { MeiliTaskStack } from '../meili-search/MeiliTaskStack.js'
import type { SynthMeiliStackOutput } from '../meili-search/types.js'
import type { NetworkStack } from '../network/NetworkStack.js'
import type { SynthNetworkStackOutput } from '../network/types.js'
import type { AppInfraProps } from '../types.js'
import type { ServerECRStack } from './ServerECRStack.js'
import type { ServerIamStack } from './ServerIamStack.js'
import type { ServerLoadBalancerStack } from './ServerLoadBalancerStack.js'
import type { ServerTaskStack } from './ServerTaskStack.js'

export interface ServerECRStackProps extends AppInfraProps {}

export interface ServerIamStackProps extends AppInfraProps {
  auth: AuthStack
  cdn: CDNStack
}

export interface ServerLoadBalancerStackProps extends AppInfraProps {
  network: NetworkStack
}

export interface ServerServiceStackProps extends AppInfraProps {
  network: NetworkStack
  cluster: ClusterStack
  task: ServerTaskStack
  serverLoadBalancer: ServerLoadBalancerStack
}

export interface ServerTaskStackProps extends AppInfraProps {
  auth: AuthStack
  database: DatabaseStack
  cdn: CDNStack
  meiliTask: MeiliTaskStack
  ecr: ServerECRStack

  iam: ServerIamStack
}

export interface SynthServerServiceStackProps extends AppInfraProps {
  networkStack: SynthNetworkStackOutput
  authStack: SynthAuthStackOutput
  databaseStack: SynthDatabaseStackOutput
  clusterStack: SynthClusterStackOutput
  cdnStack: SynthCDNStackOutput
  meiliStack: SynthMeiliStackOutput
}

export interface SynthServerStackOutput {
  ecr: ServerECRStack
  iam: ServerIamStack
  task: ServerTaskStack
  service: ServerLoadBalancerStack
}