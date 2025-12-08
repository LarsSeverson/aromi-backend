import type { BaseStackProps } from '../types.js'
import type { StorageStack } from './StorageStack.js'

export interface StorageStackProps extends BaseStackProps {}

export interface SynthStorageStackProps extends BaseStackProps {}

export interface SynthStorageStackOutput {
  storage: StorageStack
}