import type { SynthNetworkStackOutput } from '../network/types.js'
import type { ServerLoadBalancerStack } from '../server/ServerLoadBalancerStack.js'
import type { StorageStack } from '../storage/StorageStack.js'
import type { SynthStorageStackOutput } from '../storage/types.js'
import type { BaseInfraProps } from '../types.js'
import type { CDNStack } from './CDNStack.js'

export interface CDNStackProps extends BaseInfraProps {
  storage: StorageStack
  serverLB: ServerLoadBalancerStack
}

export interface SynthCDNStackProps extends BaseInfraProps {
  networkStack: SynthNetworkStackOutput
  storageStack: SynthStorageStackOutput
}

export interface SynthCDNStackOutput {
  cdn: CDNStack
  serverLoadBalancer: ServerLoadBalancerStack
}