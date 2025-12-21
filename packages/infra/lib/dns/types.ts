import type { BaseConstructProps, ScopedStackProps } from '../../common/types.js'
import type { ZoneConstruct } from './zone/ZoneConstruct.js'

export interface ZoneConstructProps extends BaseConstructProps {}

export interface EmailConstructProps extends BaseConstructProps {
  readonly zone: ZoneConstruct
}

export interface DnsStackProps extends ScopedStackProps {}
