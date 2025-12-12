import { FileSystem, PerformanceMode, ThroughputMode, LifecyclePolicy, type AccessPoint } from 'aws-cdk-lib/aws-efs'
import { RemovalPolicy } from 'aws-cdk-lib'
import { MeiliConfig } from './MeiliConfig.js'
import type { MeiliEFSComponentProps } from '../types.js'

export class MeiliEFSComponent {
  readonly efsId: string
  readonly efs: FileSystem

  readonly accessPointId: string
  readonly accessPoint: AccessPoint

  constructor (props: MeiliEFSComponentProps) {
    const { stack, network } = props
    const { vpc } = network

    this.efsId = `${MeiliConfig.prefix}-efs`
    this.efs = new FileSystem(stack, this.efsId, {
      vpc,
      securityGroup: network.meiliSecurityGroup.efsSecurityGroup,
      performanceMode: PerformanceMode.GENERAL_PURPOSE,
      throughputMode: ThroughputMode.BURSTING,
      lifecyclePolicy: LifecyclePolicy.AFTER_14_DAYS,
      removalPolicy: RemovalPolicy.RETAIN
    })

    this.accessPointId = `${MeiliConfig.prefix}-efs-ap`
    this.accessPoint = this.efs.addAccessPoint(this.accessPointId, {
      path: MeiliConfig.EFS_CONFIG.efsPath,

      posixUser: {
        uid: MeiliConfig.EFS_CONFIG.posixUid,
        gid: MeiliConfig.EFS_CONFIG.posixGid
      },

      createAcl: {
        ownerUid: MeiliConfig.EFS_CONFIG.posixUid,
        ownerGid: MeiliConfig.EFS_CONFIG.posixGid,
        permissions: MeiliConfig.EFS_CONFIG.posixPerms
      }
    })
  }
}
