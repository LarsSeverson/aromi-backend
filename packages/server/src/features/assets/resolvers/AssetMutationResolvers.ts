import { genAssetKey, parseOrThrow, unwrapOrThrow } from '@aromi/shared'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { mapAssetKeyToS3Entity, mapAssetKeyToSchema } from '../utils/mappers.js'

export class AssetMutationResolvers extends BaseResolver<MutationResolvers> {
  stageAsset: MutationResolvers['stageAsset'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context

    const me = this.checkAuthenticated(context)

    const { fileName, key } = input
    const { assets } = services

    const entity = mapAssetKeyToS3Entity(key)
    const schema = mapAssetKeyToSchema(key)

    const { key: s3Key } = genAssetKey(entity, fileName)
    const { contentType, contentSize } = parseOrThrow(schema, input)

    const presigned = await unwrapOrThrow(
      assets.getPresignedUrl({ key: s3Key, contentType, maxSizeBytes: contentSize })
    )

    const asset = await unwrapOrThrow(
      assets
        .uploads
        .createOne({
          userId: me.id,
          name: fileName,
          s3Key,
          contentType,
          sizeBytes: String(contentSize)
        })
    )

    const { id: assetId } = asset

    return {
      ...presigned,
      assetId
    }
  }

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
      stageAsset: this.stageAsset,
      deleteAsset: this.deleteAsset
    }
  }
}