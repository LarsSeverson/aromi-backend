import { unwrapOrThrow } from '@aromi/shared'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { StageFRAssetResolver } from '../helpers/StageFRAssetResolver.js'
import { FinalizeFRAssetResolver } from '../helpers/FinalizeFRAssetResolver.js'

export class FragranceRequestImageMutationResolvers extends BaseResolver<MutationResolvers> {
  stageFragranceRequestImage: MutationResolvers['stageFragranceRequestImage'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new StageFRAssetResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  finalizeFragranceRequestImage: MutationResolvers['finalizeFragranceRequestImage'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new FinalizeFRAssetResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  getResolvers (): MutationResolvers {
    return {
      stageFragranceRequestImage: this.stageFragranceRequestImage,
      finalizeFragranceRequestImage: this.finalizeFragranceRequestImage
    }
  }
}
