import { Construct } from 'constructs'
import type { ServerServiceConstructProps } from '../types.js'
import ecs, { type ContainerDefinition, ContainerImage, FargateService, FargateTaskDefinition, ListenerConfig } from 'aws-cdk-lib/aws-ecs'
import { PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam'
import { SecurityGroup, SubnetType } from 'aws-cdk-lib/aws-ec2'
import { Duration } from 'aws-cdk-lib'

export class ServerServiceConstruct extends Construct {
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

  readonly serviceHost = 'server'
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
    }
  }

  constructor (props: ServerServiceConstructProps) {
    const {
      scope, config,

      vpc,

      database,

      assets,

      cluster,
      cognito,
      repository,
      alb,
      redis,
      meili
    } = props

    super(scope, `${scope.prefix}-server-service`)

    this.securityGroupId = `${scope.prefix}-server-service-sg`
    this.securityGroup = new SecurityGroup(this, this.securityGroupId, {
      vpc,
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
        resources: [cognito.userPool.userPoolArn]
      })
    )

    this.role.addToPolicy(
      new PolicyStatement({
        actions: this.internalConfig.role.assetActions,
        resources: [`${assets.bucket.bucketArn}/*`]
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
      image: ContainerImage.fromEcrRepository(repository.serverRepository),

      environment: {
        NODE_ENV: config.envMode,

        SERVER_HOST: this.serviceHost,
        SERVER_PORT: this.servicePort.toString(),
        ALLOWED_ORIGINS: [`https://${config.appDomain}`, 'https://studio.apollographql.com'].join(','),

        COGNITO_USER_POOL_ID: cognito.userPool.userPoolId,
        COGNITO_CLIENT_ID: cognito.userPoolClient.userPoolClientId,
        COGNITO_JWKS_URI: cognito.jwksUri,

        S3_BUCKET: assets.bucket.bucketName,

        DB_HOST: database.cluster.clusterEndpoint.hostname,
        DB_USER: database.dbSecret.secretValueFromJson(database.dbSecretUsernameKey).unsafeUnwrap(),
        DB_NAME: database.databaseName,
        DB_PORT: database.databasePort.toString(),
        DB_URL: database.databaseUrl,

        REDIS_HOST: redis.serviceHost,
        REDIS_PORT: redis.servicePort.toString(),

        MEILI_HOST: meili.serviceHost,

        CDN_DOMAIN: `https://${config.appDomain}`
      },

      secrets: {
        DB_PASSWORD: ecs.Secret.fromSecretsManager(
          database.dbSecret,
          database.dbSecretPasswordKey
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