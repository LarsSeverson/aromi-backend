import { NetworkConstruct } from './network/NetworkConstruct.js'
import { BaseStack } from '../../common/BaseStack.js'
import type { ScopedStackProps } from '../../common/types.js'
import { ServerRepoConstruct } from './ecr/ServerRepoConstruct.js'
import { WorkersRepoConstruct } from './ecr/WorkersRepoConstruct.js'

export class FoundationStack extends BaseStack {
  readonly network: NetworkConstruct

  readonly serverEcr: ServerRepoConstruct
  readonly workersEcr: WorkersRepoConstruct

  constructor (props: ScopedStackProps) {
    const { scope, config } = props
    super({ scope, stackName: 'foundation', config })

    this.network = new NetworkConstruct({ scope: this, config })

    this.serverEcr = new ServerRepoConstruct({ scope: this, config })
    this.workersEcr = new WorkersRepoConstruct({ scope: this, config })
  }
}