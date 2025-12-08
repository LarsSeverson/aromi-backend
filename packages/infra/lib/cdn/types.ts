import type { LoadBalancerStack } from '../load-balancer/LoadBalancerStack.js'
import type { SynthLoadBalancerStackOutput } from '../load-balancer/types.js'
import type { SynthNetworkStackOutput } from '../network/types.js'
import type { StorageStack } from '../storage/StorageStack.js'
import type { SynthStorageStackOutput } from '../storage/types.js'
import type { BaseStackProps } from '../types.js'
import type { CDNStack } from './CDNStack.js'

export interface CDNStackProps extends BaseStackProps {
  storage: StorageStack
  loadBalancer: LoadBalancerStack
}

export interface SynthCDNStackProps extends BaseStackProps {
  networkStack: SynthNetworkStackOutput
  storageStack: SynthStorageStackOutput
  loadBalancerStack: SynthLoadBalancerStackOutput
}

export interface SynthCDNStackOutput {
  cdn: CDNStack
}