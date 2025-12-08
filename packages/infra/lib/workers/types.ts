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
import type { BaseStackProps } from '../types.js'
import type { WorkersECRStack } from './WorkersECRStack.js'
import type { WorkersServiceStack } from './WorkersServiceStack.js'
import type { WorkersTaskStack } from './WorkersTaskStack.js'

export interface WorkersECRStackProps extends BaseStackProps {}

export interface WorkersServiceStackProps extends BaseStackProps {
  network: NetworkStack
  cluster: ClusterStack
  task: WorkersTaskStack
}

export interface WorkersTaskStackProps extends BaseStackProps {
  auth: AuthStack
  database: DatabaseStack
  cdn: CDNStack
  meiliTask: MeiliTaskStack
  ecr: WorkersECRStack
}

export interface SynthWorkersServiceStackProps extends BaseStackProps {
  networkStack: SynthNetworkStackOutput
  authStack: SynthAuthStackOutput
  databaseStack: SynthDatabaseStackOutput
  clusterStack: SynthClusterStackOutput
  cdnStack: SynthCDNStackOutput
  meiliStack: SynthMeiliStackOutput
}

export interface SynthWorkersStackOutput {
  ecr: WorkersECRStack
  task: WorkersTaskStack
  service: WorkersServiceStack
}