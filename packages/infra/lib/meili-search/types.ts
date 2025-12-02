import type { ClusterStack } from '../cluster/ClusterStack.js'
import type { NetworkStack } from '../network/NetworkStack.js'
import type { AppInfraProps } from '../types.js'
import type { MeiliECRStack } from './MeiliECRStack.js'
import type { MeiliStorageStack } from './MeiliStorageStack.js'
import type { MeiliTaskStack } from './MeiliTaskStack.js'

export interface MeiliStorageStackProps extends AppInfraProps {
  network: NetworkStack
}

export interface MeiliECRStackProps extends AppInfraProps { }

export interface MeiliTaskStackProps extends AppInfraProps {
  ecr: MeiliECRStack
  storage: MeiliStorageStack
}

export interface MeiliServiceStackProps extends AppInfraProps {
  network: NetworkStack

  cluster: ClusterStack
  task: MeiliTaskStack
  storage: MeiliStorageStack
}
