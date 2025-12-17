import type { BaseConstructProps, ScopedStackProps } from '../../common/types.js'
import type { FoundationStack } from '../foundation/FoundationStack.js'

export interface DatabaseConstructProps extends BaseConstructProps {
  foundationStack: FoundationStack
}

export interface FileSystemConstructProps extends BaseConstructProps {
  foundationStack: FoundationStack
}

export interface DataStackProps extends ScopedStackProps {
  foundationStack: FoundationStack
}

export interface AssetsBucketConstructProps extends BaseConstructProps { }

export interface SpaBucketConstructProps extends BaseConstructProps { }
