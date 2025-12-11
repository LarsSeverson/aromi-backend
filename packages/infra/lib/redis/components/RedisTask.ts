import { type ContainerDefinition, ContainerImage, FargateTaskDefinition } from 'aws-cdk-lib/aws-ecs'
import type { RedisTaskComponentProps } from '../types.js'
import { RedisConfig } from './RedisConfig.js'

export class RedisTaskComponent {
  readonly taskId: string
  readonly task: FargateTaskDefinition

  readonly containerId: string
  readonly container: ContainerDefinition

  constructor (props: RedisTaskComponentProps) {
    const { stack } = props

    this.taskId = `${stack.prefix}-redis-task`
    this.task = new FargateTaskDefinition(stack, this.taskId, {
      cpu: RedisConfig.TASK_CONFIG.cpuUnits,
      memoryLimitMiB: RedisConfig.TASK_CONFIG.memoryMiB,
      runtimePlatform: RedisConfig.TASK_CONFIG.runtimePlatform
    })

    this.containerId = `${stack.prefix}-redis-container`
    this.container = this.task.addContainer(this.containerId, {
      image: ContainerImage.fromRegistry(RedisConfig.CONTAINER_CONFIG.image),
      containerName: RedisConfig.CONTAINER_CONFIG.containerName
    })

    this.container.addPortMappings({
      name: RedisConfig.CONTAINER_CONFIG.containerName,
      containerPort: RedisConfig.CONTAINER_CONFIG.containerPort
    })
  }
}