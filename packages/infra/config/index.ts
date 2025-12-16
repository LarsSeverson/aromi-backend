import { EnvMode } from '../common/types.js'
import { devConfig } from './dev.js'

export const loadConfig = (env: EnvMode) => {
  if (env === EnvMode.PRODUCTION) return devConfig // todo: replace with prodConfig when ready
  return devConfig
}