import { EnvMode } from './types.js'

export class BaseConfig {
  static readonly DOMAIN_NAMES = {
    ORIGIN: 'origin.aromi.net',
    APP: 'www.aromi.net'
  }

  static readonly appName = 'aromi'
  static readonly envMode = EnvMode.DEVELOPMENT
  static readonly prefix = `${BaseConfig.appName}-${BaseConfig.envMode}`

  static readonly env = {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  }
}