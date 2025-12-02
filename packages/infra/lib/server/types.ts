import type { AuthStack } from '../auth/AuthStack.js'
import type { StorageStack } from '../storage/StorageStack.js'
import type { AppInfraProps } from '../types.js'

export interface ServerIamStackProps extends AppInfraProps {
  auth: AuthStack
  storage: StorageStack
}
