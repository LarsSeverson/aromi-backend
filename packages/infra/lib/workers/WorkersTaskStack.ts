import ecs, { ContainerImage, CpuArchitecture, FargateTaskDefinition, LogDrivers, type ContainerDefinition } from 'aws-cdk-lib/aws-ecs'
import { InfraStack } from '../InfraStack.js'
import type { WorkersTaskStackProps } from './types.js'
import { RedisTaskStack } from '../redis/RedisTaskStack.js'
import { MeiliTaskStack } from '../meili-search/MeiliTaskStack.js'

export class WorkersTaskStack extends InfraStack {
  static readonly CPU = 512
  static readonly MEMORY = 1024

  static readonly PLATFORM = {
    cpuArchitecture: CpuArchitecture.X86_64
  }

  static readonly CONTAINER_NAME = 'workers'
  static readonly CONTAINER_PORT = 0

  static readonly LOG_PREFIX = 'workers'

  readonly taskId: string
  readonly task: FargateTaskDefinition

  readonly container: ContainerDefinition

  constructor (props: WorkersTaskStackProps) {
    const { app, ecr, db, meili, auth, storage, cdn } = props
    super({ app, stackName: 'worker-task' })

    this.taskId = `${this.prefix}-worker-task`
    this.task = new FargateTaskDefinition(this, this.taskId, {
      cpu: WorkersTaskStack.CPU,
      memoryLimitMiB: WorkersTaskStack.MEMORY,

      runtimePlatform: WorkersTaskStack.PLATFORM
    })

    this.container = this.task.addContainer(WorkersTaskStack.CONTAINER_NAME, {
      image: ContainerImage.fromEcrRepository(ecr.repository),

      logging: LogDrivers.awsLogs({
        streamPrefix: WorkersTaskStack.LOG_PREFIX
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
        COGNITO_JWKS_URI: auth.jwksUri,

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
      containerPort: WorkersTaskStack.CONTAINER_PORT
    })
  }
}