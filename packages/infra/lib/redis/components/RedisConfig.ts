import { CpuArchitecture } from 'aws-cdk-lib/aws-ecs'
import { InfraConfig } from '../../InfraConfig.js'
import { SubnetType } from 'aws-cdk-lib/aws-ec2'

export class RedisConfig extends InfraConfig {
  static readonly TASK_CONFIG = {
    cpuUnits: 512,
    memoryMiB: 1024,
    runtimePlatform: {
      cpuArchitecture: CpuArchitecture.X86_64
    }
  }

  static readonly CONTAINER_CONFIG = {
    image: 'redis:latest',
    containerName: 'redis',
    port: 6379
  }

  static readonly SERVICE_CONFIG = {
    desiredCount: 1,
    minHealthPercent: 100,
    maxHealthPercent: 200,

    assignPublicIp: false,

    subnetType: SubnetType.PRIVATE_WITH_EGRESS
  }
}