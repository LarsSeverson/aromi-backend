import { ServerLoadBalancerStack } from '../server/ServerLoadBalancerStack.js'
import { CDNStack } from './CDNStack.js'
import type { SynthCDNStackProps } from './types.js'

export const synthCDNStack = (props: SynthCDNStackProps) => {
  const { app, networkStack } = props
  const { network } = networkStack

  const serverLoadBalancer = new ServerLoadBalancerStack({ app, network })
  const cdn = new CDNStack({ app, serverLB: serverLoadBalancer })

  return { cdn, serverLoadBalancer }
}