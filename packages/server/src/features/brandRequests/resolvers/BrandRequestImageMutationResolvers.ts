import { unwrapOrThrow } from '@aromi/shared'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { StageBRAssetResolver } from '../helpers/StageBRAssetResolver.js'
import { FinalizeBRResolver } from '../helpers/FinalizeBRAssetResolver.js'

export class BrandRequestImageMutationResolvers extends BaseResolver<MutationResolvers> {
  stageBrandRequestImage: MutationResolvers['stageBrandRequestImage'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new StageBRAssetResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  finalizeBrandRequestImage: MutationResolvers['finalizeBrandRequestImage'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new FinalizeBRResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  getResolvers (): MutationResolvers {
    return {
      stageBrandRequestImage: this.stageBrandRequestImage,
      finalizeBrandRequestImage: this.finalizeBrandRequestImage
    }
  }
}
