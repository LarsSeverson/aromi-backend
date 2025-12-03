import { type ContainerDefinition, ContainerImage, CpuArchitecture, FargateTaskDefinition, LogDrivers } from 'aws-cdk-lib/aws-ecs'
import { InfraStack } from '../InfraStack.js'
import type { RedisTaskStackProps } from './types.js'

export class RedisTaskStack extends InfraStack {
  static readonly CPU = 256
  static readonly MEMORY_LIMIT_MIB = 512

  static readonly RUNTIME_PLATFORM = {
    cpuArchitecture: CpuArchitecture.X86_64
  }

  static readonly CONTAINER_NAME = 'redis'
  static readonly CONTAINER_PORT = 6379

  readonly taskId: string
  readonly task: FargateTaskDefinition

  readonly container: ContainerDefinition

  constructor (props: RedisTaskStackProps) {
    const { app } = props
    super({ app, stackName: 'redis-task' })

    this.taskId = `${this.prefix}-redis-task`
    this.task = new FargateTaskDefinition(this, this.taskId, {
      cpu: RedisTaskStack.CPU,
      memoryLimitMiB: RedisTaskStack.MEMORY_LIMIT_MIB,

      runtimePlatform: RedisTaskStack.RUNTIME_PLATFORM
    })

    this.container = this.task.addContainer(RedisTaskStack.CONTAINER_NAME, {
      image: ContainerImage.fromRegistry('redis:latest'),

      logging: LogDrivers.awsLogs({
        streamPrefix: RedisTaskStack.CONTAINER_NAME
      })
    })

    this.container.addPortMappings({
      containerPort: RedisTaskStack.CONTAINER_PORT
    })
  }
}