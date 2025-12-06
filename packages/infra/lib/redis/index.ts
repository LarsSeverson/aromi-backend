import { RedisAppStack } from './RedisAppStack.js'
import type { SynthRedisServiceStackProps } from './types.js'

export const synthRedisStack = (props: SynthRedisServiceStackProps) => {
  const { app, networkStack, clusterStack } = props
  const { network } = networkStack
  const { cluster } = clusterStack

  const redisApp = new RedisAppStack({ app, network, cluster })

  return { app: redisApp }
}