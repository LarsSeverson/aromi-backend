import { EnvMode } from '../common/types.js'
import { devConfig } from './dev.js'
import { prodConfig } from './prod.js'
import type { Construct } from 'constructs'

export const loadConfig = (scope: Construct) => {
  const env = scope.node.tryGetContext('env') as EnvMode ?? EnvMode.DEVELOPMENT

  const config = env === EnvMode.PRODUCTION ? prodConfig : devConfig

  return config
}