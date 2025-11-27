import { Stack } from 'aws-cdk-lib'
import type { InfraStackProps } from './types.js'

export abstract class InfraStack extends Stack {
  protected readonly appName = 'aromi'
  protected readonly envName: string

  constructor (props: InfraStackProps) {
    const { scope, id, envName } = props

    super(scope, id)

    this.envName = envName
  }

  protected get prefix () {
    return `${this.appName}-${this.envName}`
  }
}