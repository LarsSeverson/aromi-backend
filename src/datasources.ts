import { Pool } from 'pg'
import { requiredEnv } from './utils/requiredEnv'
import { S3Client } from '@aws-sdk/client-s3'

const aromidb = new Pool({
  host: requiredEnv('DB_HOST'),
  user: requiredEnv('DB_USER'),
  password: requiredEnv('DB_PASSWORD'),
  database: requiredEnv('DB_NAME'),
  port: Number(requiredEnv('DB_PORT'))
})

export const s3 = new S3Client({
  region: requiredEnv('AWS_REGION'),
  credentials: {
    accessKeyId: requiredEnv('AWS_ACCESS_KEY_ID'),
    secretAccessKey: requiredEnv('AWS_SECRET_ACCESS_KEY')
  }
})

export default aromidb
