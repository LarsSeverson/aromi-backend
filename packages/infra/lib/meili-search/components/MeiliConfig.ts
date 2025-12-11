import { CpuArchitecture, OperatingSystemFamily } from 'aws-cdk-lib/aws-ecs'
import { BaseConfig } from '../../BaseConfig.js'
import { SubnetType } from 'aws-cdk-lib/aws-ec2'
import { Duration } from 'aws-cdk-lib'

export class MeiliConfig extends BaseConfig {
  static readonly meiliVolume = 'meili-efs'
  static readonly meiliMount = '/meili_data'

  static readonly EFS_CONFIG = {
    efsPath: '/data',
    posixUid: '1000',
    posixGid: '1000',
    posixPerms: '755'
  }

  static readonly TASK_CONFIG = {
    cpuUnits: 512,
    memoryMiB: 1024,
    runtimePlatform: {
      cpuArchitecture: CpuArchitecture.ARM64,
      operatingSystemFamily: OperatingSystemFamily.LINUX
    },

    secretKeyField: 'key',
    secretLength: 32
  }

  static readonly CONTAINER_CONFIG = {
    image: 'getmeili/meilisearch:v1.28.2',
    containerName: 'meilisearch',
    containerPort: 7700
  }

  static readonly SERVICE_CONFIG = {
    desiredCount: 1,
    minHealthPercent: 100,
    maxHealthPercent: 200,

    assignPublicIp: false,
    allowAllOutbound: true,

    subnetType: SubnetType.PRIVATE_WITH_EGRESS,

    cloudMapName: 'meilisearch',
    cloudMapDnsTtl: Duration.seconds(10)
  }
}
