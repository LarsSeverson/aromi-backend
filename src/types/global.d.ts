export interface Env {
  NODE_ENV: 'development' | 'production' | 'test'

  SERVER_HOST: string
  SERVER_PORT: string
  ALLOWED_ORIGINS: string

  DB_HOST: string
  DB_USER: string
  DB_PASSWORD: string
  DB_NAME: string
  DB_PORT: string

  COGNITO_USER_POOL_ID: string
  COGNITO_CLIENT_ID: string
  COGNITO_JWKS_URI: string

  AWS_REGION: string
  AWS_ACCESS_KEY_ID: string
  AWS_SECRET_ACCESS_KEY: string

  S3_BUCKET: string

  CDN_DOMAIN: string
  CDN_KEY_PAIR_ID: string
  CDN_PRIVATE_KEY: string
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}
