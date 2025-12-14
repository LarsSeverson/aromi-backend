import type { Construct } from 'constructs'
import type { BaseStack } from './BaseStack.js'
import type { StackProps } from 'aws-cdk-lib'

export enum EnvMode {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production'
}

export interface InfraStackProps extends StackProps {
  app: Construct
  stackName: string
}

export interface BaseStackProps {
  app: Construct
}

export interface BaseComponentProps {
  stack: BaseStack
}