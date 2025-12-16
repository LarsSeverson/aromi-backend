import { NetworkStack } from './NetworkStack.js'
import type { SynthNetworkStackProps } from './types.js'

export const synthNetworkStack = (props: SynthNetworkStackProps) => {
  const { scope: app } = props

  const network = new NetworkStack({ scope: app })

  return { network }
}