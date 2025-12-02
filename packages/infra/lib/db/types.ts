import type { NetworkStack } from '../network/NetworkStack.js'
import type { AppInfraProps } from '../types.js'

export interface DatabaseStackProps extends AppInfraProps {
  network: NetworkStack
}
