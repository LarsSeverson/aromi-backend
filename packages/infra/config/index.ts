import { StringParameter } from 'aws-cdk-lib/aws-ssm'
import type { Construct } from 'constructs'
import { EnvMode } from '../common/types.js'
import { devConfig } from './dev.js'

export const loadConfig = (scope: Construct) => {
  const env = scope.node.tryGetContext('env') as EnvMode ?? EnvMode.DEVELOPMENT
  const serverTagFromContext = scope.node.tryGetContext('serverTag') as string
  const workersTagFromContext = scope.node.tryGetContext('workersTag') as string

  const serverTag = serverTagFromContext ?? StringParameter.valueForStringParameter(
    scope,
    `/aromi/${env}/server/tag`
  )

  const workersTag = workersTagFromContext ?? StringParameter.valueForStringParameter(
    scope,
    `/aromi/${env}/workers/tag`
  )

  const baseConfig = env === EnvMode.PRODUCTION ? devConfig : devConfig

  return {
    ...baseConfig,
    ecr: { serverTag, workersTag }
  }
}