import type { Bucket } from 'aws-cdk-lib/aws-s3'
import type { BaseConstructProps, ScopedStackProps } from '../../common/types.js'
import type { Certificate } from 'aws-cdk-lib/aws-certificatemanager'
import type { DataStack } from '../data/DataStack.js'
import type { ApplicationStack } from '../application/ApplicationStack.js'
import type { AlbConstruct } from '../application/alb/AlbConstruct.js'
import type { ZoneConstruct } from '../dns/zone/ZoneConstruct.js'
import type { DnsStack } from '../dns/DnsStack.js'

export interface AcmConstructProps extends BaseConstructProps {
  readonly zone: ZoneConstruct
}

export interface WebAclConstructProps extends BaseConstructProps {}

export interface DistributionConstructProps extends BaseConstructProps {
  readonly spaBucket: Bucket
  readonly assetsBucket: Bucket

  readonly certifcate: Certificate
  readonly webAclId: string

  readonly alb: AlbConstruct
}

export interface EdgeStackProps extends ScopedStackProps {
  readonly dnsStack: DnsStack
  readonly dataStack: DataStack
  readonly applicationStack: ApplicationStack
}