import { Stack } from 'aws-cdk-lib'
import type { InfraStackProps } from './types.js'

export abstract class InfraStack extends Stack {
  static readonly appName = 'aromi'
  static readonly envName = 'development'

  constructor (props: InfraStackProps) {
    const { app, stackName } = props

    const id = `${InfraStack.appName}-${InfraStack.envName}-${stackName}`
    super(app, id)
  }

  get appName (): string {
    return InfraStack.appName
  }

  get envName (): string {
    return InfraStack.envName
  }

  get prefix (): string {
    return `${this.appName}-${this.envName}`
  }
}