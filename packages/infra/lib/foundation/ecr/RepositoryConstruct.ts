import { Construct } from 'constructs'
import type { RepositoryConstructProps } from '../types.js'
import { ImageTagMutabilityExclusionFilter, Repository, TagMutability, TagStatus } from 'aws-cdk-lib/aws-ecr'

export class RepositoryConstruct extends Construct {
  readonly serverRepository: Repository
  readonly serverRepositoryId: string

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

  constructor (props: RepositoryConstructProps) {
    const { scope } = props
    super(scope, `${scope.prefix}-ecr-repository`)

    this.serverRepositoryId = `${scope.prefix}-server`
    this.serverRepository = new Repository(this, this.serverRepositoryId, {
      repositoryName: this.serverRepositoryId,

      imageScanOnPush: this.internalConfig.server.imageScanOnPush,
      imageTagMutability: this.internalConfig.server.imageTagMutability,
      imageTagMutabilityExclusionFilters: this.internalConfig.server.imageTagMutabilityExclusionFilters,
      lifecycleRules: this.internalConfig.server.lifeCycleRules
    })
  }
}