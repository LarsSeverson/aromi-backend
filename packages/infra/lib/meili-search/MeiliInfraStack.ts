import { BaseStack } from '../BaseStack.js'
import type { MeiliInfraStackProps } from './types.js'
import { MeiliEFSComponent } from './components/MeiliEFS.js'

export class MeiliInfraStack extends BaseStack {
  efsComponent: MeiliEFSComponent

  constructor (props: MeiliInfraStackProps) {
    const { app, network } = props
    super({ app, stackName: 'meili-infra' })

    this.efsComponent = new MeiliEFSComponent({ stack: this, network })
  }
}
