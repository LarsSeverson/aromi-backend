import { ContainerImage, CpuArchitecture, FargateTaskDefinition, LogDrivers, type ContainerDefinition } from 'aws-cdk-lib/aws-ecs'
import { InfraStack } from '../InfraStack.js'
import type { WorkerTaskStackProps } from './types.js'
import { RedisTaskStack } from '../redis/RedisTaskStack.js'
import { MeiliTaskStack } from '../meili-search/MeiliTaskStack.js'

export class WorkerTaskStack extends InfraStack {
  static readonly CPU = 512
  static readonly MEMORY = 1024

  static readonly PLATFORM = {
    cpuArchitecture: CpuArchitecture.X86_64
  }

  static readonly CONTAINER_NAME = 'workers'
  static readonly WORKER_PORT = 0

  readonly taskId: string
  readonly task: FargateTaskDefinition

  readonly container: ContainerDefinition

  constructor (props: WorkerTaskStackProps) {
    const { app, ecr, db, redis, meili, auth, storage, cdn } = props
    super({ app, stackName: 'worker-task' })

    this.taskId = `${this.prefix}-worker-task`
    this.task = new FargateTaskDefinition(this, this.taskId, {
      cpu: WorkerTaskStack.CPU,
      memoryLimitMiB: WorkerTaskStack.MEMORY,

      runtimePlatform: WorkerTaskStack.PLATFORM
    })

    this.container = this.task.addContainer(WorkerTaskStack.CONTAINER_NAME, {
      image: ContainerImage.fromEcrRepository(ecr.repository),

      logging: LogDrivers.awsLogs({
        streamPrefix: WorkerTaskStack.CONTAINER_NAME
      }),

      environment: {
        NODE_ENV: this.envName,

        DB_HOST: db.cluster.clusterEndpoint.hostname,
        DB_PORT: db.cluster.clusterEndpoint.port.toString(),
        DB_NAME: db.dbName,
        DB_USER: db.dbUser,
        DB_PASSWORD: db.dbPassword,
        DB_URL: '',

        REDIS_HOST: `${redis.service.serviceName}.local`,
        REDIS_PORT: RedisTaskStack.CONTAINER_PORT.toString(),
        REDIS_URL: `redis://${redis.service.serviceName}.local:${RedisTaskStack.CONTAINER_PORT}`,

        MEILI_HOST: `http://${meili.service.serviceName}.local:${MeiliTaskStack.CONTAINER_PORT}`,
        MEILI_MASTER_KEY: meili.masterKey,
        MEILI_ENV: this.envName,

        COGNITO_USER_POOL_ID: auth.userPool.userPoolId,
        COGNITO_CLIENT_ID: auth.userPoolClient.userPoolClientId,

        S3_BUCKET_NAME: storage.bucket.bucketName,

        CDN_DISTRIBUTION_ID: cdn.distribution.distributionId,
        CDN_DOMAIN_NAME: cdn.distribution.domainName
      }
    })
  }
}