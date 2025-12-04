import ecs, { type ContainerDefinition, ContainerImage, CpuArchitecture, FargateTaskDefinition, LogDrivers } from 'aws-cdk-lib/aws-ecs'
import { InfraStack } from '../InfraStack.js'
import type { MeiliTaskStackProps } from './types.js'
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam'
import { Secret } from 'aws-cdk-lib/aws-secretsmanager'

export class MeiliTaskStack extends InfraStack {
  static readonly MEILI_REGISTRY = 'getmeili/meilisearch:latest'

  static readonly CPU = 1024
  static readonly MEMORY_LIMIT_MIB = 2048

  static readonly RUNTMIME_PLATFORM = {
    cpuArchitecture: CpuArchitecture.X86_64
  }

  static readonly CONTAINER_NAME = 'meili'
  static readonly CONTAINER_PORT = 7700

  static readonly VOLUME_NAME = 'meili-efs'
  static readonly VOLUME_PATH = '/meili_data'

  static readonly SERVICE_HOST = MeiliTaskStack.CONTAINER_NAME
  static readonly SERVICE_PORT = MeiliTaskStack.CONTAINER_PORT
  static readonly SERVICE_URL = `http://${MeiliTaskStack.SERVICE_HOST}:${MeiliTaskStack.SERVICE_PORT}`

  readonly taskId: string
  readonly task: FargateTaskDefinition

  readonly container: ContainerDefinition

  readonly masterSecretKey = 'key'
  readonly masterSecretId: string
  readonly masterSecret: Secret

  constructor (props: MeiliTaskStackProps) {
    const { app, storage } = props
    super({ app, stackName: 'meili-task' })

    this.masterSecretId = `${this.prefix}-meili-master-key`
    this.masterSecret = new Secret(this, this.masterSecretId, {
      secretName: this.masterSecretId,

      generateSecretString: {
        secretStringTemplate: JSON.stringify({}),
        generateStringKey: this.masterSecretKey,
        passwordLength: 32
      }
    })

    this.taskId = `${this.prefix}-meili-task`
    this.task = new FargateTaskDefinition(this, this.taskId, {
      cpu: MeiliTaskStack.CPU,
      memoryLimitMiB: MeiliTaskStack.MEMORY_LIMIT_MIB,

      runtimePlatform: MeiliTaskStack.RUNTMIME_PLATFORM,

      volumes: [
        {
          name: MeiliTaskStack.VOLUME_NAME,
          efsVolumeConfiguration: {
            fileSystemId: storage.fileSystem.fileSystemId,
            authorizationConfig: {
              accessPointId: storage.accessPoint.accessPointId
            }
          }
        }
      ]
    })

    this.container = this.task.addContainer(MeiliTaskStack.CONTAINER_NAME, {
      image: ContainerImage.fromRegistry(MeiliTaskStack.MEILI_REGISTRY),

      logging: LogDrivers.awsLogs({
        streamPrefix: MeiliTaskStack.CONTAINER_NAME
      }),

      environment: {
        MEILI_ENV: this.envName,
        MEILI_DB_PATH: MeiliTaskStack.VOLUME_PATH
      },

      secrets: {
        MEILI_MASTER_KEY: ecs.Secret.fromSecretsManager(this.masterSecret, this.masterSecretKey)
      }
    })

    this.container.addPortMappings({
      containerPort: MeiliTaskStack.CONTAINER_PORT
    })

    this.container.addMountPoints({
      containerPath: MeiliTaskStack.VOLUME_PATH,
      sourceVolume: MeiliTaskStack.VOLUME_NAME,
      readOnly: false
    })

    this.task.addToTaskRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [storage.fileSystem.fileSystemArn],
        actions: [
          'elasticfilesystem:ClientMount',
          'elasticfilesystem:ClientWrite'
        ]
      })
    )
  }
}