import type { AuthStack } from '../auth/AuthStack.js'
import type { CDNStack } from '../cdn/CDNStack.js'
import type { DatabaseStack } from '../db/DatabaseStack.js'
import type { MeiliTaskStack } from '../meili-search/MeiliTaskStack.js'
import type { StorageStack } from '../storage/StorageStack.js'
import type { AppInfraProps } from '../types.js'
import type { WorkersECRStack } from './WorkersECRStack.js'

export interface WorkersECRStackProps extends AppInfraProps {}

export interface WorkersTaskStackProps extends AppInfraProps {
  ecr: WorkersECRStack
  db: DatabaseStack
  meili: MeiliTaskStack
  auth: AuthStack
  storage: StorageStack
  cdn: CDNStack
}