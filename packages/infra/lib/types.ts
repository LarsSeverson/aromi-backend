import type { UserPool } from 'aws-cdk-lib/aws-cognito'
import type { Vpc } from 'aws-cdk-lib/aws-ec2'
import type { Bucket } from 'aws-cdk-lib/aws-s3'
import type { Construct } from 'constructs'

export enum EnvName {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production'
}

export interface InfraStackProps {
  app: Construct
  stackName: string
}

export interface AppInfraProps {
  app: Construct
}

export interface NetworkStackProps extends AppInfraProps {}

export interface DatabaseStackProps extends AppInfraProps {
  vpc: Vpc
}

export interface AuthStackProps extends AppInfraProps {}

export interface StorageStackProps extends AppInfraProps {}

export interface CDNStackProps extends AppInfraProps {
  bucket: Bucket
}

export interface ServerIamStackProps extends AppInfraProps {
  pool: UserPool
  bucket: Bucket
}

export interface MeiliStorageStackProps extends AppInfraProps {
  vpc: Vpc
}