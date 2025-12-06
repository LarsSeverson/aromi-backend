import { DatabaseStack } from './DatabaseStack.js'
import type { SynthDatabaseStackProps } from './types.js'

export const synthDatabaseStack = (props: SynthDatabaseStackProps) => {
  const { app, networkStack } = props
  const { network } = networkStack

  const database = new DatabaseStack({ app, network })

  return { database }
}