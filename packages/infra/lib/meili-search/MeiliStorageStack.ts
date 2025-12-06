import { type AccessPoint, FileSystem, LifecyclePolicy, PerformanceMode, ThroughputMode } from 'aws-cdk-lib/aws-efs'
import { InfraStack } from '../InfraStack.js'
import type { MeiliStorageStackProps } from './types.js'
import { SecurityGroup } from 'aws-cdk-lib/aws-ec2'
import { RemovalPolicy } from 'aws-cdk-lib'

export class MeiliStorageStack extends InfraStack {
  static readonly PERFORMANCE_MODE = PerformanceMode.GENERAL_PURPOSE
  static readonly THROUGHPUT_MODE = ThroughputMode.BURSTING
  static readonly LIFECYCLE_POLICY = LifecyclePolicy.AFTER_14_DAYS
  static readonly REMOVAL_POLICY = RemovalPolicy.RETAIN

  static readonly AP_PATH = '/data'
  static readonly AP_UID = '1000'
  static readonly AP_GID = '1000'
  static readonly AP_PERMISSIONS = '755'

  readonly fileSystemId: string
  readonly fileSystem: FileSystem

  readonly securityGroupId: string
  readonly securityGroup: SecurityGroup

  readonly accessPointId: string
  readonly accessPoint: AccessPoint

  constructor (props: MeiliStorageStackProps) {
    const { app, network } = props
    super({ app, stackName: 'meili-storage' })

    this.securityGroupId = `${this.prefix}-efs-sg`
    this.securityGroup = new SecurityGroup(this, this.securityGroupId, {
      vpc: network.vpc
    })

    this.fileSystemId = `${this.prefix}-efs`
    this.fileSystem = new FileSystem(this, this.fileSystemId, {
      vpc: network.vpc,

      performanceMode: MeiliStorageStack.PERFORMANCE_MODE,
      throughputMode: MeiliStorageStack.THROUGHPUT_MODE,
      lifecyclePolicy: MeiliStorageStack.LIFECYCLE_POLICY,
      removalPolicy: MeiliStorageStack.REMOVAL_POLICY
    })

    this.accessPointId = `${this.prefix}-efs-ap`
    this.accessPoint = this.fileSystem.addAccessPoint(this.accessPointId, {
      path: MeiliStorageStack.AP_PATH,

      posixUser: {
        uid: MeiliStorageStack.AP_UID,
        gid: MeiliStorageStack.AP_GID
      },

      createAcl: {
        ownerUid: MeiliStorageStack.AP_UID,
        ownerGid: MeiliStorageStack.AP_GID,
        permissions: MeiliStorageStack.AP_PERMISSIONS
      }
    })
  }
}