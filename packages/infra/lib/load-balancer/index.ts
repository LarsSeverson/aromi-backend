import { LoadBalancerStack } from './LoadBalancerStack.js'
import type { SynthLoadBalancerStackProps } from './types.js'

export const synthLoadBalancerStack = (props: SynthLoadBalancerStackProps) => {
  const { scope: app, networkStack } = props
  const { network } = networkStack

  const loadBalancer = new LoadBalancerStack({ scope: app, network })

  return { loadBalancer }
}