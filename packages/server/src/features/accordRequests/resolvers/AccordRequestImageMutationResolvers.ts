import { parseSchema, throwError, genImageKey } from '@aromi/shared'
import { type MutationResolvers } from '@src/graphql/gql-types'
import { BaseResolver } from '@src/resolvers/BaseResolver'
import { errAsync, okAsync } from 'neverthrow'
import { FinalizeAccordRequestImageSchema, StageAccordRequestImageSchema } from '../utils/validation'
import { mapAccordRequestRowToAccordRequestSummary } from '../utils/mappers'

export class AccordRequestImageMutationResolvers extends BaseResolver<MutationResolvers> {
  stageAccordRequestImage: MutationResolvers['stageAccordRequestImage'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context
    const me = this.checkAuthenticated(context)

    const { id, fileName } = input
    const { contentType, contentSize } = parseSchema(StageAccordRequestImageSchema, input)
    const { assets, accordRequests } = services

    const { key } = genImageKey('accords', id)

    const values = {
      requestId: id,
      name: fileName,
      contentType,
      sizeBytes: String(contentSize),
      s3Key: key
    }

    return await accordRequests
      .withTransaction(trxService => trxService
        .findOne(
          eb => eb.and([
            eb('id', '=', id),
            eb('userId', '=', me.id),
            eb('requestStatus', 'not in', ['ACCEPTED', 'DENIED'])
          ])
        )
        .andThen(() => trxService
          .images
          .createOne(values)
        )
      )
      .andThen(newRow => assets
        .getPresignedUrl({
          key: newRow.s3Key,
          contentType,
          maxSizeBytes: contentSize
        })
        .map(presigned => ({ newRow, presigned }))
      )
      .match(
        ({ newRow, presigned }) => ({ ...presigned, id: newRow.id }),
        throwError
      )
  }

  finalizeAccordRequestImage: MutationResolvers['finalizeAccordRequestImage'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context
    const me = this.checkAuthenticated(context)

    const { requestId, assetId } = input
    const { version } = parseSchema(FinalizeAccordRequestImageSchema, input)
    const { assets, accordRequests } = services

    const values = {
      updatedAt: new Date().toISOString()
    }

    return await accordRequests
      .withTransaction(trxService => trxService
        .updateOne(
          eb => eb.and([
            eb('accordRequests.id', '=', requestId),
            eb('userId', '=', me.id),
            eb('version', '=', version),
            eb('requestStatus', 'not in', ['ACCEPTED', 'DENIED'])
          ]),
          eb => ({
            ...values,
            version: eb(eb.ref('version'), '+', 1)
          })
        )
        .andThen(request => trxService
          .images
          .softDeleteOne(
            eb => eb.and([
              eb('requestId', '=', requestId),
              eb('accordRequestImages.status', '=', 'ready')
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
        .andThrough(() => trxService
          .images
          .updateOne(
            eb => eb.and([
              eb('id', '=', assetId),
              eb('requestId', '=', requestId),
              eb('status', '=', 'staged')
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
        mapAccordRequestRowToAccordRequestSummary,
        throwError
      )
  }

  getResolvers (): MutationResolvers {
    return {
      stageAccordRequestImage: this.stageAccordRequestImage,
      finalizeAccordRequestImage: this.finalizeAccordRequestImage
    }
  }
}
