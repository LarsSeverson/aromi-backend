import type { AuthStack } from '../auth/AuthStack.js'
import type { DatabaseStack } from '../db/DatabaseStack.js'
import type { StorageStack } from '../storage/StorageStack.js'
import type { AppInfraProps } from '../types.js'
import type { ServerECRStack } from './ServerECRStack.js'

export interface ServerECRStackProps extends AppInfraProps {}

export interface ServerIamStackProps extends AppInfraProps {
  auth: AuthStack
  storage: StorageStack
}

export interface ServerTaskStackProps extends AppInfraProps {
  ecr: ServerECRStack
  db: DatabaseStack
  storage: StorageStack
  auth: AuthStack
}