import { config } from 'dotenv'
import { err, ok, type Result } from 'neverthrow'
import { BackendError } from './error.js'
import type { Env } from '@src/types/global.js'

config()

export const requiredEnv = (key: keyof Env): Result<string, BackendError> => {
  const value = process.env[key]

  if (value === undefined || value === '') {
    return err(new BackendError('INTERNAL_ERROR', `${key as string} is undefined`, 500))
  }

  return ok(value)
}
