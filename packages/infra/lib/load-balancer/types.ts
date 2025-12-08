import type { NetworkStack } from '../network/NetworkStack.js'
import type { SynthNetworkStackOutput } from '../network/types.js'
import type { BaseComponentProps, BaseStackProps } from '../types.js'
import type { LoadBalancerStack } from './LoadBalancerStack.js'

export interface ServerLoadBalancerComponentProps extends BaseComponentProps {
  network: NetworkStack
}

export interface LoadBalancerStackProps extends BaseStackProps {
  network: NetworkStack
}

export interface SynthLoadBalancerStackProps extends BaseStackProps {
  networkStack: SynthNetworkStackOutput
}

export interface SynthLoadBalancerStackOutput {
  loadBalancer: LoadBalancerStack
}