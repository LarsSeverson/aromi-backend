import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { NoteEditMutationResolvers } from './NoteEditMutationResolvers.js'

export class NoteMutationResolvers extends BaseResolver<MutationResolvers> {
  edits = new NoteEditMutationResolvers()

  getResolvers (): MutationResolvers {
    return {
      ...this.edits.getResolvers()
    }
  }
}