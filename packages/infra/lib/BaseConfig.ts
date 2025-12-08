import { EnvMode } from './types.js'

export class BaseConfig {
  static readonly appName = 'aromi'
  static readonly envMode = EnvMode.DEVELOPMENT
  static readonly prefix = `${BaseConfig.appName}-${BaseConfig.envMode}`
}