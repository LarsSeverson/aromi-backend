import { ServerLoadBalancerStack } from '../server/ServerLoadBalancerStack.js'
import { CDNStack } from './CDNStack.js'
import type { SynthCDNStackProps } from './types.js'

export const synthCDNStack = (props: SynthCDNStackProps) => {
  const { app, networkStack, storageStack } = props
  const { network } = networkStack
  const { storage } = storageStack

  const serverLoadBalancer = new ServerLoadBalancerStack({ app, network })
  const cdn = new CDNStack({ app, storage, serverLB: serverLoadBalancer })

  return { cdn, serverLoadBalancer }
}