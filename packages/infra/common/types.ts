import type { Construct } from 'constructs'
import type { BaseStack } from './BaseStack.js'
import type { StackProps } from 'aws-cdk-lib'
import type { EnvConfig } from '../config/types.js'

export enum EnvMode {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production'
}

export interface BaseStackProps extends StackProps {
  scope: Construct
  stackName: string
  config: EnvConfig
}

export interface ScopedStackProps extends Omit<BaseStackProps, 'stackName'> {
  config: EnvConfig
}

export interface BaseConstructProps {
  scope: BaseStack
  config: EnvConfig
}

export interface BaseComponentProps {
  stack: BaseStack
}