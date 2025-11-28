import type { Vpc } from 'aws-cdk-lib/aws-ec2'
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