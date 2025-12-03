import type { ClusterStack } from '../cluster/ClusterStack.js'
import type { AppInfraProps } from '../types.js'
import type { RedisTaskStack } from './RedisTaskStack.js'

export interface RedisServiceStackProps extends AppInfraProps {
  cluster: ClusterStack
  task: RedisTaskStack
}

export interface RedisTaskStackProps extends AppInfraProps {}