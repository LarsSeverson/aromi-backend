import { Construct } from 'constructs'
import type { ServerServiceConstructProps } from '../types.js'
import ecs, { type ContainerDefinition, ContainerImage, FargateService, FargateTaskDefinition, ListenerConfig, LogDrivers } from 'aws-cdk-lib/aws-ecs'
import { PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam'
import { SecurityGroup, SubnetType } from 'aws-cdk-lib/aws-ec2'
import { Duration } from 'aws-cdk-lib'
import { StringParameter } from 'aws-cdk-lib/aws-ssm'

export class ServerServiceConstruct extends Construct {
  readonly tag: string

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

  readonly containerName = 'server'

  readonly serviceHost = '0.0.0.0'
  readonly servicePort = 8080

  readonly targetGroupId: string

  private readonly internalConfig = {
    role: {
      assumedBy: 'ecs-tasks.amazonaws.com',

      authActions: [
        'cognito-idp:AdminGetUser',
        'cognito-idp:AdminCreateUser',
        'cognito-idp:AdminDeleteUser',
        'cognito-idp:AdminUpdateUserAttributes',
        'cognito-idp:AdminSetUserPassword',
        'cognito-idp:ResendConfirmationCode',
        'cognito-idp:SignUp',
        'cognito-idp:ConfirmSignUp',
        'cognito-idp:InitiateAuth',
        'cognito-idp:RespondToAuthChallenge'
      ],

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

    alb: {
      healthCheck: {
        path: '/health',

        interval: Duration.seconds(60),
        timeout: Duration.seconds(15),

        healthyThresholdCount: 2,
        unhealthyThresholdCount: 5,

        port: this.servicePort.toString(),

        healthyHttpCodes: '200'
      }
    },

    logging: LogDrivers.awsLogs({
      streamPrefix: 'server'
    })
  }

  constructor (props: ServerServiceConstructProps) {
    const {
      scope, config,

      foundationStack,
      identityStack,
      dataStack,

      cluster,
      alb,
      redis,
      meili
    } = props

    super(scope, `${scope.prefix}-server-service`)

    this.tag = StringParameter.valueForStringParameter(
      this,
      `/aromi/${config.envMode}/server/tag`
    )

    this.securityGroupId = `${scope.prefix}-server-service-sg`
    this.securityGroup = new SecurityGroup(this, this.securityGroupId, {
      vpc: foundationStack.network.vpc,
      securityGroupName: this.securityGroupId,
      allowAllOutbound: this.internalConfig.security.allowAllOutbound
    })

    this.roleId = `${scope.prefix}-server-service-role`
    this.role = new Role(this, this.roleId, {
      roleName: this.roleId,
      assumedBy: new ServicePrincipal(this.internalConfig.role.assumedBy)
    })

    this.role.addToPolicy(
      new PolicyStatement({
        actions: this.internalConfig.role.authActions,
        resources: [identityStack.cognito.userPool.userPoolArn]
      })
    )

    this.role.addToPolicy(
      new PolicyStatement({
        actions: this.internalConfig.role.assetActions,
        resources: [`${dataStack.assetsBucket.bucket.bucketArn}/*`]
      })
    )

    this.taskId = `${scope.prefix}-server-service-task`
    this.task = new FargateTaskDefinition(this, this.taskId, {
      cpu: config.serverService.cpu,
      memoryLimitMiB: config.serverService.memoryLimitMiB,
      runtimePlatform: config.serverService.runtimePlatform,

      taskRole: this.role
    })

    this.containerId = `${scope.prefix}-server-service-container`
    this.container = this.task.addContainer(this.containerId, {
      image: ContainerImage.fromEcrRepository(
        foundationStack.serverEcr.repository,
        this.tag
      ),

      logging: this.internalConfig.logging,

      environment: {
        NODE_ENV: config.envMode,

        SERVER_HOST: this.serviceHost,
        SERVER_PORT: this.servicePort.toString(),
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

        MEILI_HOST: meili.serviceHost,

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

    this.container.addPortMappings({
      name: this.containerName,
      containerPort: this.servicePort
    })

    this.serviceId = `${scope.prefix}-server-service`
    this.service = new FargateService(this, this.serviceId, {
      cluster,
      taskDefinition: this.task,

      serviceName: `${scope.prefix}-server`,

      desiredCount: config.serverService.desiredCount,
      minHealthyPercent: config.serverService.minHealthyPercent,
      maxHealthyPercent: config.serverService.maxHealthyPercent,

      assignPublicIp: config.serverService.assignPublicIp,

      securityGroups: [this.securityGroup],
      vpcSubnets: {
        subnetType: this.internalConfig.security.subnetType
      },

      serviceConnectConfiguration: {
        namespace: cluster.defaultCloudMapNamespace!.namespaceName
      }
    })

    this.targetGroupId = `${scope.prefix}-server-target-group`
    this.service.registerLoadBalancerTargets({
      containerName: this.container.containerName,
      containerPort: this.container.containerPort,

      newTargetGroupId: this.targetGroupId,

      listener: ListenerConfig.applicationListener(
        alb.listener,
        {
          protocol: alb.listenerProtocol,
          healthCheck: this.internalConfig.alb.healthCheck
        }
      )
    })
  }
}