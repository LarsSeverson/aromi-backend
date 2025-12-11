import ecs, { type ContainerDefinition, ContainerImage, FargateTaskDefinition } from 'aws-cdk-lib/aws-ecs'
import { Secret } from 'aws-cdk-lib/aws-secretsmanager'
import type { MeiliTaskComponentProps } from '../types.js'
import { MeiliConfig } from './MeiliConfig.js'
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam'

export class MeiliTaskComponent {
  readonly masterSecretKey = MeiliConfig.TASK_CONFIG.secretKeyField
  readonly masterSecretId: string
  readonly masterSecret: Secret

  readonly taskId: string
  readonly task: FargateTaskDefinition

  readonly containerId: string
  readonly container: ContainerDefinition

  constructor (props: MeiliTaskComponentProps) {
    const { stack, efsComponent } = props

    this.masterSecretId = `${MeiliConfig.prefix}-meili-master-secret`
    this.masterSecret = new Secret(stack, this.masterSecretId, {
      generateSecretString: {
        secretStringTemplate: JSON.stringify({}),
        generateStringKey: MeiliConfig.TASK_CONFIG.secretKeyField,
        passwordLength: MeiliConfig.TASK_CONFIG.secretLength
      }
    })

    this.taskId = `${MeiliConfig.prefix}-meili-task`
    this.task = new FargateTaskDefinition(stack, this.taskId, {
      cpu: MeiliConfig.TASK_CONFIG.cpuUnits,
      memoryLimitMiB: MeiliConfig.TASK_CONFIG.memoryMiB,
      runtimePlatform: MeiliConfig.TASK_CONFIG.runtimePlatform,

      volumes: [
        {
          name: MeiliConfig.meiliVolume,
          efsVolumeConfiguration: {
            fileSystemId: efsComponent.efs.fileSystemId,
            transitEncryption: 'ENABLED',
            authorizationConfig: {
              accessPointId: efsComponent.accessPoint.accessPointId,
              iam: 'ENABLED'
            }
          }
        }
      ]
    })

    this.containerId = `${MeiliConfig.prefix}-meili-container`
    this.container = this.task.addContainer(this.containerId, {
      image: ContainerImage.fromRegistry(MeiliConfig.CONTAINER_CONFIG.image),
      containerName: MeiliConfig.CONTAINER_CONFIG.containerName,

      environment: {
        MEILI_DB_PATH: MeiliConfig.meiliMount,
        MEILI_ENV: MeiliConfig.envMode
      },

      secrets: {
        MEILI_MASTER_KEY: ecs.Secret.fromSecretsManager(
          this.masterSecret,
          MeiliConfig.TASK_CONFIG.secretKeyField
        )
      }
    })

    this.container.addPortMappings({
      name: MeiliConfig.CONTAINER_CONFIG.containerName,
      containerPort: MeiliConfig.CONTAINER_CONFIG.containerPort
    })

    this.container.addMountPoints({
      containerPath: MeiliConfig.meiliMount,
      sourceVolume: MeiliConfig.meiliVolume,
      readOnly: false
    })

    this.task.addToTaskRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [efsComponent.efs.fileSystemArn],
        actions: ['elasticfilesystem:ClientMount', 'elasticfilesystem:ClientWrite'],
        conditions: {
          StringEquals: {
            'elasticfilesystem:AccessPointArn': efsComponent.accessPoint.accessPointArn
          }
        }
      })
    )
  }
}