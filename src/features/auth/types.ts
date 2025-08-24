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
