import { BaseStack } from '../../common/BaseStack.js'
import { AcmConstruct } from './certificates/AcmConstruct.js'
import type { EdgeGlobalStackProps } from './types.js'
import { WebAclConstruct } from './waf/WebAclConstruct.js'

export class EdgeGlobalStack extends BaseStack {
  readonly acm: AcmConstruct
  readonly acl: WebAclConstruct

  constructor (props: EdgeGlobalStackProps) {
    const { scope, config } = props
    super({
      scope,
      stackName: 'edge-global',
      config,

      env: { region: 'us-east-1' }
    })

    this.acm = new AcmConstruct({
      scope: this,
      config: this.config
    })

    this.acl = new WebAclConstruct({
      scope: this,
      config: this.config
    })
  }
}