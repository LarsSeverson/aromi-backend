import ecs, { type ContainerDefinition, ContainerImage, FargateTaskDefinition } from 'aws-cdk-lib/aws-ecs'
import type { ServerTaskComponentProps } from '../types.js'
import { ServerConfig } from './ServerConfig.js'
import { RedisConfig } from '../../redis/components/RedisConfig.js'

export class ServerTaskComponent {
  readonly taskId: string
  readonly task: FargateTaskDefinition

  readonly container: ContainerDefinition

  constructor (props: ServerTaskComponentProps) {
    const {
      stack,

      auth,
      storage,
      database,
      cdn,

      iam,
      ecr,

      meili,
      redis
    } = props

    this.taskId = `${stack.prefix}-server-task`
    this.task = new FargateTaskDefinition(stack, this.taskId, {
      cpu: ServerConfig.TASK_CONFIG.cpu,
      memoryLimitMiB: ServerConfig.TASK_CONFIG.memoryLimitMiB,
      runtimePlatform: ServerConfig.TASK_CONFIG.runtimePlatform,

      taskRole: iam.role
    })

    this.container = this.task.addContainer(ServerConfig.CONTAINER_CONFIG.containerName, {
      image: ContainerImage.fromEcrRepository(ecr.repository),

      logging: ServerConfig.CONTAINER_CONFIG.logging,

      environment: {
        NODE_ENV: stack.envName,

        SERVER_HOST: ServerConfig.CONTAINER_CONFIG.containerHost,
        SERVER_PORT: ServerConfig.CONTAINER_CONFIG.containerPort.toString(),
        ALLOWED_ORIGINS: [`https://${cdn.domainName}`].join(','),

        COGNITO_USER_POOL_ID: auth.userPool.userPoolId,
        COGNITO_CLIENT_ID: auth.userPoolClient.userPoolClientId,
        COGNITO_JWKS_URI: auth.jwksUri,

        S3_BUCKET: storage.bucket.bucketName,

        DB_HOST: database.cluster.clusterEndpoint.hostname,
        DB_USER: database.dbSecret.secretValueFromJson('username').unsafeUnwrap(),
        DB_NAME: database.dbName,
        DB_PORT: database.cluster.clusterEndpoint.port.toString(),
        DB_URL: database.dbUrl,

        MEILI_HOST: meili.serviceComponent.meiliDns,

        REDIS_HOST: redis.serviceComponent.redisDns,
        REDIS_PORT: RedisConfig.CONTAINER_CONFIG.containerPort.toString()
      },

      secrets: {
        DB_PASSWORD: ecs.Secret.fromSecretsManager(
          database.dbSecret,
          database.dbSecretKey
        ),

        MEILI_MASTER_KEY: ecs.Secret.fromSecretsManager(
          meili.taskComponent.masterSecret,
          meili.taskComponent.masterSecretKey
        )
      }
    })

    this.container.addPortMappings({
      containerPort: ServerConfig.CONTAINER_CONFIG.containerPort
    })
  }
}