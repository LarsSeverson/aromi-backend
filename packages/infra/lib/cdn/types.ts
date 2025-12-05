import type { ServerLoadBalancerStack } from '../server/ServerLoadBalancerStack.js'
import type { StorageStack } from '../storage/StorageStack.js'
import type { AppInfraProps } from '../types.js'

export interface CDNStackProps extends AppInfraProps {
  storage: StorageStack
  serverLB: ServerLoadBalancerStack
}
