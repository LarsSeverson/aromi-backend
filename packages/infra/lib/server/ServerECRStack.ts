import { Repository, TagMutability, TagStatus } from 'aws-cdk-lib/aws-ecr'
import { InfraStack } from '../InfraStack.js'
import type { ServerECRStackProps } from './types.js'
import { RemovalPolicy } from 'aws-cdk-lib'

export class ServerECRStack extends InfraStack {
  static readonly TAG_MUTABILITY = TagMutability.IMMUTABLE
  static readonly REMOVAL_POLICY = RemovalPolicy.RETAIN
  static readonly SCAN_ON_PUSH = true

  static readonly LIFECYCLE_POLICY = {
    tagStatus: TagStatus.UNTAGGED,
    maxImageCount: 10
  }

  readonly repositoryId: string
  readonly repository: Repository

  constructor (props: ServerECRStackProps) {
    const { app } = props
    super({ app, stackName: 'server-ecr' })

    this.repositoryId = `${this.prefix}-server`
    this.repository = new Repository(this, this.repositoryId, {
      repositoryName: this.repositoryId,

      removalPolicy: ServerECRStack.REMOVAL_POLICY,
      imageScanOnPush: ServerECRStack.SCAN_ON_PUSH,
      imageTagMutability: ServerECRStack.TAG_MUTABILITY,

      lifecycleRules: [ServerECRStack.LIFECYCLE_POLICY]
    })
  }
}