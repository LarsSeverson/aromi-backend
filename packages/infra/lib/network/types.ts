import type { BaseComponentProps, BaseStackProps } from '../types.js'
import type { NetworkStack } from './NetworkStack.js'

export interface DatabaseSecurityGroupComponentProps extends BaseComponentProps {
  stack: NetworkStack
}

export interface MeiliSecurityGroupComponentProps extends BaseComponentProps {
  stack: NetworkStack
}

export interface RedisSecurityGroupComponentProps extends BaseComponentProps {
  stack: NetworkStack
}

export interface ServerLoadBalancerSecurityGroupComponentProps extends BaseComponentProps {
  stack: NetworkStack
}

export interface ServerSecurityGroupComponentProps extends BaseComponentProps {
  stack: NetworkStack
}

export interface NetworkStackProps extends BaseStackProps { }

export interface SynthNetworkStackProps extends BaseStackProps { }

export interface SynthNetworkStackOutput {
  network: NetworkStack
}