import { ClusterStack } from './ClusterStack.js'
import type { SynthClusterStackProps } from './types.js'

export const synthClusterStack = (props: SynthClusterStackProps) => {
  const { app, networkStack } = props
  const { network } = networkStack

  const cluster = new ClusterStack({ app, network })

  return { cluster }
}