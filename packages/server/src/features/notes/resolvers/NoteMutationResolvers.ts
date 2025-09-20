import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { NoteEditMutationResolvers } from './NoteEditMutationResolvers.js'
import { NoteRequestMutationResolvers } from './NoteRequestMutationResolvers.js'

export class NoteMutationResolvers extends BaseResolver<MutationResolvers> {
  private readonly edits = new NoteEditMutationResolvers()
  private readonly requests = new NoteRequestMutationResolvers()

  getResolvers (): MutationResolvers {
    return {
      ...this.edits.getResolvers(),
      ...this.requests.getResolvers()
    }
  }
}