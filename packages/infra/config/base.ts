import { Port, SubnetType } from 'aws-cdk-lib/aws-ec2'
import type { BaseConfig } from './types.js'
import { AuroraCapacityUnit, AuroraPostgresEngineVersion, DatabaseClusterEngine } from 'aws-cdk-lib/aws-rds'
import { Duration, RemovalPolicy } from 'aws-cdk-lib'
import { LifecyclePolicy, PerformanceMode, ThroughputMode } from 'aws-cdk-lib/aws-efs'
import { BlockPublicAccess, BucketEncryption, ObjectOwnership, StorageClass } from 'aws-cdk-lib/aws-s3'
import { CpuArchitecture, OperatingSystemFamily } from 'aws-cdk-lib/aws-ecs'
import { AccountRecovery, Mfa } from 'aws-cdk-lib/aws-cognito'
import { NamespaceType } from 'aws-cdk-lib/aws-servicediscovery'

export const baseConfig: BaseConfig = {
  appName: 'aromi',
  appDomain: 'aromi.net',

  network: {
    maxAzs: 2,
    natGateways: 1,
    subnetConfiguration: [
      {
        name: 'public',
        subnetType: SubnetType.PUBLIC,
        cidrMask: 24
      },

      {
        name: 'private',
        subnetType: SubnetType.PRIVATE_WITH_EGRESS,
        cidrMask: 24
      }
    ]
  },

  cognito: {
    signInAliases: {
      email: true,
      username: false,
      phone: false
    },

    selfSignUpEnabled: true,

    mfa: Mfa.OFF,

    accountRecovery: AccountRecovery.EMAIL_AND_PHONE_WITHOUT_MFA,

    passwordPolicy: {
      minLength: 8,
      requireDigits: false,
      requireLowercase: false,
      requireUppercase: false,
      requireSymbols: false,
      tempPasswordValidity: Duration.days(7)
    },
    removalPolicy: RemovalPolicy.RETAIN
  },

  ecr: {
    serverTag: 'latest',
    workersTag: 'latest'
  },

  database: {
    databaseName: 'aromi',

    engine: DatabaseClusterEngine.auroraPostgres({
      version: AuroraPostgresEngineVersion.VER_17_6
    }),

    minCapacity: 0,
    maxCapacity: AuroraCapacityUnit.ACU_2,

    removalPolicy: RemovalPolicy.SNAPSHOT
  },

  fileSystem: {
    performanceMode: PerformanceMode.GENERAL_PURPOSE,
    throughputMode: ThroughputMode.BURSTING,

    lifecyclePolicy: LifecyclePolicy.AFTER_14_DAYS,
    removalPolicy: RemovalPolicy.RETAIN,

    efsPath: '/data',
    posixUid: '1000',
    posixGid: '1000',
    posixPerms: '755',

    port: Port.tcp(2049)
  },

  assetsBucket: {
    versioned: true,
    encryption: BucketEncryption.S3_MANAGED,

    blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
    objectOwnership: ObjectOwnership.BUCKET_OWNER_ENFORCED,

    lifecycleRules: [
      {
        enabled: true,
        transitions: [{
          storageClass: StorageClass.INTELLIGENT_TIERING,
          transitionAfter: Duration.days(0)
        }]
      }
    ],

    removalPolicy: RemovalPolicy.RETAIN
  },

  spaBucket: {
    versioned: true,
    encryption: BucketEncryption.S3_MANAGED,

    blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
    objectOwnership: ObjectOwnership.BUCKET_OWNER_ENFORCED,

    lifecycleRules: [
      {
        enabled: true,
        transitions: [{
          storageClass: StorageClass.INTELLIGENT_TIERING,
          transitionAfter: Duration.days(0)
        }]
      }
    ],

    removalPolicy: RemovalPolicy.RETAIN
  },

  cluster: {
    enableFargateCapacityProviders: true,
    defaultCloudMapNamespace: {
      name: 'local',
      type: NamespaceType.DNS_PRIVATE
    }
  },

  redisService: {
    desiredCount: 1,

    cpu: 256,
    memoryLimitMiB: 512,
    runtimePlatform: {
      cpuArchitecture: CpuArchitecture.ARM64,
      operatingSystemFamily: OperatingSystemFamily.LINUX
    },

    minHealthyPercent: 100,
    maxHealthyPercent: 200,

    assignPublicIp: false
  },

  meiliService: {
    desiredCount: 1,

    cpu: 512,
    memoryLimitMiB: 1024,
    runtimePlatform: {
      cpuArchitecture: CpuArchitecture.ARM64,
      operatingSystemFamily: OperatingSystemFamily.LINUX
    },

    minHealthyPercent: 100,
    maxHealthyPercent: 200,

    assignPublicIp: false
  },

  serverService: {
    desiredCount: 1,

    cpu: 1024,
    memoryLimitMiB: 2048,
    runtimePlatform: {
      cpuArchitecture: CpuArchitecture.ARM64,
      operatingSystemFamily: OperatingSystemFamily.LINUX
    },

    minHealthyPercent: 100,
    maxHealthyPercent: 200,

    assignPublicIp: false
  },

  workersService: {
    desiredCount: 1,

    cpu: 512,
    memoryLimitMiB: 1024,
    runtimePlatform: {
      cpuArchitecture: CpuArchitecture.ARM64,
      operatingSystemFamily: OperatingSystemFamily.LINUX
    },

    minHealthyPercent: 100,
    maxHealthyPercent: 200,

    assignPublicIp: false
  },

  acm: {
    subjectAlternativeNames: ['www.aromi.net']
  },

  webAcl: {
    enabled: true,
    rateLimit: 2000
  },

  distribution: {
    domainNames: ['aromi.net', 'www.aromi.net']
  },

  dns: {
    zoneName: 'aromi.net'
  }
}