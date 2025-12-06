import { RedisServiceStack } from './RedisServiceStack.js'
import { RedisTaskStack } from './RedisTaskStack.js'
import type { SynthRedisServiceStackProps } from './types.js'

export const synthRedisStack = (props: SynthRedisServiceStackProps) => {
  const { app, networkStack, clusterStack } = props
  const { network } = networkStack
  const { cluster } = clusterStack

  const task = new RedisTaskStack({ app })
  const service = new RedisServiceStack({ app, network, cluster, task })

  return { task, service }
}