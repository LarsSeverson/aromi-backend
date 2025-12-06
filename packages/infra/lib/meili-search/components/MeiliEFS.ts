import { FileSystem, PerformanceMode, ThroughputMode, LifecyclePolicy, type AccessPoint } from 'aws-cdk-lib/aws-efs'
import { SecurityGroup, Port, Peer } from 'aws-cdk-lib/aws-ec2'
import { RemovalPolicy } from 'aws-cdk-lib'
import { MeiliConfig } from './MeiliConfig.js'
import type { MeiliEFSComponentProps } from '../types.js'

export class MeiliEFSComponent {
  readonly securityGroupId: string
  readonly securityGroup: SecurityGroup

  readonly efsId: string
  readonly efs: FileSystem

  readonly accessPointId: string
  readonly accessPoint: AccessPoint

  constructor (props: MeiliEFSComponentProps) {
    const { stack, network } = props
    const { vpc } = network

    this.securityGroupId = `${MeiliConfig.prefix}-efs-sg`
    this.securityGroup = new SecurityGroup(stack, this.securityGroupId, { vpc })

    this.efsId = `${MeiliConfig.prefix}-efs`
    this.efs = new FileSystem(stack, this.efsId, {
      vpc,
      securityGroup: this.securityGroup,
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

    this.securityGroup.addIngressRule(
      Peer.ipv4(vpc.vpcCidrBlock),
      Port.tcp(2049)
    )
  }
}
