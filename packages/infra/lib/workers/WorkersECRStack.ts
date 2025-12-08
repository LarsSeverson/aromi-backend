import { Repository, TagMutability, TagStatus } from 'aws-cdk-lib/aws-ecr'
import { BaseStack } from '../BaseStack.js'
import type { WorkersECRStackProps } from './types.js'
import { RemovalPolicy } from 'aws-cdk-lib'

export class WorkersECRStack extends BaseStack {
  static readonly TAG_MUTABILITY = TagMutability.IMMUTABLE
  static readonly REMOVAL_POLICY = RemovalPolicy.RETAIN
  static readonly SCAN_ON_PUSH = true

  static readonly LIFECYCLE_POLICY = {
    tagStatus: TagStatus.UNTAGGED,
    maxImageCount: 10
  }

  readonly respositoryId: string
  readonly repository: Repository

  constructor (props: WorkersECRStackProps) {
    const { app } = props
    super({ app, stackName: 'worker-ecr' })

    this.respositoryId = `${this.prefix}-workers`
    this.repository = new Repository(this, this.respositoryId, {
      repositoryName: this.respositoryId,

      removalPolicy: WorkersECRStack.REMOVAL_POLICY,
      imageScanOnPush: WorkersECRStack.SCAN_ON_PUSH,
      imageTagMutability: WorkersECRStack.TAG_MUTABILITY,

      lifecycleRules: [WorkersECRStack.LIFECYCLE_POLICY]
    })
  }
}