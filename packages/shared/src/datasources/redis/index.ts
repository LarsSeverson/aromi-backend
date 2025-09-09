import { requiredEnv } from '@src/utils/env-util.js'
import type { ApiError } from '@src/utils/error.js'
import { Redis } from 'ioredis'
import { Result } from 'neverthrow'

export interface RedisWrapper {
  client: Redis
}

export const createRedisWrapper = (): Result<RedisWrapper, ApiError> => {
  return Result
    .combine([
      requiredEnv('REDIS_HOST'),
      requiredEnv('REDIS_PORT')
    ])
    .map(([
      host,
      port
    ]) => {
      const client = new Redis({
        host,
        port: Number(port),
        maxRetriesPerRequest: null
      })

      return { client }
    })
}
