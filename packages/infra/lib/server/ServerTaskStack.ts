import ecs, { type ContainerDefinition, ContainerImage, CpuArchitecture, FargateTaskDefinition, LogDrivers } from 'aws-cdk-lib/aws-ecs'
import { InfraStack } from '../InfraStack.js'
import type { ServerTaskStackProps } from './types.js'
import { RedisTaskStack } from '../redis/RedisTaskStack.js'
import { MeiliTaskStack } from '../meili-search/MeiliTaskStack.js'

export class ServerTaskStack extends InfraStack {
  static readonly CPU = 1024
  static readonly MEMORY_LIMIT_MIB = 2048

  static readonly RUNTIME_PLATFORM = {
    cpuArchitecture: CpuArchitecture.X86_64
  }

  static readonly CONTAINER_NAME = 'server'
  static readonly CONTAINER_PORT = 8080

  static readonly LOG_PREFIX = 'server'

  readonly taskId: string
  readonly task: FargateTaskDefinition

  readonly container: ContainerDefinition

  constructor (props: ServerTaskStackProps) {
    const { app, ecr, db, storage, auth, cdn, meili } = props
    super({ app, stackName: 'server-task' })

    this.taskId = `${this.prefix}-server-task`
    this.task = new FargateTaskDefinition(this, this.taskId, {
      cpu: ServerTaskStack.CPU,
      memoryLimitMiB: ServerTaskStack.MEMORY_LIMIT_MIB,

      runtimePlatform: ServerTaskStack.RUNTIME_PLATFORM
    })

    this.container = this.task.addContainer(ServerTaskStack.CONTAINER_NAME, {
      image: ContainerImage.fromEcrRepository(ecr.repository),

      logging: LogDrivers.awsLogs({
        streamPrefix: ServerTaskStack.LOG_PREFIX
      }),

      environment: {
        NODE_ENV: this.envName,

        DB_HOST: db.cluster.clusterEndpoint.hostname,
        DB_USER: db.dbSecret.secretValueFromJson('username').unsafeUnwrap(),
        DB_NAME: db.dbName,
        DB_PORT: db.cluster.clusterEndpoint.port.toString(),
        DB_URL: db.dbUrl,

        REDIS_HOST: RedisTaskStack.SERVICE_HOST,
        REDIS_PORT: RedisTaskStack.SERVICE_PORT.toString(),
        REDIS_URL: RedisTaskStack.SERVICE_URL,

        MEILI_ENV: this.envName,
        MEILI_HOST: MeiliTaskStack.SERVICE_HOST,

        COGNITO_USER_POOL_ID: auth.userPool.userPoolId,
        COGNITO_CLIENT_ID: auth.userPoolClient.userPoolClientId,
        COGNITO_REGION: this.region,

        AWS_REGION: this.region,

        S3_BUCKET: storage.bucket.bucketName,

        CDN_DOMAIN: cdn.domainName
      },

      secrets: {
        DB_PASSWORD: ecs.Secret.fromSecretsManager(db.dbSecret, 'password'),
        MEILI_MASTER_KEY: ecs.Secret.fromSecretsManager(meili.masterSecret, meili.masterSecretKey)
      }
    })

    this.container.addPortMappings({
      containerPort: ServerTaskStack.CONTAINER_PORT
    })
  }
}