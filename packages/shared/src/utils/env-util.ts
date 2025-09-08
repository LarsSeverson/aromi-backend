import { config } from 'dotenv'
import { err, ok, type Result } from 'neverthrow'
import { ApiError } from './error.js'
import type { Env } from '@src/types/global.js'

config()

export const requiredEnv = (key: keyof Env): Result<string, ApiError> => {
  const value = process.env[key]

  if (value === undefined || value === '') {
    return err(new ApiError('INTERNAL_ERROR', `${key as string} is undefined`, 500))
  }

  return ok(value)
}
