import { CfnSecurityGroupIngress, Port, PrefixList } from 'aws-cdk-lib/aws-ec2'
import { BaseStack } from '../../common/BaseStack.js'
import { AlbConstruct } from './alb/AlbConstruct.js'
import { ClusterConstruct } from './cluster/ClusterConstruct.js'
import { MeiliServiceConstruct } from './services/MeiliServiceConstruct.js'
import { RedisServiceConstruct } from './services/RedisServiceConstruct.js'
import { ServerServiceConstruct } from './services/ServerServiceConstruct.js'
import type { ApplicationStackProps } from './types.js'
import type { DataStack } from '../data/DataStack.js'
import { Protocol } from 'aws-cdk-lib/aws-ecs'

export class ApplicationStack extends BaseStack {
  readonly alb: AlbConstruct

  readonly cluster: ClusterConstruct

  readonly redisService: RedisServiceConstruct
  readonly meiliService: MeiliServiceConstruct
  readonly serverService: ServerServiceConstruct

  constructor (props: ApplicationStackProps) {
    const {
      scope, config,

      foundationStack,
      identityStack,
      dataStack
    } = props

    super({
      scope,
      stackName: 'application',
      config
    })

    this.alb = new AlbConstruct({
      scope: this,
      config,
      vpc: foundationStack.network.vpc
    })

    this.cluster = new ClusterConstruct({
      scope: this,
      config,
      vpc: foundationStack.network.vpc
    })

    this.redisService = new RedisServiceConstruct({
      scope: this,
      config,
      vpc: foundationStack.network.vpc,
      cluster: this.cluster.cluster
    })

    this.meiliService = new MeiliServiceConstruct({
      scope: this,
      config,

      vpc: foundationStack.network.vpc,

      fileSystem: dataStack.fileSystem,

      cluster: this.cluster.cluster
    })

    this.serverService = new ServerServiceConstruct({
      scope: this,
      config,

      foundationStack,
      identityStack,
      dataStack,

      alb: this.alb,
      cluster: this.cluster.cluster,
      redis: this.redisService,
      meili: this.meiliService
    })

    const namespace = this.cluster.cluster.defaultCloudMapNamespace
    if (namespace != null) {
      this.redisService.service.node.addDependency(namespace)
      this.meiliService.service.node.addDependency(namespace)
      this.serverService.service.node.addDependency(namespace)
    }

    this.allowCdnPrefixToAlb()
    this.allowAlbToServer()

    this.allowMeiliToFileSystem(dataStack)

    this.allowServerToDatabase(dataStack)
    this.allowServerToRedis()
  }

  private allowCdnPrefixToAlb () {
    const prefixListId = 'CloudFrontOriginFacing'
    const prefixListName = 'com.amazonaws.global.cloudfront.origin-facing'
    const prefixList = PrefixList.fromLookup(this, prefixListId, {
      prefixListName
    })

    this.alb.securityGroup.addIngressRule(
      prefixList,
      Port.tcp(this.alb.listenerPort)
    )
  }

  private allowAlbToServer () {
    this.serverService.securityGroup.addIngressRule(
      this.alb.securityGroup,
      Port.tcp(this.serverService.servicePort)
    )
  }

  private allowMeiliToFileSystem (dataStack: DataStack) {
    // eslint-disable-next-line no-new
    new CfnSecurityGroupIngress(this, 'AllowMeiliToFileSystem', {
      groupId: dataStack.fileSystem.securityGroup.securityGroupId,
      sourceSecurityGroupId: this.meiliService.securityGroup.securityGroupId,
      ipProtocol: Protocol.TCP,
      fromPort: dataStack.fileSystem.efsPort,
      toPort: dataStack.fileSystem.efsPort
    })
  }

  private allowServerToDatabase (dataStack: DataStack) {
    // eslint-disable-next-line no-new
    new CfnSecurityGroupIngress(this, 'AllowServerToDatabase', {
      groupId: dataStack.database.securityGroup.securityGroupId,
      sourceSecurityGroupId: this.serverService.securityGroup.securityGroupId,
      ipProtocol: Protocol.TCP,
      fromPort: dataStack.database.databasePort,
      toPort: dataStack.database.databasePort
    })
  }

  private allowServerToRedis () {
    this.redisService.securityGroup.addIngressRule(
      this.serverService.securityGroup,
      Port.tcp(this.redisService.servicePort)
    )
  }
}