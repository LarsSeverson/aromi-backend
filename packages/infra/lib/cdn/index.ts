import { CDNStack } from './CDNStack.js'
import type { SynthCDNStackProps } from './types.js'

export const synthCDNStack = (props: SynthCDNStackProps) => {
  const { app, storageStack, loadBalancerStack } = props
  const { storage } = storageStack
  const { loadBalancer } = loadBalancerStack

  const cdn = new CDNStack({ app, storage, loadBalancer })

  return { cdn }
}