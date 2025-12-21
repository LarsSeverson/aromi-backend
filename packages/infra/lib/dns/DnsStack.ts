import { BaseStack } from '../../common/BaseStack.js'
import { EmailConstruct } from './ses/EmailConstruct.js'
import type { DnsStackProps } from './types.js'
import { ZoneConstruct } from './zone/ZoneConstruct.js'

export class DnsStack extends BaseStack {
  readonly zone: ZoneConstruct
  readonly email: EmailConstruct

  constructor (props: DnsStackProps) {
    const { scope, config } = props

    super({
      scope,
      stackName: 'dns',
      config,

      crossRegionReferences: true,
      env: { region: 'us-east-1' }
    })

    this.zone = new ZoneConstruct({
      scope: this,
      config
    })

    this.email = new EmailConstruct({
      scope: this,
      config,
      zone: this.zone
    })
  }
}