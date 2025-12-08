import { Duration, RemovalPolicy } from 'aws-cdk-lib'
import { BaseConfig } from '../../BaseConfig.js'
import { AccountRecovery, Mfa } from 'aws-cdk-lib/aws-cognito'

export class AuthConfig extends BaseConfig {
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

}