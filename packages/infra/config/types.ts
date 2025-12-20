import type { Port, SubnetConfiguration } from 'aws-cdk-lib/aws-ec2'
import type { EnvMode } from '../common/types.js'
import type { IClusterEngine } from 'aws-cdk-lib/aws-rds'
import type { RemovalPolicy } from 'aws-cdk-lib'
import type { LifecyclePolicy, PerformanceMode, ThroughputMode } from 'aws-cdk-lib/aws-efs'
import type { BlockPublicAccess, BucketEncryption, LifecycleRule, ObjectOwnership } from 'aws-cdk-lib/aws-s3'
import type { CloudMapNamespaceOptions, RuntimePlatform } from 'aws-cdk-lib/aws-ecs'
import type { AccountRecovery, Mfa, PasswordPolicy, SignInAliases } from 'aws-cdk-lib/aws-cognito'

export interface EnvConfig {
  readonly appName: string
  readonly appDomain: string

  readonly envMode: EnvMode

  readonly aws: {
    readonly account?: string
    readonly region?: string
  }

  readonly network: NetworkConfig

  readonly cognito: CognitoConfig

  readonly database: DatabaseConfig
  readonly fileSystem: FileSystemConfig

  readonly assetsBucket: BucketConfig
  readonly spaBucket: BucketConfig

  readonly cluster: ClusterConfig
  readonly redisService: ServiceConfig
  readonly meiliService: ServiceConfig
  readonly serverService: ServiceConfig
  readonly workersService: ServiceConfig

  readonly acm: AcmConfig
  readonly webAcl: WebAclConfig
  readonly distribution: DistributionConfig

  readonly dns: DnsConfig
}

export type BaseConfig = Omit<EnvConfig, 'envMode' | 'aws'>

export interface NetworkConfig {
  readonly maxAzs: number
  readonly natGateways: number
  readonly subnetConfiguration: SubnetConfiguration[]
}

export interface DatabaseConfig {
  readonly databaseName: string

  readonly engine: IClusterEngine

  readonly minCapacity: number
  readonly maxCapacity: number

  readonly removalPolicy: RemovalPolicy
}

export interface FileSystemConfig {
  readonly performanceMode: PerformanceMode
  readonly throughputMode: ThroughputMode

  readonly lifecyclePolicy: LifecyclePolicy
  readonly removalPolicy: RemovalPolicy

  readonly efsPath: string
  readonly posixUid: string
  readonly posixGid: string
  readonly posixPerms: string

  readonly port: Port
}

export interface BucketConfig {
  readonly versioned: boolean
  readonly encryption: BucketEncryption

  readonly blockPublicAccess: BlockPublicAccess
  readonly objectOwnership: ObjectOwnership

  readonly lifecycleRules: LifecycleRule[]

  readonly removalPolicy: RemovalPolicy
}

export interface AcmConfig {
  readonly subjectAlternativeNames: string[]
}

export interface WebAclConfig {
  readonly enabled: boolean
  readonly rateLimit: number
}

export interface DistributionConfig {
  readonly domainNames: string[]
}

export interface CognitoConfig {
  readonly signInAliases: SignInAliases

  readonly selfSignUpEnabled: boolean

  readonly mfa: Mfa

  readonly accountRecovery: AccountRecovery

  readonly passwordPolicy: PasswordPolicy
  readonly removalPolicy: RemovalPolicy
}

export interface ClusterConfig {
  readonly enableFargateCapacityProviders: boolean
  readonly defaultCloudMapNamespace: CloudMapNamespaceOptions
}

export interface ServiceConfig {
  readonly desiredCount: number

  readonly cpu: number
  readonly memoryLimitMiB: number
  readonly runtimePlatform: RuntimePlatform

  readonly minHealthyPercent: number
  readonly maxHealthyPercent: number

  readonly assignPublicIp: boolean
}

export interface DnsConfig {
  readonly zoneName: string
}