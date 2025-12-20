import { CfnSecurityGroupIngress, Protocol } from 'aws-cdk-lib/aws-ec2'
import { BaseStack } from '../../common/BaseStack.js'
import { JumpBoxConstruct } from './jump-box/JumpBoxConstruct.js'
import type { ManagementStackProps } from './types.js'
import type { DataStack } from '../data/DataStack.js'

export class ManagementStack extends BaseStack {
  readonly jumpBox: JumpBoxConstruct

  constructor (props: ManagementStackProps) {
    const { scope, config, foundationStack, dataStack } = props

    super({
      scope,
      stackName: 'management',
      config
    })

    this.jumpBox = new JumpBoxConstruct({
      scope: this,
      config,
      vpc: foundationStack.network.vpc
    })

    this.allowJumpBoxToDatabase(dataStack)
  }

  private allowJumpBoxToDatabase (dataStack: DataStack) {
    new CfnSecurityGroupIngress(this, 'AllowJumpBoxToDatabase', {
      groupId: dataStack.database.securityGroup.securityGroupId,
      sourceSecurityGroupId: this.jumpBox.securityGroup.securityGroupId,

      ipProtocol: Protocol.TCP,
      fromPort: dataStack.database.databasePort,
      toPort: dataStack.database.databasePort
    })
  }
}