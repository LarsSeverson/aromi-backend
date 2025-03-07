import dotenv from 'dotenv'

dotenv.config()

export const requiredEnv = (key: string): string => {
  const value = process.env[key]
  if (value === undefined || value === '') {
    throw new Error(`Missing required env variable: ${key}`)
  }

  return value
}
