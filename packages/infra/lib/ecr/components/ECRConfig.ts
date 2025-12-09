import { TagMutability, TagStatus } from 'aws-cdk-lib/aws-ecr'
import { BaseConfig } from '../../BaseConfig.js'

export class ECRConfig extends BaseConfig {
  static readonly SERVER_ECR_CONFIG = {
    imageScanOnPush: true,
    imageTagMutability: TagMutability.IMMUTABLE,
    liceCycleRules: [{
      tagStatus: TagStatus.UNTAGGED,
      maxImageCount: 10
    }]
  }
}