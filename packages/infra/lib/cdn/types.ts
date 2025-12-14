import type { CertStack } from '../cert/CertStack.js'
import type { SynthCertStackOutput } from '../cert/types.js'
import type { LoadBalancerStack } from '../load-balancer/LoadBalancerStack.js'
import type { SynthLoadBalancerStackOutput } from '../load-balancer/types.js'
import type { SynthNetworkStackOutput } from '../network/types.js'
import type { StorageStack } from '../storage/StorageStack.js'
import type { SynthStorageStackOutput } from '../storage/types.js'
import type { BaseStackProps } from '../types.js'
import type { SynthWAFStackOutput } from '../waf/types.js'
import type { WAFStack } from '../waf/WAFStack.js'
import type { CDNStack } from './CDNStack.js'

export interface CDNStackProps extends BaseStackProps {
  storage: StorageStack
  loadBalancer: LoadBalancerStack
  waf: WAFStack
  cert: CertStack
}

export interface SynthCDNStackProps extends BaseStackProps {
  networkStack: SynthNetworkStackOutput
  storageStack: SynthStorageStackOutput
  loadBalancerStack: SynthLoadBalancerStackOutput
  wafStack: SynthWAFStackOutput
  certStack: SynthCertStackOutput
}

export interface SynthCDNStackOutput {
  cdn: CDNStack
}