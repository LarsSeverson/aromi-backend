import { UserPool, UserPoolClient } from 'aws-cdk-lib/aws-cognito'
import { Construct } from 'constructs'
import type { CognitoConstructProps } from '../types.js'
import { Duration } from 'aws-cdk-lib'

export class CognitoConstruct extends Construct {
  readonly userPool: UserPool
  readonly userPoolId: string

  readonly userPoolClient: UserPoolClient
  readonly userPoolClientId: string

  readonly jwksUri: string

  private readonly internalConfig = {
    mfaSecondFactor: {
      sms: false,
      otp: true
    },

    autoVerify: {
      email: true
    },

    standardAttributes: {
      email: { required: true, mutable: true }
    },

    keepOriginal: {
      email: false,
      phone: false
    },

    client: {
      generateSecret: false,

      authFlows: {
        userPassword: true,
        userSrp: true,
        refreshToken: true,
        adminUserPassword: false
      },

      enableTokenRevocation: true,
      preventUserExistenceErrors: true,

      accessTokenValidity: Duration.hours(1),
      idTokenValidity: Duration.hours(1),
      refreshTokenValidity: Duration.days(90)
    }
  }

  constructor (props: CognitoConstructProps) {
    const { scope, config } = props
    super(scope, `${scope.prefix}-cognito`)

    this.userPoolId = `${scope.prefix}-user-pool`
    this.userPool = new UserPool(this, this.userPoolId, {
      userPoolName: this.userPoolId,

      signInAliases: config.cognito.signInAliases,

      mfa: config.cognito.mfa,
      mfaSecondFactor: this.internalConfig.mfaSecondFactor,

      selfSignUpEnabled: config.cognito.selfSignUpEnabled,

      autoVerify: this.internalConfig.autoVerify,
      standardAttributes: this.internalConfig.standardAttributes,
      keepOriginal: this.internalConfig.keepOriginal,

      accountRecovery: config.cognito.accountRecovery,

      passwordPolicy: config.cognito.passwordPolicy,
      removalPolicy: config.cognito.removalPolicy
    })

    this.userPoolClientId = `${scope.prefix}-user-pool-client`
    this.userPoolClient = new UserPoolClient(this, this.userPoolClientId, {
      userPool: this.userPool,
      userPoolClientName: this.userPoolClientId,

      generateSecret: this.internalConfig.client.generateSecret,

      authFlows: this.internalConfig.client.authFlows,

      enableTokenRevocation: this.internalConfig.client.enableTokenRevocation,
      preventUserExistenceErrors: this.internalConfig.client.preventUserExistenceErrors,

      accessTokenValidity: this.internalConfig.client.accessTokenValidity,
      idTokenValidity: this.internalConfig.client.idTokenValidity,
      refreshTokenValidity: this.internalConfig.client.refreshTokenValidity
    })

    this.jwksUri = `${this.userPool.userPoolProviderUrl}/.well-known/jwks.json`
  }
}