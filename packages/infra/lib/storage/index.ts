import { StorageStack } from './StorageStack.js'
import type { SynthStorageStackProps } from './types.js'

export const synthStorageStack = (props: SynthStorageStackProps) => {
  const { app } = props

  const storage = new StorageStack({ app })

  return { storage }
}