import { EnvMode } from '../common/types.js'
import { baseConfig } from './base.js'
import type { EnvConfig } from './types.js'

export const devConfig: EnvConfig = {
  ...baseConfig,

  envMode: EnvMode.DEVELOPMENT,

  aws: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  }
}