import { Construct } from 'constructs'
import type { ServerRepoConstructProps } from '../types.js'
import { ImageTagMutabilityExclusionFilter, Repository, TagMutability, TagStatus } from 'aws-cdk-lib/aws-ecr'
import { RemovalPolicy } from 'aws-cdk-lib'

export class ServerRepoConstruct extends Construct {
  readonly repository: Repository
  readonly repositoryId: string

  private readonly internalConfig = {
    server: {
      imageScanOnPush: true,
      imageTagMutability: TagMutability.IMMUTABLE_WITH_EXCLUSION,
      imageTagMutabilityExclusionFilters: [
        ImageTagMutabilityExclusionFilter.wildcard('latest')
      ],

      lifeCycleRules: [{
        tagStatus: TagStatus.UNTAGGED,
        maxImageCount: 10
      }],

      removalPolicy: RemovalPolicy.RETAIN
    }
  }

  constructor (props: ServerRepoConstructProps) {
    const { scope } = props
    super(scope, `${scope.prefix}-server`)

    this.repositoryId = `${scope.prefix}-server`
    this.repository = new Repository(this, this.repositoryId, {
      repositoryName: this.repositoryId,

      imageScanOnPush: this.internalConfig.server.imageScanOnPush,
      imageTagMutability: this.internalConfig.server.imageTagMutability,
      imageTagMutabilityExclusionFilters: this.internalConfig.server.imageTagMutabilityExclusionFilters,
      lifecycleRules: this.internalConfig.server.lifeCycleRules,

      removalPolicy: this.internalConfig.server.removalPolicy
    })
  }
}