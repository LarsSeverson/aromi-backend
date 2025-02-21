import { Pool } from 'pg'
import { requiredEnv } from '../../utils/requiredEnv'
import AWS from 'aws-sdk'

const aromidb = new Pool({
  host: requiredEnv('DB_HOST'),
  user: requiredEnv('DB_USER'),
  password: requiredEnv('DB_PASSWORD'),
  database: requiredEnv('DB_NAME'),
  port: Number(requiredEnv('DB_PORT'))
})

export const s3 = new AWS.S3({
  region: requiredEnv('AWS_REGION'),
  credentials: {
    accessKeyId: requiredEnv('AWS_ACCESS_KEY_ID'),
    secretAccessKey: requiredEnv('AWS_SECRET_ACCESS_KEY')
  }
})

export default aromidb
