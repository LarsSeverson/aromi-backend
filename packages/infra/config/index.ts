import { EnvMode } from '../common/types.js'
import { devConfig } from './dev.js'
import { prodConfig } from './prod.js'
import type { GlobalStack } from '../lib/global/GlobalStack.js'

export const loadConfig = (scope: GlobalStack) => {
  const env = scope.node.tryGetContext('env') as EnvMode ?? EnvMode.DEVELOPMENT

  const serverTagFromContext = scope.node.tryGetContext('serverTag') as string
  const workersTagFromContext = scope.node.tryGetContext('workersTag') as string

  const serverTag = serverTagFromContext ?? scope.serverTagParam.stringValue
  const workersTag = workersTagFromContext ?? scope.workersTagParam.stringValue

  const baseConfig = env === EnvMode.PRODUCTION ? prodConfig : devConfig

  return {
    ...baseConfig,
    ecr: { serverTag, workersTag }
  }
}