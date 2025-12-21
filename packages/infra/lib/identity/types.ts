import type { BaseConstructProps, ScopedStackProps } from '../../common/types.js'
import type { DnsStack } from '../dns/DnsStack.js'

export interface CognitoConstructProps extends BaseConstructProps {
  readonly dnsStack: DnsStack
}

export interface IdentityStackProps extends ScopedStackProps {
  readonly dnsStack: DnsStack
}