import { Stack } from 'aws-cdk-lib'
import type { InfraStackProps } from './types.js'
import { InfraConfig } from './InfraConfig.js'

export abstract class InfraStack extends Stack {
  constructor (props: InfraStackProps) {
    const { app, stackName } = props

    const id = `${InfraConfig.prefix}-${stackName}`
    super(app, id)
  }

  get appName (): string {
    return InfraConfig.appName
  }

  get envName (): string {
    return InfraConfig.envName
  }

  get prefix (): string {
    return `${this.appName}-${this.envName}`
  }
}