import type { Vpc } from 'aws-cdk-lib/aws-ec2'
import type { BaseConstructProps, ScopedStackProps } from '../../common/types.js'
import type { FoundationStack } from '../foundation/FoundationStack.js'
import type { DataStack } from '../data/DataStack.js'

export interface JumpBoxConstructProps extends BaseConstructProps {
  readonly vpc: Vpc
}

export interface ManagementStackProps extends ScopedStackProps {
  readonly foundationStack: FoundationStack
  readonly dataStack: DataStack
}