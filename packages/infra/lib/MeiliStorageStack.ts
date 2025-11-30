import { type AccessPoint, FileSystem, LifecyclePolicy, PerformanceMode, ThroughputMode } from 'aws-cdk-lib/aws-efs'
import { InfraStack } from './InfraStack.js'
import type { MeiliStorageStackProps } from './types.js'
import { SecurityGroup } from 'aws-cdk-lib/aws-ec2'
import { RemovalPolicy } from 'aws-cdk-lib'

export class MeiliStorageStack extends InfraStack {
  static readonly PERFORMANCE_MODE = PerformanceMode.GENERAL_PURPOSE
  static readonly THROUGHPUT_MODE = ThroughputMode.BURSTING

  static readonly LIFECYCLE_POLICY = LifecyclePolicy.AFTER_14_DAYS
  static readonly REMOVAL_POLICY = RemovalPolicy.RETAIN

  readonly fileSystemId: string
  readonly fileSystem: FileSystem

  readonly securityGroupId: string
  readonly securityGroup: SecurityGroup

  readonly accessPointId: string
  readonly accessPoint: AccessPoint

  constructor (props: MeiliStorageStackProps) {
    const { app, vpc } = props
    super({ app, stackName: 'meili-storage' })

    this.securityGroupId = `${this.prefix}-efs-sg`
    this.securityGroup = new SecurityGroup(this, this.securityGroupId, {
      vpc
    })

    this.fileSystemId = `${this.prefix}-efs`
    this.fileSystem = new FileSystem(this, this.fileSystemId, {
      vpc,

      performanceMode: MeiliStorageStack.PERFORMANCE_MODE,
      throughputMode: MeiliStorageStack.THROUGHPUT_MODE,

      lifecyclePolicy: MeiliStorageStack.LIFECYCLE_POLICY,
      removalPolicy: MeiliStorageStack.REMOVAL_POLICY
    })

    this.accessPointId = `${this.prefix}-efs-ap`
  }
}