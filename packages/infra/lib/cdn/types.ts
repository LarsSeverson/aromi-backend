import type { SynthNetworkStackOutput } from '../network/types.js'
import type { ServerLoadBalancerStack } from '../server/ServerLoadBalancerStack.js'
import type { AppInfraProps } from '../types.js'
import type { CDNStack } from './CDNStack.js'

export interface CDNStackProps extends AppInfraProps {
  serverLB: ServerLoadBalancerStack
}

export interface SynthCDNStackProps extends AppInfraProps {
  networkStack: SynthNetworkStackOutput
}

export interface SynthCDNStackOutput {
  cdn: CDNStack
  serverLoadBalancer: ServerLoadBalancerStack
}