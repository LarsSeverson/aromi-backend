export interface RawAuthTokenTimings {
  accessTokenExpiresIn: number
  refreshTokenMaxAge: number
}

export interface RawAuthTokenPayload extends RawAuthTokenTimings {
  refreshToken: string
  accessToken: string
  idToken: string
}

export interface AuthDeliveryResultSummary {
  isComplete?: boolean

  method?: string
  attribute?: string
  destination?: string
}

export const REFRESH_TOKEN_EXP = 90 * 24 * 60 * 60 // 90 days
export const REFRESH_TOKEN_MAX_AGE = REFRESH_TOKEN_EXP * 1000 // Used for cookies

export const REFRESH_TOKEN_COOKIE = 'refreshToken'
export const REFRESH_TOKEN_PATH = '/'

export interface LogInParams {
  email: string
  password: string
}

export interface SignUpParams {
  email: string
  password: string
}

export interface ConfirmSignUpParams {
  email: string
  code: string
}

export interface ResendSignUpCodeParams {
  email: string
}

export interface ForgotPasswordParams {
  email: string
}

export interface ConfirmForgotPasswordParams {
  email: string
  code: string
  password: string
}
