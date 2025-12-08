import { Repository } from 'aws-cdk-lib/aws-ecr'
import type { ServerECRComponentProps } from '../types.js'
import { ServerConfig } from './ServerConfig.js'

export class ServerECRComponent {
  readonly repositoryId: string
  readonly repository: Repository

  constructor (props: ServerECRComponentProps) {
    const { stack } = props

    this.repositoryId = `${ServerConfig.prefix}-server`
    this.repository = new Repository(stack, this.repositoryId, {
      repositoryName: this.repositoryId,

      imageScanOnPush: ServerConfig.ECR_CONFIG.imageScanOnPush,
      imageTagMutability: ServerConfig.ECR_CONFIG.imageTagMutability,
      lifecycleRules: ServerConfig.ECR_CONFIG.liceCycleRules
    })
  }
}