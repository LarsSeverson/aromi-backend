import { PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam'
import { InfraStack } from '../InfraStack.js'
import type { ServerIamStackProps } from './types.js'

export class ServerIamStack extends InfraStack {
  readonly role: Role
  readonly roleName: string

  constructor (props: ServerIamStackProps) {
    const { app, auth, storage } = props
    super({ app, stackName: 'server-iam' })

    this.roleName = `${this.prefix}-server-role`

    this.role = new Role(this, this.roleName, {
      roleName: this.roleName,
      assumedBy: new ServicePrincipal('ec2.amazonaws.com')
    })

    this.role.addToPolicy(
      new PolicyStatement({
        actions: [
          'cognito-idp:AdminGetUser',
          'cognito-idp:AdminCreateUser',
          'cognito-idp:AdminDeleteUser',
          'cognito-idp:AdminUpdateUserAttributes',
          'cognito-idp:AdminSetUserPassword',
          'cognito-idp:ResendConfirmationCode',
          'cognito-idp:SignUp',
          'cognito-idp:ConfirmSignUp',
          'cognito-idp:InitiateAuth',
          'cognito-idp:RespondToAuthChallenge'
        ],
        resources: [auth.userPool.userPoolArn]
      })
    )

    this.role.addToPolicy(
      new PolicyStatement({
        actions: ['s3:GetObject', 's3:PutObject', 's3:DeleteObject'],
        resources: [`${storage.bucket.bucketArn}/*`]
      })
    )
  }
}