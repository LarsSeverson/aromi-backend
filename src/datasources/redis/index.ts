import { requiredEnv } from '@src/utils/env-util'
import { type ApiError } from '@src/utils/error'
import IORedis from 'ioredis'
import { Result } from 'neverthrow'

export interface RedisWrapper {
  client: IORedis
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
      const client = new IORedis({
        host,
        port: Number(port)
      })

      return { client }
    })
}
