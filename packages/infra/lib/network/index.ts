import { NetworkStack } from './NetworkStack.js'
import type { SynthNetworkStackProps } from './types.js'

export const synthNetworkStack = (props: SynthNetworkStackProps) => {
  const { app } = props

  const network = new NetworkStack({ app })

  return { network }
}