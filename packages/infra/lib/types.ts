import type { Construct } from 'constructs'
import type { InfraStack } from './InfraStack.js'

export enum EnvName {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production'
}

export interface InfraStackProps {
  app: Construct
  stackName: string
}

export interface BaseInfraProps {
  app: Construct
}

export interface BaseComponentProps {
  stack: InfraStack
}