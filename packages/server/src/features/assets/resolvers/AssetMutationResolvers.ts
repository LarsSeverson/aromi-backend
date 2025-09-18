import { unwrapOrThrow } from '@aromi/shared'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'

export class AssetMutationResolvers extends BaseResolver<MutationResolvers> {
  deleteAsset: MutationResolvers['deleteAsset'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context

    this.checkAuthenticated(context)

    const { id } = input
    const { assets } = services

    const row = await unwrapOrThrow(
      assets
        .uploads
        .softDeleteOne(eb => eb('id', '=', id))
    )

    await assets.deleteFromS3(row.s3Key)

    return true
  }

  getResolvers (): MutationResolvers {
    return {
      deleteAsset: this.deleteAsset
    }
  }
}