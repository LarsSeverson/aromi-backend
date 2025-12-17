import { BaseStack } from '../../common/BaseStack.js'
import { CognitoConstruct } from './cognito/CognitoConstruct.js'
import type { IdentityStackProps } from './types.js'

export class IdentityStack extends BaseStack {
  cognito: CognitoConstruct

  constructor (props: IdentityStackProps) {
    const { scope, config } = props

    super({
      scope,
      stackName: 'identity',
      config
    })

    this.cognito = new CognitoConstruct({
      scope: this,
      config
    })
  }
}