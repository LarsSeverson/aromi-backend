import type { Vpc } from 'aws-cdk-lib/aws-ec2'
import type { Construct } from 'constructs'

export enum EnvName {
  DEV = 'dev',
  PROD = 'prod'
}

export interface InfraStackProps {
  scope: Construct
  id: string
  envName: EnvName
}

export interface NetworkStackProps extends InfraStackProps {}

export interface DatabaseStackProps extends InfraStackProps {
  vpc: Vpc
}