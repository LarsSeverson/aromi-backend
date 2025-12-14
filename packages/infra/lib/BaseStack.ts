import { Stack } from 'aws-cdk-lib'
import type { InfraStackProps } from './types.js'
import { BaseConfig } from './BaseConfig.js'

export abstract class BaseStack extends Stack {
  constructor (props: InfraStackProps) {
    const { app, stackName } = props

    const id = `${BaseConfig.prefix}-${stackName}`
    super(app, id, { env: BaseConfig.env })
  }

  get appName (): string {
    return BaseConfig.appName
  }

  get envName (): string {
    return BaseConfig.envMode
  }

  get prefix (): string {
    return `${this.appName}-${this.envName}`
  }
}