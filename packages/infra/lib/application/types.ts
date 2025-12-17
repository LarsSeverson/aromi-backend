import type { Vpc } from 'aws-cdk-lib/aws-ec2'
import type { BaseConstructProps, ScopedStackProps } from '../../common/types.js'
import type { Cluster } from 'aws-cdk-lib/aws-ecs'
import type { RedisServiceConstruct } from './services/RedisServiceConstruct.js'
import type { MeiliServiceConstruct } from './services/MeiliServiceConstruct.js'
import type { FileSystemConstruct } from '../data/filesystem/FileSystemConstruct.js'
import type { AlbConstruct } from './alb/AlbConstruct.js'
import type { DataStack } from '../data/DataStack.js'
import type { IdentityStack } from '../identity/IdentityStack.js'
import type { FoundationStack } from '../foundation/FoundationStack.js'

export interface AlbConstructProps extends BaseConstructProps {
  vpc: Vpc
}

export interface ClusterConstructProps extends BaseConstructProps {
  vpc: Vpc
}

export interface RedisServiceConstructProps extends BaseConstructProps {
  vpc: Vpc
  cluster: Cluster
}

export interface MeiliServiceConstructProps extends BaseConstructProps {
  vpc: Vpc
  fileSystem: FileSystemConstruct

  cluster: Cluster
}

export interface ServerServiceConstructProps extends BaseConstructProps {
  foundationStack: FoundationStack
  identityStack: IdentityStack
  dataStack: DataStack

  alb: AlbConstruct
  cluster: Cluster
  redis: RedisServiceConstruct
  meili: MeiliServiceConstruct
}

export interface ApplicationStackProps extends ScopedStackProps {
  foundationStack: FoundationStack
  identityStack: IdentityStack
  dataStack: DataStack
}