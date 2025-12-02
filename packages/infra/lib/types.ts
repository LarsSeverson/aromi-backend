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
