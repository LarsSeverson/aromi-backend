import { Repository } from 'aws-cdk-lib/aws-ecr'
import { CfnOutput } from 'aws-cdk-lib'
import type { ServerECRComponentProps } from '../types.js'
import { ECRConfig } from './ECRConfig.js'

export class ServerECRComponent {
  readonly repositoryId: string
  readonly repository: Repository

  readonly outputRepositoryUriId: string
  readonly outputRepositoryUri: CfnOutput

  constructor (props: ServerECRComponentProps) {
    const { stack } = props

    this.repositoryId = `${ECRConfig.prefix}-server`
    this.repository = new Repository(stack, this.repositoryId, {
      repositoryName: this.repositoryId,

      imageScanOnPush: ECRConfig.SERVER_ECR_CONFIG.imageScanOnPush,
      imageTagMutability: ECRConfig.SERVER_ECR_CONFIG.imageTagMutability,
      imageTagMutabilityExclusionFilters: ECRConfig.SERVER_ECR_CONFIG.imageTagMutabilityExclusionFilters,
      lifecycleRules: ECRConfig.SERVER_ECR_CONFIG.lifeCycleRules
    })

    this.outputRepositoryUriId = `${this.repositoryId}-uri`
    this.outputRepositoryUri = new CfnOutput(stack, this.outputRepositoryUriId, {
      value: this.repository.repositoryUri,
      exportName: this.outputRepositoryUriId
    })
  }
}