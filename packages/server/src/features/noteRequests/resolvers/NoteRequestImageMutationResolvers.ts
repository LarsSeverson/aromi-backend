import { unwrapOrThrow } from '@aromi/shared'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { StageNRAssetResolver } from '../helpers/StageNRAssetResolver.js'
import { FinalizeNRResolver } from '../helpers/FinalizeNRAssetResolver.js'

export class NoteRequestImageMutationResolvers extends BaseResolver<MutationResolvers> {
  stageNoteRequestImage: MutationResolvers['stageNoteRequestImage'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new StageNRAssetResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  finalizeNoteRequestImage: MutationResolvers['finalizeNoteRequestImage'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new FinalizeNRResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  getResolvers (): MutationResolvers {
    return {
      stageNoteRequestImage: this.stageNoteRequestImage,
      finalizeNoteRequestImage: this.finalizeNoteRequestImage
    }
  }
}
