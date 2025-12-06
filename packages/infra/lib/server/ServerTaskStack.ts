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
  static readonly CONTAINER_HOST = '0.0.0.0'
  static readonly CONTAINER_PORT = 8080

  static readonly SERVICE_HOST = ServerTaskStack.CONTAINER_NAME
  static readonly SERVICE_PORT = ServerTaskStack.CONTAINER_PORT
  static readonly SERVICE_URL = `http://${ServerTaskStack.SERVICE_HOST}:${ServerTaskStack.SERVICE_PORT}`

  static readonly LOG_PREFIX = 'server'

  readonly taskId: string
  readonly task: FargateTaskDefinition

  readonly container: ContainerDefinition

  constructor (props: ServerTaskStackProps) {
    const { app, auth, database, cdn, meiliTask: meili, ecr, iam } = props
    super({ app, stackName: 'server-task' })

    this.taskId = `${this.prefix}-server-task`
    this.task = new FargateTaskDefinition(this, this.taskId, {
      taskRole: iam.role,

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

        SERVER_HOST: ServerTaskStack.CONTAINER_HOST,
        SERVER_PORT: ServerTaskStack.CONTAINER_PORT.toString(),
        ALLOWED_ORIGINS: [`https://${cdn.domainName}`].join(','),

        DB_HOST: database.cluster.clusterEndpoint.hostname,
        DB_USER: database.dbSecret.secretValueFromJson('username').unsafeUnwrap(),
        DB_NAME: database.dbName,
        DB_PORT: database.cluster.clusterEndpoint.port.toString(),
        DB_URL: database.dbUrl,

        REDIS_HOST: RedisTaskStack.SERVICE_HOST,
        REDIS_PORT: RedisTaskStack.SERVICE_PORT.toString(),
        REDIS_URL: RedisTaskStack.SERVICE_URL,

        MEILI_ENV: this.envName,
        MEILI_HOST: MeiliTaskStack.SERVICE_HOST,

        COGNITO_USER_POOL_ID: auth.userPool.userPoolId,
        COGNITO_CLIENT_ID: auth.userPoolClient.userPoolClientId,
        COGNITO_REGION: this.region,

        AWS_REGION: this.region,

        S3_BUCKET: cdn.bucket.bucketName,

        CDN_DOMAIN: cdn.domainName
      },

      secrets: {
        DB_PASSWORD: ecs.Secret.fromSecretsManager(database.dbSecret, database.dbSecretKey),
        MEILI_MASTER_KEY: ecs.Secret.fromSecretsManager(meili.masterSecret, meili.masterSecretKey)
      }
    })

    this.container.addPortMappings({
      containerPort: ServerTaskStack.CONTAINER_PORT
    })
  }
}