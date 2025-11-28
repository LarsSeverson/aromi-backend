import { Mfa, UserPool, UserPoolClient } from 'aws-cdk-lib/aws-cognito'
import { InfraStack } from './InfraStack.js'
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

  static readonly PASSWORD_POLICY = {
    minLength: 8,
    requireDigits: false,
    requireLowercase: false,
    requireUppercase: false,
    requireSymbols: false,
    tempPasswordValidityDays: Duration.days(7)
  }

  static readonly REMOVAL_POLICY = RemovalPolicy.RETAIN

  static readonly GENERATE_SECRET = false

  static readonly CLIENT_AUTH_FLOWS = {
    userPassword: true,
    userSrp: true,
    adminUserPassword: true
  }

  readonly userPool: UserPool
  readonly userPoolClient: UserPoolClient
  readonly userPoolId: string
  readonly userPoolClientId: string

  constructor (props: AuthStackProps) {
    const { app } = props
    super({ app, stackName: 'auth' })

    const poolName = `${this.prefix}-user-pool`
    const clientName = `${this.prefix}-client`

    this.userPool = new UserPool(this, poolName, {
      userPoolName: poolName,
      signInAliases: AuthStack.SIGN_IN_ALIASES,

      mfa: AuthStack.MFA,
      mfaSecondFactor: AuthStack.MFA_SECOND_FACTOR,

      selfSignUpEnabled: AuthStack.SELF_SIGN_UP,
      autoVerify: AuthStack.AUTO_VERIFY,

      passwordPolicy: AuthStack.PASSWORD_POLICY,

      removalPolicy: AuthStack.REMOVAL_POLICY
    })

    this.userPoolClient = new UserPoolClient(this, clientName, {
      userPool: this.userPool,
      userPoolClientName: clientName,

      generateSecret: AuthStack.GENERATE_SECRET,

      authFlows: AuthStack.CLIENT_AUTH_FLOWS
    })

    this.userPoolId = this.userPool.userPoolId
    this.userPoolClientId = this.userPoolClient.userPoolClientId
  }
}