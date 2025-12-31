import { Construct } from 'constructs'
import type { WorkersServiceConstructProps } from '../types.js'
import ecs, { type ContainerDefinition, ContainerImage, FargateService, FargateTaskDefinition, LogDrivers } from 'aws-cdk-lib/aws-ecs'
import { PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam'
import { SecurityGroup, SubnetType } from 'aws-cdk-lib/aws-ec2'
import { StringParameter } from 'aws-cdk-lib/aws-ssm'
import { LogGroup, LogGroupClass, RetentionDays } from 'aws-cdk-lib/aws-logs'
import { RemovalPolicy } from 'aws-cdk-lib'

export class WorkersServiceConstruct extends Construct {
  readonly tag: string

  readonly logGroup: LogGroup

  readonly securityGroup: SecurityGroup
  readonly securityGroupId: string

  readonly role: Role
  readonly roleId: string

  readonly task: FargateTaskDefinition
  readonly taskId: string

  readonly container: ContainerDefinition
  readonly containerId: string

  readonly service: FargateService
  readonly serviceId: string

  readonly containerName = 'workers'

  private readonly internalConfig = {
    role: {
      assumedBy: 'ecs-tasks.amazonaws.com',

      assetActions: [
        'S3:GetObject',
        'S3:PutObject',
        'S3:DeleteObject'
      ]
    },

    security: {
      allowAllOutbound: true,
      subnetType: SubnetType.PRIVATE_WITH_EGRESS
    },

    logging: {
      retention: RetentionDays.ONE_WEEK,
      logGroupClass: LogGroupClass.INFREQUENT_ACCESS,
      removalPolicy: RemovalPolicy.DESTROY
    }
  }

  constructor (props: WorkersServiceConstructProps) {
    const {
      scope, config,

      foundationStack,
      identityStack,
      dataStack,

      cluster,
      redis,
      meili
    } = props

    super(scope, `${scope.prefix}-workers-service`)

    this.tag = StringParameter.valueForStringParameter(
      this,
      `/aromi/${config.envMode}/workers/tag`
    )

    this.logGroup = new LogGroup(this, `${scope.prefix}-workers-service-log-group`, {
      logGroupName: `/aromi/${config.envMode}/workers-service`,
      retention: this.internalConfig.logging.retention,
      removalPolicy: this.internalConfig.logging.removalPolicy,
      logGroupClass: this.internalConfig.logging.logGroupClass
    })

    this.securityGroupId = `${scope.prefix}-workers-service-sg`
    this.securityGroup = new SecurityGroup(this, this.securityGroupId, {
      vpc: foundationStack.network.vpc,
      securityGroupName: this.securityGroupId,
      allowAllOutbound: this.internalConfig.security.allowAllOutbound
    })

    this.roleId = `${scope.prefix}-workers-service-role`
    this.role = new Role(this, this.roleId, {
      roleName: this.roleId,
      assumedBy: new ServicePrincipal(this.internalConfig.role.assumedBy)
    })

    this.role.addToPolicy(
      new PolicyStatement({
        actions: this.internalConfig.role.assetActions,
        resources: [`${dataStack.assetsBucket.bucket.bucketArn}/*`]
      })
    )

    this.taskId = `${scope.prefix}-workers-service-task`
    this.task = new FargateTaskDefinition(this, this.taskId, {
      cpu: config.workersService.cpu,
      memoryLimitMiB: config.workersService.memoryLimitMiB,
      runtimePlatform: config.workersService.runtimePlatform,

      taskRole: this.role
    })

    this.containerId = `${scope.prefix}-workers-service-container`
    this.container = this.task.addContainer(this.containerId, {
      image: ContainerImage.fromEcrRepository(
        foundationStack.workersEcr.repository,
        this.tag
      ),

      logging: LogDrivers.awsLogs({
        logGroup: this.logGroup,
        streamPrefix: this.containerName
      }),

      environment: {
        NODE_ENV: config.envMode,

        ALLOWED_ORIGINS: [`https://${config.appDomain}`, 'https://studio.apollographql.com'].join(','),

        COGNITO_USER_POOL_ID: identityStack.cognito.userPool.userPoolId,
        COGNITO_CLIENT_ID: identityStack.cognito.userPoolClient.userPoolClientId,
        COGNITO_JWKS_URI: identityStack.cognito.jwksUri,

        S3_BUCKET: dataStack.assetsBucket.bucket.bucketName,

        DB_HOST: dataStack.database.cluster.clusterEndpoint.hostname,
        DB_USER: dataStack.database.dbSecret.secretValueFromJson(dataStack.database.dbSecretUsernameKey).unsafeUnwrap(),
        DB_NAME: dataStack.database.databaseName,
        DB_PORT: dataStack.database.databasePort.toString(),
        DB_URL: dataStack.database.databaseUrl,

        REDIS_HOST: redis.serviceHost,
        REDIS_PORT: redis.servicePort.toString(),

        MEILI_HOST: meili.externalHost,

        CDN_DOMAIN: `https://${config.appDomain}/assets`
      },

      secrets: {
        DB_PASSWORD: ecs.Secret.fromSecretsManager(
          dataStack.database.dbSecret,
          dataStack.database.dbSecretPasswordKey
        ),

        MEILI_MASTER_KEY: ecs.Secret.fromSecretsManager(
          meili.masterSecret,
          meili.masterSecretKey
        )
      }
    })

    this.serviceId = `${scope.prefix}-workers-service`
    this.service = new FargateService(this, this.serviceId, {
      cluster,
      taskDefinition: this.task,

      serviceName: `${scope.prefix}-workers`,

      desiredCount: config.workersService.desiredCount,
      minHealthyPercent: config.workersService.minHealthyPercent,
      maxHealthyPercent: config.workersService.maxHealthyPercent,

      assignPublicIp: config.workersService.assignPublicIp,

      securityGroups: [this.securityGroup],
      vpcSubnets: {
        subnetType: this.internalConfig.security.subnetType
      },

      serviceConnectConfiguration: {
        namespace: cluster.defaultCloudMapNamespace!.namespaceName
      }
    })
  }
}