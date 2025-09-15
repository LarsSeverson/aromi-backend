import { unwrapOrThrow } from '@aromi/shared'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { StageARAssetResolver } from '../helpers/StageARAssetResolver.js'
import { FinalizeARAssetResolver } from '../helpers/FinalizeARAssetResolver.js'

export class AccordRequestImageMutationResolvers extends BaseResolver<MutationResolvers> {
  stageAccordRequestImage: MutationResolvers['stageAccordRequestImage'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new StageARAssetResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  finalizeAccordRequestImage: MutationResolvers['finalizeAccordRequestImage'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new FinalizeARAssetResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  getResolvers (): MutationResolvers {
    return {
      stageAccordRequestImage: this.stageAccordRequestImage,
      finalizeAccordRequestImage: this.finalizeAccordRequestImage
    }
  }
}
