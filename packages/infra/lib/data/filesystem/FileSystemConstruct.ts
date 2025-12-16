import { type AccessPoint, FileSystem } from 'aws-cdk-lib/aws-efs'
import { Construct } from 'constructs'
import type { FileSystemConstructProps } from '../types.js'
import { SecurityGroup } from 'aws-cdk-lib/aws-ec2'

export class FileSystemConstruct extends Construct {
  readonly securityGroup: SecurityGroup
  readonly securityGroupId: string

  readonly fileSystem: FileSystem
  readonly fileSystemId: string

  readonly accessPoint: AccessPoint
  readonly accessPointId: string

  readonly internalConfig = {
    allowAllOutbound: true
  }

  constructor (props: FileSystemConstructProps) {
    const { scope, vpc, config } = props
    super(scope, `${scope.prefix}-filesystem`)

    this.securityGroupId = `${scope.prefix}-efs-sg`
    this.securityGroup = new SecurityGroup(this, this.securityGroupId, {
      vpc,
      allowAllOutbound: this.internalConfig.allowAllOutbound
    })

    this.fileSystemId = `${scope.prefix}-efs`
    this.fileSystem = new FileSystem(this, this.fileSystemId, {
      vpc,
      removalPolicy: config.fileSystem.removalPolicy,
      lifecyclePolicy: config.fileSystem.lifecyclePolicy,
      performanceMode: config.fileSystem.performanceMode,
      throughputMode: config.fileSystem.throughputMode
    })

    this.accessPointId = `${scope.prefix}-efs-ap`
    this.accessPoint = this.fileSystem.addAccessPoint(this.accessPointId, {
      path: config.fileSystem.efsPath,

      posixUser: {
        uid: config.fileSystem.posixUid,
        gid: config.fileSystem.posixGid
      },

      createAcl: {
        ownerUid: config.fileSystem.posixUid,
        ownerGid: config.fileSystem.posixGid,
        permissions: config.fileSystem.posixPerms
      }
    })
  }
}