import type { Construct } from 'constructs'
import type { BaseStack } from './BaseStack.js'

export enum EnvMode {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production'
}

export interface InfraStackProps {
  app: Construct
  stackName: string
}

export interface BaseStackProps {
  app: Construct
}

export interface BaseComponentProps {
  stack: BaseStack
}