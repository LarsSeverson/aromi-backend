import type { NetworkStack } from '../network/NetworkStack.js'
import type { AppInfraProps } from '../types.js'

export interface ClusterStackProps extends AppInfraProps {
  network: NetworkStack
}
