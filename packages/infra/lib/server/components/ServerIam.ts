import { PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam'
import type { ServerIamComponentProps } from '../types.js'
import { ServerConfig } from './ServerConfig.js'

export class ServerIamComponent {
  readonly roleId: string
  readonly role: Role

  constructor (props: ServerIamComponentProps) {
    const { stack, auth, storage } = props

    this.roleId = `${stack.prefix}-server-role`
    this.role = new Role(stack, this.roleId, {
      roleName: this.roleId,
      assumedBy: new ServicePrincipal(ServerConfig.IAM_CONFIG.principleService)
    })

    this.role.addToPolicy(
      new PolicyStatement({
        actions: ServerConfig.IAM_CONFIG.authActions,
        resources: [auth.userPool.userPoolArn]
      })
    )

    this.role.addToPolicy(
      new PolicyStatement({
        actions: ServerConfig.IAM_CONFIG.storageActions,
        resources: [`${storage.bucket.bucketArn}/*`]
      })
    )
  }
}