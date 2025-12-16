import { CDNStack } from './CDNStack.js'
import type { SynthCDNStackProps } from './types.js'

export const synthCDNStack = (props: SynthCDNStackProps) => {
  const { scope: app, storageStack, loadBalancerStack, wafStack, certStack } = props
  const { storage } = storageStack
  const { loadBalancer } = loadBalancerStack
  const { waf } = wafStack
  const { cert } = certStack

  const cdn = new CDNStack({ scope: app, storage, loadBalancer, waf, cert })

  return { cdn }
}