import { Stack } from 'aws-cdk-lib'
import type { BaseStackProps } from './types.js'
import type { EnvConfig } from '../config/types.js'

export abstract class BaseStack extends Stack {
  readonly config: EnvConfig

  constructor (props: BaseStackProps) {
    const {
      scope,
      stackName,
      config,

      env,
      ...rest
    } = props

    const id = `${config.appName}-${config.envMode}-${stackName}`

    const stackProps = {
      env: { ...config.aws, ...env },
      ...rest
    }

    super(scope, id, stackProps)

    this.config = config
  }

  get prefix (): string {
    return `${this.config.appName}-${this.config.envMode}`
  }
}