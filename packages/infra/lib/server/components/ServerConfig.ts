import { TagMutability, TagStatus } from 'aws-cdk-lib/aws-ecr'
import { BaseConfig } from '../../BaseConfig.js'
import { CpuArchitecture, LogDrivers } from 'aws-cdk-lib/aws-ecs'
import { SubnetType } from 'aws-cdk-lib/aws-ec2'

export class ServerConfig extends BaseConfig {
  static readonly ECR_CONFIG = {
    imageScanOnPush: true,
    imageTagMutability: TagMutability.IMMUTABLE,
    liceCycleRules: [{
      tagStatus: TagStatus.UNTAGGED,
      maxImageCount: 10
    }]
  }

  static readonly IAM_CONFIG = {
    principleService: 'ecs-tasks.amazonaws.com',

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

    storageActions: ['S3:GetObject', 'S3:PutObject', 'S3:DeleteObject']
  }

  static readonly TASK_CONFIG = {
    cpu: 1024,
    memoryLimitMiB: 2048,
    runtimePlatform: {
      cpuArchitecture: CpuArchitecture.X86_64
    }
  }

  static readonly CONTAINER_CONFIG = {
    containerName: 'server',
    containerHost: '0.0.0.0',
    containerPort: 8080,

    logging: LogDrivers.awsLogs({
      streamPrefix: 'server'
    })
  }

  static readonly SERVICE_CONFIG = {
    desiredCount: 1,
    minHealthyPercent: 100,
    maxHealthyPercent: 200,

    assignPublicIp: false,
    allowAllOutbound: true,

    subnetType: SubnetType.PRIVATE_WITH_EGRESS
  }
}