import { CpuArchitecture } from 'aws-cdk-lib/aws-ecs'
import { InfraConfig } from '../../InfraConfig.js'
import { SubnetType } from 'aws-cdk-lib/aws-ec2'

export class MeiliConfig extends InfraConfig {
  static readonly meiliVolume = 'meili-efs'
  static readonly meiliMount = '/meili_data'

  static readonly EFS_CONFIG = {
    efsPath: '/data',
    posixUid: '1000',
    posixGid: '1000',
    posixPerms: '755'
  }

  static readonly TASK_CONFIG = {
    cpuUnits: 1024,
    memoryMiB: 2048,
    runtimePlatform: {
      cpuArchitecture: CpuArchitecture.X86_64
    },

    secretKeyField: 'key',
    secretLength: 32
  }

  static readonly CONTAINER_CONFIG = {
    image: 'getmeili/meilisearch:latest',
    containerName: 'meilisearch',
    port: 7700
  }

  static readonly SERVICE_CONFIG = {
    desiredCount: 1,
    minHealthPercent: 100,
    maxHealthPercent: 200,

    assignPublicIp: false,

    subnetType: SubnetType.PRIVATE_WITH_EGRESS
  }
}
