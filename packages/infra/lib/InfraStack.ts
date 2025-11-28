import { Stack } from 'aws-cdk-lib'
import type { InfraStackProps } from './types.js'
import { requiredEnv, unwrapOrThrowSync } from '@aromi/shared'

export abstract class InfraStack extends Stack {
  readonly appName: string
  readonly envName: string

  constructor (props: InfraStackProps) {
    const { app, stackName } = props

    const appName = unwrapOrThrowSync(requiredEnv('APP_NAME'))
    const envName = unwrapOrThrowSync(requiredEnv('NODE_ENV'))

    const id = `${appName}-${envName}-${stackName}`
    super(app, id)

    this.appName = appName
    this.envName = envName
  }

  get prefix (): string {
    return `${this.appName}-${this.envName}`
  }
}