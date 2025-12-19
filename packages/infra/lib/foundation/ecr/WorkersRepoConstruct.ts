import { Construct } from 'constructs'
import { ImageTagMutabilityExclusionFilter, Repository, TagMutability, TagStatus } from 'aws-cdk-lib/aws-ecr'
import type { WorkersRepoConstructProps } from '../types.js'

export class WorkersRepoConstruct extends Construct {
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
      }]
    }
  }

  constructor (props: WorkersRepoConstructProps) {
    const { scope } = props
    super(scope, `${scope.prefix}-workers`)

    this.repositoryId = `${scope.prefix}-workers`
    this.repository = new Repository(this, this.repositoryId, {
      repositoryName: this.repositoryId,

      imageScanOnPush: this.internalConfig.server.imageScanOnPush,
      imageTagMutability: this.internalConfig.server.imageTagMutability,
      imageTagMutabilityExclusionFilters: this.internalConfig.server.imageTagMutabilityExclusionFilters,
      lifecycleRules: this.internalConfig.server.lifeCycleRules
    })
  }
}