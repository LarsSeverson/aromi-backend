import { BaseStack } from 'packages/infra/common/BaseStack.js'
import { NetworkConstruct } from './network/NetworkConstruct.js'
import type { ScopedStackProps } from 'packages/infra/common/types.js'

export class FoundationStack extends BaseStack {
  readonly network: NetworkConstruct

  constructor (props: ScopedStackProps) {
    const { scope, config } = props
    super({ scope, stackName: 'foundation', config })

    this.network = new NetworkConstruct({ scope: this, config })
  }
}