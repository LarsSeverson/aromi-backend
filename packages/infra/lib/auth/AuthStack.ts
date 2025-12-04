import {
  Mfa,
  UserPool,
  UserPoolClient,
  AccountRecovery
} from 'aws-cdk-lib/aws-cognito'
import { InfraStack } from '../InfraStack.js'
import type { AuthStackProps } from './types.js'
import { Duration, RemovalPolicy } from 'aws-cdk-lib'

export class AuthStack extends InfraStack {
  static readonly SIGN_IN_ALIASES = {
    email: true,
    username: false,
    phone: false
  }

  static readonly MFA = Mfa.OFF
  static readonly MFA_SECOND_FACTOR = {
    sms: false,
    otp: true
  }

  static readonly SELF_SIGN_UP = true

  static readonly AUTO_VERIFY = {
    email: true
  }

  static readonly STANDARD_ATTRIBUTES = {
    email: {
      required: true,
      mutable: true
    }
  }

  static readonly KEEP_ORIGINAL = {
    email: false,
    phone: false
  }

  static readonly PASSWORD_POLICY = {
    minLength: 8,
    requireDigits: false,
    requireLowercase: false,
    requireUppercase: false,
    requireSymbols: false,
    tempPasswordValidity: Duration.days(7)
  }

  static readonly REMOVAL_POLICY = RemovalPolicy.RETAIN

  static readonly ACCOUNT_RECOVERY = AccountRecovery.EMAIL_AND_PHONE_WITHOUT_MFA

  static readonly GENERATE_SECRET = false
  static readonly ENABLE_TOKEN_REVOCATION = true
  static readonly PREVENT_USER_EXISTENCE_ERRORS = true

  static readonly CLIENT_AUTH_FLOWS = {
    userPassword: true,
    userSrp: true,
    refreshToken: true,
    adminUserPassword: false
  }

  static readonly CLIENT_TOKEN_CONFIG = {
    accessTokenValidity: Duration.hours(1),
    idTokenValidity: Duration.hours(1),
    refreshTokenValidity: Duration.days(90)
  }

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

      signInAliases: AuthStack.SIGN_IN_ALIASES,

      mfa: AuthStack.MFA,
      mfaSecondFactor: AuthStack.MFA_SECOND_FACTOR,

      selfSignUpEnabled: AuthStack.SELF_SIGN_UP,

      autoVerify: AuthStack.AUTO_VERIFY,
      standardAttributes: AuthStack.STANDARD_ATTRIBUTES,
      keepOriginal: AuthStack.KEEP_ORIGINAL,

      passwordPolicy: AuthStack.PASSWORD_POLICY,

      removalPolicy: AuthStack.REMOVAL_POLICY,

      accountRecovery: AuthStack.ACCOUNT_RECOVERY
    })

    this.userPoolClientId = `${this.prefix}-client`
    this.userPoolClient = new UserPoolClient(this, this.userPoolClientId, {
      userPool: this.userPool,
      userPoolClientName: this.userPoolClientId,

      generateSecret: AuthStack.GENERATE_SECRET,

      authFlows: AuthStack.CLIENT_AUTH_FLOWS,

      enableTokenRevocation: AuthStack.ENABLE_TOKEN_REVOCATION,
      preventUserExistenceErrors: AuthStack.PREVENT_USER_EXISTENCE_ERRORS,

      accessTokenValidity: AuthStack.CLIENT_TOKEN_CONFIG.accessTokenValidity,
      idTokenValidity: AuthStack.CLIENT_TOKEN_CONFIG.idTokenValidity,
      refreshTokenValidity: AuthStack.CLIENT_TOKEN_CONFIG.refreshTokenValidity
    })

    this.jwksUri = `${this.userPool.userPoolProviderUrl}/.well-known/jwks.json`
  }
}
