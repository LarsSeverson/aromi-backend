import type { Vpc } from 'aws-cdk-lib/aws-ec2'
import type { BaseConstructProps, ScopedStackProps } from '../../common/types.js'

export interface DatabaseConstructProps extends BaseConstructProps {
  vpc: Vpc
}

export interface FileSystemConstructProps extends BaseConstructProps {
  vpc: Vpc
}

export interface DataStackProps extends ScopedStackProps {
  vpc: Vpc
}
