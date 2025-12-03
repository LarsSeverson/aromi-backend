import { type ContainerDefinition, ContainerImage, CpuArchitecture, FargateTaskDefinition, LogDrivers } from 'aws-cdk-lib/aws-ecs'
import { InfraStack } from '../InfraStack.js'
import type { ServerTaskStackProps } from './types.js'
import { requiredEnv, unwrapOrThrowSync } from '@aromi/shared'

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
    const { app, ecr, db, storage, auth } = props
    super({ app, stackName: 'server-task' })

    const dbUser = unwrapOrThrowSync(requiredEnv('DB_USER'))
    const dbPassword = unwrapOrThrowSync(requiredEnv('DB_PASSWORD'))

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
        DB_PORT: db.cluster.clusterEndpoint.port.toString(),
        DB_USER: dbUser,
        DB_PASSWORD: dbPassword,
        DB_NAME: db.dbName,

        S3_BUCKET: storage.bucket.bucketName,

        COGNITO_USER_POOL_ID: auth.userPool.userPoolId,
        COGNITO_CLIENT_ID: auth.userPoolClient.userPoolClientId
      }
    })

    this.container.addPortMappings({
      containerPort: ServerTaskStack.CONTAINER_PORT
    })
  }
}