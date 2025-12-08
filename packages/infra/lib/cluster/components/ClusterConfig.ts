import { BaseConfig } from '../../BaseConfig.js'

export class ClusterConfig extends BaseConfig {
  static readonly enableFargateCapacityProviders = true

  static readonly defaultCloudMapNamespace = {
    name: 'internal'
  }
}