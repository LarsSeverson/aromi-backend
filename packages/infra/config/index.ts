import { EnvMode } from '../common/types.js'
import { devConfig } from './dev.js'
import { prodConfig } from './prod.js'
import type { Construct } from 'constructs'

export const loadConfig = (scope: Construct) => {
  const env = scope.node.tryGetContext('env') as EnvMode ?? EnvMode.DEVELOPMENT

  const config = env === EnvMode.PRODUCTION ? prodConfig : devConfig

  if (config.aws.account === undefined || config.aws.region === undefined) {
    throw new Error('AWS account and region must be defined in the environment variables.')
  }

  return config
}