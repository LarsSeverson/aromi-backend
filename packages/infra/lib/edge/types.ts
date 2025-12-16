import type { Bucket } from 'aws-cdk-lib/aws-s3'
import type { BaseConstructProps, ScopedStackProps } from '../../common/types.js'
import type { Certificate } from 'aws-cdk-lib/aws-certificatemanager'

export interface AcmConstructProps extends BaseConstructProps {}

export interface WebAclConstructProps extends BaseConstructProps {}

export interface AssetsBucketConstructProps extends BaseConstructProps {}

export interface SpaBucketConstructProps extends BaseConstructProps {}

export interface DistributionConstructProps extends BaseConstructProps {
  readonly spaBucket: Bucket
  readonly assetsBucket: Bucket

  readonly certifcate: Certificate
  readonly webAclId: string
}

export interface EdgeGlobalStackProps extends ScopedStackProps {}

export interface EdgeStackProps extends ScopedStackProps {
  certificate: Certificate
  webAclId: string
}