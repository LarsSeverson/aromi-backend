import { Repository, TagMutability } from 'aws-cdk-lib/aws-ecr'
import { InfraStack } from '../InfraStack.js'
import type { MeiliECRStackProps } from './types.js'
import { RemovalPolicy } from 'aws-cdk-lib'

export class MeiliECRStack extends InfraStack {
  static readonly TAG_MUTABILITY = TagMutability.IMMUTABLE
  static readonly REMOVAL_POLICY = RemovalPolicy.RETAIN
  static readonly SCAN_ON_PUSH = true

  readonly repositoryId: string
  readonly repository: Repository

  constructor (props: MeiliECRStackProps) {
    const { app } = props
    super({ app, stackName: 'meili-ecr' })

    this.repositoryId = `${this.prefix}-meili-repository`
    this.repository = new Repository(this, this.repositoryId, {
      repositoryName: this.repositoryId,

      imageTagMutability: MeiliECRStack.TAG_MUTABILITY,
      imageScanOnPush: MeiliECRStack.SCAN_ON_PUSH,
      removalPolicy: MeiliECRStack.REMOVAL_POLICY
    })
  }
}