import type { Vpc } from 'aws-cdk-lib/aws-ec2'
import type { BaseConstructProps, BaseStackProps } from '../../common/types.js'
import type { Cluster } from 'aws-cdk-lib/aws-ecs'
import type { CognitoConstruct } from './cognito/CognitoConstruct.js'
import type { DatabaseConstruct } from '../data/database/DatabaseConstruct.js'
import type { AssetsBucketConstruct } from '../edge/s3/AssetsBucketConstruct.js'
import type { RedisServiceConstruct } from './services/RedisServiceConstruct.js'
import type { MeiliServiceConstruct } from './services/MeiliServiceConstruct.js'
import type { RepositoryConstruct } from './ecr/RepositoryConstruct.js'
import type { FileSystemConstruct } from '../data/filesystem/FileSystemConstruct.js'
import type { AlbConstruct } from './alb/AlbConstruct.js'

export interface AlbConstructProps extends BaseConstructProps {
  vpc: Vpc
}

export interface CognitoConstructProps extends BaseConstructProps {}

export interface RepositoryConstructProps extends BaseConstructProps {}

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
  vpc: Vpc

  database: DatabaseConstruct

  assets: AssetsBucketConstruct

  cognito: CognitoConstruct
  repository: RepositoryConstruct
  alb: AlbConstruct
  cluster: Cluster
  redis: RedisServiceConstruct
  meili: MeiliServiceConstruct
}

export interface ApplicationStackProps extends BaseStackProps {
  vpc: Vpc

  fileSystem: FileSystemConstruct
  database: DatabaseConstruct

  assets: AssetsBucketConstruct
}