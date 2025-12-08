import { CpuArchitecture } from 'aws-cdk-lib/aws-ecs'
import { BaseConfig } from '../../BaseConfig.js'
import { SubnetType } from 'aws-cdk-lib/aws-ec2'
import { Duration } from 'aws-cdk-lib'

export class RedisConfig extends BaseConfig {
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
    containerPort: 6379
  }

  static readonly SERVICE_CONFIG = {
    desiredCount: 1,
    minHealthPercent: 100,
    maxHealthPercent: 200,

    assignPublicIp: false,
    allowAllOutbound: true,

    subnetType: SubnetType.PRIVATE_WITH_EGRESS,

    cloudMapName: 'redis',
    cloudMapDnsTtl: Duration.seconds(10)
  }
}