import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const requiredEnv = (key: string): string => {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing required env variable: ${key}`)
  }

  return value
}

const rdsPool = new Pool({
  host: requiredEnv('DB_HOST'),
  user: requiredEnv('DB_USER'),
  password: requiredEnv('DB_PASSWORD'),
  database: requiredEnv('DB_NAME'),
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432
})

export default rdsPool
