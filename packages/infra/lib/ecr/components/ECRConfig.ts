import { ImageTagMutabilityExclusionFilter, TagMutability, TagStatus } from 'aws-cdk-lib/aws-ecr'
import { BaseConfig } from '../../BaseConfig.js'

export class ECRConfig extends BaseConfig {
  static readonly SERVER_ECR_CONFIG = {
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