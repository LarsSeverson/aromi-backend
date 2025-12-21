import { Construct } from 'constructs'
import type { MeiliServiceConstructProps } from '../types.js'
import { SecurityGroup, SubnetType } from 'aws-cdk-lib/aws-ec2'
import ecs, { type ContainerDefinition, ContainerImage, FargateService, FargateTaskDefinition } from 'aws-cdk-lib/aws-ecs'
import { Secret } from 'aws-cdk-lib/aws-secretsmanager'
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam'

export class MeiliServiceConstruct extends Construct {
  readonly securityGroup: SecurityGroup
  readonly securityGroupId: string

  readonly masterSecret: Secret
  readonly masterSecretId: string
  readonly masterSecretKey = 'key'

  readonly task: FargateTaskDefinition
  readonly taskId: string

  readonly container: ContainerDefinition
  readonly containerId: string

  readonly service: FargateService
  readonly serviceId: string

  readonly containerName = 'meilisearch'

  readonly serviceHost = 'meilisearch'
  readonly servicePort = 7700

  readonly externalHost = `${this.serviceHost}:${this.servicePort}`

  private readonly internalConfig = {
    security: {
      subnetType: SubnetType.PRIVATE_WITH_EGRESS,
      allowAllOutbound: true
    },

    secret: {
      passwordLength: 32
    },

    volume: {
      name: 'meili-efs',
      mountPath: '/meili_data',
      transitEncryption: 'ENABLED',
      iam: 'ENABLED',
      readonly: false
    },

    container: {
      image: ContainerImage.fromRegistry('getmeili/meilisearch:v1.28.2'),
      httpAddr: '0.0.0.0'
    }
  }

  constructor (props: MeiliServiceConstructProps) {
    const {
      scope, config,

      vpc,
      fileSystem,

      cluster
    } = props

    super(scope, `${scope.prefix}-meili-service`)

    this.securityGroupId = `${scope.prefix}-meili-service-sg`
    this.securityGroup = new SecurityGroup(this, this.securityGroupId, {
      vpc,
      securityGroupName: this.securityGroupId,
      allowAllOutbound: this.internalConfig.security.allowAllOutbound
    })

    this.masterSecretId = `${scope.prefix}-meili-master-secret`
    this.masterSecret = new Secret(this, this.masterSecretId, {
      generateSecretString: {
        secretStringTemplate: JSON.stringify({}),
        generateStringKey: this.masterSecretKey,
        passwordLength: this.internalConfig.secret.passwordLength
      }
    })

    this.taskId = `${scope.prefix}-meili-service-task`
    this.task = new FargateTaskDefinition(this, this.taskId, {
      cpu: config.meiliService.cpu,
      memoryLimitMiB: config.meiliService.memoryLimitMiB,
      runtimePlatform: config.meiliService.runtimePlatform,

      volumes: [{
        name: this.internalConfig.volume.name,
        efsVolumeConfiguration: {
          fileSystemId: fileSystem.fileSystem.fileSystemId,
          transitEncryption: this.internalConfig.volume.transitEncryption,
          authorizationConfig: {
            accessPointId: fileSystem.accessPoint.accessPointId,
            iam: this.internalConfig.volume.iam
          }
        }
      }]
    })

    this.task.addToTaskRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [fileSystem.fileSystem.fileSystemArn],
        actions: [
          'elasticfilesystem:ClientMount',
          'elasticfilesystem:ClientWrite'
        ],
        conditions: {
          StringEquals: {
            'elasticfilesystem:AccessPointArn': fileSystem.accessPoint.accessPointArn
          }
        }
      })
    )

    this.containerId = `${scope.prefix}-meili-service-container`
    this.container = this.task.addContainer(this.containerId, {
      image: this.internalConfig.container.image,
      containerName: this.containerName,

      environment: {
        MEILI_DB_PATH: this.internalConfig.volume.mountPath,
        MEILI_ENV: config.envMode,
        MEILI_HTTP_ADDR: `${this.internalConfig.container.httpAddr}:${this.servicePort}`
      },

      secrets: {
        MEILI_MASTER_KEY: ecs.Secret.fromSecretsManager(
          this.masterSecret,
          this.masterSecretKey
        )
      }
    })

    this.container.addPortMappings({
      name: this.containerName,
      containerPort: this.servicePort
    })

    this.container.addMountPoints({
      containerPath: this.internalConfig.volume.mountPath,
      sourceVolume: this.internalConfig.volume.name,
      readOnly: this.internalConfig.volume.readonly
    })

    this.serviceId = `${scope.prefix}-meili-service`
    this.service = new FargateService(this, this.serviceId, {
      cluster,
      taskDefinition: this.task,

      serviceName: `${scope.prefix}-meili`,

      desiredCount: config.meiliService.desiredCount,
      minHealthyPercent: config.meiliService.minHealthyPercent,
      maxHealthyPercent: config.meiliService.maxHealthyPercent,

      assignPublicIp: config.meiliService.assignPublicIp,

      securityGroups: [this.securityGroup],
      vpcSubnets: {
        subnetType: this.internalConfig.security.subnetType
      },

      serviceConnectConfiguration: {
        namespace: cluster.defaultCloudMapNamespace!.namespaceName,
        services: [{
          dnsName: this.serviceHost,
          discoveryName: this.serviceHost,
          portMappingName: this.containerName,

          port: this.servicePort
        }]
      }
    })
  }
}