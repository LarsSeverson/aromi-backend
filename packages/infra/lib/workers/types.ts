import type { AuthStack } from '../auth/AuthStack.js'
import type { CDNStack } from '../cdn/CDNStack.js'
import type { DatabaseStack } from '../db/DatabaseStack.js'
import type { MeiliServiceStack } from '../meili-search/MeiliServiceStack.js'
import type { RedisServiceStack } from '../redis/RedisServiceStack.js'
import type { StorageStack } from '../storage/StorageStack.js'
import type { AppInfraProps } from '../types.js'
import type { WorkerECRStack } from './WorkerECRStack.js'

export interface WorkerECRStackProps extends AppInfraProps {}

export interface WorkerTaskStackProps extends AppInfraProps {
  ecr: WorkerECRStack
  db: DatabaseStack
  redis: RedisServiceStack
  meili: MeiliServiceStack
  auth: AuthStack
  storage: StorageStack
  cdn: CDNStack
}