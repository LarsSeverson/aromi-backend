import { LoadBalancerStack } from './LoadBalancerStack.js'
import type { SynthLoadBalancerStackProps } from './types.js'

export const synthLoadBalancerStack = (props: SynthLoadBalancerStackProps) => {
  const { app, networkStack } = props
  const { network } = networkStack

  const loadBalancer = new LoadBalancerStack({ app, network })

  return { loadBalancer }
}