import { NetworkConstruct } from './network/NetworkConstruct.js'
import { BaseStack } from '../../common/BaseStack.js'
import type { ScopedStackProps } from '../../common/types.js'
import { RepositoryConstruct } from './ecr/RepositoryConstruct.js'

export class FoundationStack extends BaseStack {
  readonly network: NetworkConstruct
  readonly ecr: RepositoryConstruct

  constructor (props: ScopedStackProps) {
    const { scope, config } = props
    super({ scope, stackName: 'foundation', config })

    this.network = new NetworkConstruct({ scope: this, config })

    this.ecr = new RepositoryConstruct({ scope: this, config })
  }
}