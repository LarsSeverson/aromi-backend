import { Stack } from 'aws-cdk-lib'
import type { GlobalStackProps } from './types.js'
import { StringParameter } from 'aws-cdk-lib/aws-ssm'
import { EnvMode } from '../../common/types.js'

export class GlobalStack extends Stack {
  public readonly serverTagParam: StringParameter
  public readonly workersTagParam: StringParameter

  constructor (props: GlobalStackProps) {
    const { scope } = props

    const envName = scope.node.tryGetContext('env') as EnvMode ?? EnvMode.DEVELOPMENT
    const env = { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION }

    super(scope, `aromi-${envName}-global`, { ...props, env })

    this.serverTagParam = new StringParameter(this, 'ServerTagParam', {
      parameterName: `/aromi/${envName}/server/tag`,
      stringValue: 'latest',
      description: 'Docker tag for the server image'
    })

    this.workersTagParam = new StringParameter(this, 'WorkersTagParam', {
      parameterName: `/aromi/${envName}/workers/tag`,
      stringValue: 'latest',
      description: 'Docker tag for the workers image'
    })
  }
}