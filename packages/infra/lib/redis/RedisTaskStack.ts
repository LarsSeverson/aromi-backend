import { type ContainerDefinition, ContainerImage, CpuArchitecture, FargateTaskDefinition, LogDrivers } from 'aws-cdk-lib/aws-ecs'
import { InfraStack } from '../InfraStack.js'
import type { RedisTaskStackProps } from './types.js'

export class RedisTaskStack extends InfraStack {
  static readonly REDIS_REGISTRY = 'redis:latest'

  static readonly CPU = 256
  static readonly MEMORY_LIMIT_MIB = 512

  static readonly RUNTIME_PLATFORM = {
    cpuArchitecture: CpuArchitecture.X86_64
  }

  static readonly CONTAINER_NAME = 'redis'
  static readonly CONTAINER_PORT = 6379

  static readonly SERVICE_HOST = RedisTaskStack.CONTAINER_NAME
  static readonly SERVICE_PORT = RedisTaskStack.CONTAINER_PORT
  static readonly SERVICE_URL = `redis://${RedisTaskStack.SERVICE_HOST}:${RedisTaskStack.SERVICE_PORT}`

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
      image: ContainerImage.fromRegistry(RedisTaskStack.REDIS_REGISTRY),

      logging: LogDrivers.awsLogs({
        streamPrefix: RedisTaskStack.CONTAINER_NAME
      })
    })

    this.container.addPortMappings({
      containerPort: RedisTaskStack.CONTAINER_PORT
    })
  }
}