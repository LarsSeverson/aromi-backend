import { BaseStack } from '../BaseStack.js'
import { ServerECRComponent } from './components/ServerECR.js'
import type { ECRStackProps } from './types.js'

export class ECRStack extends BaseStack {
  readonly serverECRComponent: ServerECRComponent
  constructor (props: ECRStackProps) {
    const { app } = props
    super({ app, stackName: 'ecr' })

    this.serverECRComponent = new ServerECRComponent({
      stack: this
    })
  }
}