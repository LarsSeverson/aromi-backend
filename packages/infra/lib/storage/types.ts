import type { BaseInfraProps } from '../types.js'
import type { StorageStack } from './StorageStack.js'

export interface StorageStackProps extends BaseInfraProps {}

export interface SynthStorageStackProps extends BaseInfraProps {}

export interface SynthStorageStackOutput {
  storage: StorageStack
}