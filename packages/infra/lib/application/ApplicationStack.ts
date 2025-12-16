import { BaseStack } from '../../common/BaseStack.js'
import { AlbConstruct } from './alb/AlbConstruct.js'
import { ClusterConstruct } from './cluster/ClusterConstruct.js'
import { CognitoConstruct } from './cognito/CognitoConstruct.js'
import { RepositoryConstruct } from './ecr/RepositoryConstruct.js'
import { MeiliServiceConstruct } from './services/MeiliServiceConstruct.js'
import { RedisServiceConstruct } from './services/RedisServiceConstruct.js'
import { ServerServiceConstruct } from './services/ServerServiceConstruct.js'
import type { ApplicationStackProps } from './types.js'

export class ApplicationStack extends BaseStack {
  readonly cognito: CognitoConstruct
  readonly repository: RepositoryConstruct
  readonly alb: AlbConstruct

  readonly cluster: ClusterConstruct

  readonly redisService: RedisServiceConstruct
  readonly meiliService: MeiliServiceConstruct
  readonly serverService: ServerServiceConstruct

  constructor (props: ApplicationStackProps) {
    const {
      scope, config,

      vpc,

      fileSystem,
      database,

      distribution,
      assets
    } = props

    super({
      scope,
      stackName: 'application',
      config
    })

    this.cognito = new CognitoConstruct({
      scope: this,
      config
    })

    this.repository = new RepositoryConstruct({
      scope: this,
      config
    })

    this.alb = new AlbConstruct({
      scope: this,
      config,
      vpc
    })

    this.cluster = new ClusterConstruct({
      scope: this,
      config,
      vpc
    })

    this.redisService = new RedisServiceConstruct({
      scope: this,
      config,
      vpc,
      cluster: this.cluster.cluster
    })

    this.meiliService = new MeiliServiceConstruct({
      scope: this,
      config,
      vpc,

      fileSystem,

      cluster: this.cluster.cluster
    })

    this.serverService = new ServerServiceConstruct({
      scope: this,
      config,
      vpc,

      database,

      assets,

      cognito: this.cognito,
      repository: this.repository,
      alb: this.alb,
      cluster: this.cluster.cluster,
      redis: this.redisService,
      meili: this.meiliService
    })
  }
}