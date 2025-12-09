import { Repository } from 'aws-cdk-lib/aws-ecr'
import type { ServerECRComponentProps } from '../types.js'
import { ServerConfig } from './ServerConfig.js'
import { CfnOutput } from 'aws-cdk-lib'

export class ServerECRComponent {
  readonly repositoryId: string
  readonly repository: Repository

  readonly outputRepositoryUriId: string
  readonly outputRepositoryUri: CfnOutput

  constructor (props: ServerECRComponentProps) {
    const { stack } = props

    this.repositoryId = `${ServerConfig.prefix}-server`
    this.repository = new Repository(stack, this.repositoryId, {
      repositoryName: this.repositoryId,

      imageScanOnPush: ServerConfig.ECR_CONFIG.imageScanOnPush,
      imageTagMutability: ServerConfig.ECR_CONFIG.imageTagMutability,
      lifecycleRules: ServerConfig.ECR_CONFIG.liceCycleRules
    })

    this.outputRepositoryUriId = `${this.repositoryId}-uri`
    this.outputRepositoryUri = new CfnOutput(stack, this.outputRepositoryUriId, {
      value: this.repository.repositoryUri,
      exportName: this.outputRepositoryUriId
    })
  }
}