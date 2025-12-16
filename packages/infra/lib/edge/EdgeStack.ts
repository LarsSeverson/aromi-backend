import { BaseStack } from '../../common/BaseStack.js'
import { DistributionConstruct } from './cloudfront/DistributionConstruct.js'
import { AssetsBucketConstruct } from './s3/AssetsBucketConstruct.js'
import { SpaBucketConstruct } from './s3/SpaBucketConstruct.js'
import type { EdgeStackProps } from './types.js'

export class EdgeStack extends BaseStack {
  readonly spaBucket: SpaBucketConstruct
  readonly assetsBucket: AssetsBucketConstruct

  readonly distribution: DistributionConstruct

  constructor (props: EdgeStackProps) {
    const { scope, config, certificate, webAclId } = props
    super({
      scope,
      stackName: 'edge',
      config,

      crossRegionReferences: true
    })

    this.spaBucket = new SpaBucketConstruct({
      scope: this,
      config: this.config
    })

    this.assetsBucket = new AssetsBucketConstruct({
      scope: this,
      config: this.config
    })

    this.distribution = new DistributionConstruct({
      scope: this,
      config: this.config,

      spaBucket: this.spaBucket.bucket,
      assetsBucket: this.assetsBucket.bucket,

      certifcate: certificate,
      webAclId
    })
  }
}