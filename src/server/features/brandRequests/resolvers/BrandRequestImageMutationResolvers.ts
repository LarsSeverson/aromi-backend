import { parseSchema } from '@src/server/utils/validation'
import { type MutationResolvers } from '@src/generated/gql-types'
import { BaseResolver } from '@src/server/resolvers/BaseResolver'
import { FinalizeBrandRequestImageSchema, StageBrandRequestImageSchema } from '../utils/validation'
import { genBrandRequestsKey } from '@src/server/datasources/s3/utils'
import { throwError } from '@src/common/error'
import { errAsync, okAsync } from 'neverthrow'
import { mapBrandRequestRowToBrandRequestSummary } from '../utils/mappers'

export class BrandRequestImageMutationResolvers extends BaseResolver<MutationResolvers> {
  stageBrandRequestImage: MutationResolvers['stageBrandRequestImage'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context
    const me = this.checkAuthenticated(context)

    const { id, fileName } = input
    const { contentType, contentSize } = parseSchema(StageBrandRequestImageSchema, input)
    const { assets, brandRequests } = services

    const { key } = genBrandRequestsKey(id, fileName)

    const values = {
      requestId: id,
      name: fileName,
      contentType,
      sizeBytes: String(contentSize),
      s3Key: key
    }

    return await brandRequests
      .withTransaction(() => brandRequests
        .findOne(
          eb => eb.and([
            eb('id', '=', id),
            eb('userId', '=', me.id),
            eb('requestStatus', 'not in', ['ACCEPTED', 'DENIED'])
          ])
        )
        .andThen(() => brandRequests
          .images
          .create(values)
        )
      )
      .andThen(newRow => assets
        .getPresignedUrl({ key: newRow.s3Key, contentType, maxSizeBytes: contentSize })
        .map(presigned => ({ newRow, presigned }))
      )
      .match(
        ({ newRow, presigned }) => ({ ...presigned, id: newRow.id }),
        throwError
      )
  }

  finalizeBrandRequestImage: MutationResolvers['finalizeBrandRequestImage'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context
    const me = this.checkAuthenticated(context)

    const { requestId, assetId } = input
    const { version } = parseSchema(FinalizeBrandRequestImageSchema, input)
    const { assets, brandRequests } = services

    const values = {
      updatedAt: new Date().toISOString()
    }

    return await brandRequests
      .withTransaction(() => brandRequests
        .updateOne(
          eb => eb.and([
            eb('brandRequests.id', '=', requestId),
            eb('userId', '=', me.id),
            eb('version', '=', version),
            eb('requestStatus', 'not in', ['ACCEPTED', 'DENIED'])
          ]),
          eb => ({
            ...values,
            version: eb(eb.ref('version'), '+', 1)
          })
        )
        .andThen(request => brandRequests
          .images
          .softDeleteOne(
            eb => eb.and([
              eb('requestId', '=', requestId),
              eb('brandRequestImages.status', '=', 'ready')
            ])
          )
          .orElse(error => {
            if (error.status === 404) {
              return okAsync(null)
            }
            return errAsync(error)
          })
          .map(oldAsset => ({ oldAsset, request }))
        )
        .andThrough(() => brandRequests
          .images
          .updateOne(
            eb => eb.and([
              eb('requestId', '=', requestId),
              eb('id', '=', assetId),
              eb('brandRequestImages.status', '=', 'staged')
            ]),
            { status: 'ready' }
          )
        )
      )
      .andThrough(({ oldAsset }) => {
        if (oldAsset == null) return okAsync()

        return assets
          .deleteFromS3(oldAsset.s3Key)
          .orElse(okAsync)
      })
      .map(({ request }) => request)
      .match(
        mapBrandRequestRowToBrandRequestSummary,
        throwError
      )
  }

  getResolvers (): MutationResolvers {
    return {
      stageBrandRequestImage: this.stageBrandRequestImage,
      finalizeBrandRequestImage: this.finalizeBrandRequestImage
    }
  }
}
