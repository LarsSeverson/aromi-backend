import { type ContainerDefinition, ContainerImage, CpuArchitecture, FargateTaskDefinition, LogDrivers } from 'aws-cdk-lib/aws-ecs'
import { InfraStack } from '../InfraStack.js'
import type { MeiliTaskStackProps } from './types.js'
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam'
import { requiredEnv, unwrapOrThrowSync } from '@aromi/shared'

export class MeiliTaskStack extends InfraStack {
  static readonly CPU = 1024
  static readonly MEMORY_LIMIT_MIB = 2048

  static readonly RUNTMIME_PLATFORM = {
    cpuArchitecture: CpuArchitecture.X86_64
  }

  static readonly CONTAINER_NAME = 'meili'
  static readonly CONTAINER_PORT = 7700

  static readonly VOLUME_NAME = 'meili-efs'
  static readonly VOLUME_PATH = '/meili_data'

  readonly taskId: string
  readonly task: FargateTaskDefinition

  readonly container: ContainerDefinition

  readonly masterKey: string

  constructor (props: MeiliTaskStackProps) {
    const { app, storage } = props
    super({ app, stackName: 'meili-task' })

    this.masterKey = unwrapOrThrowSync(requiredEnv('MEILI_MASTER_KEY'))

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
      image: ContainerImage.fromRegistry('getmeili/meilisearch:latest'),

      logging: LogDrivers.awsLogs({
        streamPrefix: MeiliTaskStack.CONTAINER_NAME
      }),

      environment: {
        MEILI_ENV: this.envName,
        MEILI_MASTER_KEY: this.masterKey,
        MEILI_DB_PATH: MeiliTaskStack.VOLUME_PATH
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