import { UserPool, UserPoolClient } from 'aws-cdk-lib/aws-cognito'
import { BaseStack } from '../BaseStack.js'
import type { AuthStackProps } from './types.js'
import { AuthConfig } from './components/AuthConfig.js'

export class AuthStack extends BaseStack {
  readonly userPoolId: string
  readonly userPool: UserPool

  readonly userPoolClientId: string
  readonly userPoolClient: UserPoolClient

  readonly jwksUri: string

  constructor (props: AuthStackProps) {
    const { app } = props
    super({ app, stackName: 'auth' })

    this.userPoolId = `${this.prefix}-user-pool`
    this.userPool = new UserPool(this, this.userPoolId, {
      userPoolName: this.userPoolId,

      signInAliases: AuthConfig.SIGN_IN_ALIASES,

      mfa: AuthConfig.MFA,
      mfaSecondFactor: AuthConfig.MFA_SECOND_FACTOR,

      selfSignUpEnabled: AuthConfig.SELF_SIGN_UP,

      autoVerify: AuthConfig.AUTO_VERIFY,
      standardAttributes: AuthConfig.STANDARD_ATTRIBUTES,
      keepOriginal: AuthConfig.KEEP_ORIGINAL,

      passwordPolicy: AuthConfig.PASSWORD_POLICY,

      removalPolicy: AuthConfig.REMOVAL_POLICY,

      accountRecovery: AuthConfig.ACCOUNT_RECOVERY
    })

    this.userPoolClientId = `${this.prefix}-client`
    this.userPoolClient = new UserPoolClient(this, this.userPoolClientId, {
      userPool: this.userPool,
      userPoolClientName: this.userPoolClientId,

      generateSecret: AuthConfig.GENERATE_SECRET,

      authFlows: AuthConfig.CLIENT_AUTH_FLOWS,

      enableTokenRevocation: AuthConfig.ENABLE_TOKEN_REVOCATION,
      preventUserExistenceErrors: AuthConfig.PREVENT_USER_EXISTENCE_ERRORS,

      accessTokenValidity: AuthConfig.CLIENT_TOKEN_CONFIG.accessTokenValidity,
      idTokenValidity: AuthConfig.CLIENT_TOKEN_CONFIG.idTokenValidity,
      refreshTokenValidity: AuthConfig.CLIENT_TOKEN_CONFIG.refreshTokenValidity
    })

    this.jwksUri = `${this.userPool.userPoolProviderUrl}/.well-known/jwks.json`
  }
}
