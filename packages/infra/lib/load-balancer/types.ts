import type { NetworkStack } from '../network/NetworkStack.js'
import type { SynthNetworkStackOutput } from '../network/types.js'
import type { BaseComponentProps, BaseConstructProps } from '../../common/types.js'
import type { LoadBalancerStack } from './LoadBalancerStack.js'

export interface ServerLoadBalancerComponentProps extends BaseComponentProps {
  network: NetworkStack
}

export interface LoadBalancerStackProps extends BaseConstructProps {
  network: NetworkStack
}

export interface SynthLoadBalancerStackProps extends BaseConstructProps {
  networkStack: SynthNetworkStackOutput
}

export interface SynthLoadBalancerStackOutput {
  loadBalancer: LoadBalancerStack
}