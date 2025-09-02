import { parseSchema } from '@src/common/validation'
import { type MutationResolvers } from '@src/generated/gql-types'
import { BaseResolver } from '@src/resolvers/BaseResolver'
import { FinalizeFragranceRequestImageSchema, StageFragranceRequestImageSchema } from '../utils/validation'
import { genFragranceRequestsKey } from '@src/datasources/s3/utils'
import { throwError } from '@src/common/error'
import { errAsync, okAsync } from 'neverthrow'
import { mapFragranceRequestRowToFragranceRequest } from '../utils/mappers'

export class FragranceRequestImageMutationResolvers extends BaseResolver<MutationResolvers> {
  stageFragranceRequestImage: MutationResolvers['stageFragranceRequestImage'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context
    const me = this.checkAuthenticated(context)

    const { id, fileName } = input
    const { contentType, contentSize } = parseSchema(StageFragranceRequestImageSchema, input)
    const { assets, fragranceRequests } = services

    const { key } = genFragranceRequestsKey(id, fileName)

    const values = {
      requestId: id,
      name: fileName,
      contentType,
      sizeBytes: String(contentSize),
      s3Key: key
    }

    return await fragranceRequests
      .withTransaction(() => fragranceRequests
        .findOne(
          eb => eb.and([
            eb('id', '=', id),
            eb('userId', '=', me.id),
            eb('requestStatus', 'not in', ['ACCEPTED', 'DENIED'])
          ])
        )
        .andThen(() => fragranceRequests
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

  finalizeFragranceRequestImage: MutationResolvers['finalizeFragranceRequestImage'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context
    const me = this.checkAuthenticated(context)

    const { requestId, assetId } = input
    const { version } = parseSchema(FinalizeFragranceRequestImageSchema, input)
    const { assets, fragranceRequests } = services

    const values = {
      updatedAt: new Date().toISOString()
    }

    return await fragranceRequests
      .withTransaction(() => fragranceRequests
        .updateOne(
          eb => eb.and([
            eb('fragranceRequests.id', '=', requestId),
            eb('userId', '=', me.id),
            eb('version', '=', version),
            eb('requestStatus', 'not in', ['ACCEPTED', 'DENIED'])
          ]),
          eb => ({
            ...values,
            version: eb(eb.ref('version'), '+', 1)
          })
        )
        .andThen(request => fragranceRequests
          .images
          .softDeleteOne(
            eb => eb.and([
              eb('fragranceRequestImages.requestId', '=', requestId),
              eb('fragranceRequestImages.status', '=', 'ready')
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
        .andThrough(() => fragranceRequests
          .images
          .updateOne(
            eb => eb.and([
              eb('fragranceRequestImages.requestId', '=', requestId),
              eb('fragranceRequestImages.id', '=', assetId),
              eb('fragranceRequestImages.status', '=', 'staged')
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
        mapFragranceRequestRowToFragranceRequest,
        throwError
      )
  }

  getResolvers (): MutationResolvers {
    return {
      stageFragranceRequestImage: this.stageFragranceRequestImage,
      finalizeFragranceRequestImage: this.finalizeFragranceRequestImage
    }
  }
}
