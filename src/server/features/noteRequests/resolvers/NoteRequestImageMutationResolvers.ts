import { parseSchema } from '@src/server/utils/validation'
import { type MutationResolvers } from '@src/generated/gql-types'
import { BaseResolver } from '@src/server/resolvers/BaseResolver'
import { throwError } from '@src/common/error'
import { errAsync, okAsync } from 'neverthrow'
import { FinalizeNoteRequestImageSchema, StageNoteRequestImageSchema } from '../utils/validation'
import { genNoteRequestsKey } from '@src/datasources/s3/utils'
import { mapNoteRequestRowToNoteRequestSummary } from '../utils/mappers'

export class NoteRequestImageMutationResolvers extends BaseResolver<MutationResolvers> {
  stageNoteRequestImage: MutationResolvers['stageNoteRequestImage'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context
    const me = this.checkAuthenticated(context)

    const { id, fileName } = input
    const { contentType, contentSize } = parseSchema(StageNoteRequestImageSchema, input)
    const { assets, noteRequests } = services

    const { key } = genNoteRequestsKey(id, fileName)

    const values = {
      requestId: id,
      name: fileName,
      contentType,
      sizeBytes: String(contentSize),
      s3Key: key
    }

    return await noteRequests
      .withTransaction(() => noteRequests
        .findOne(
          eb => eb.and([
            eb('id', '=', id),
            eb('userId', '=', me.id),
            eb('requestStatus', 'not in', ['ACCEPTED', 'DENIED'])
          ])
        )
        .andThen(() => noteRequests
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

  finalizeNoteRequestImage: MutationResolvers['finalizeNoteRequestImage'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context
    const me = this.checkAuthenticated(context)

    const { requestId, assetId } = input
    const { version } = parseSchema(FinalizeNoteRequestImageSchema, input)
    const { assets, noteRequests } = services

    const values = {
      updatedAt: new Date().toISOString()
    }

    return await noteRequests
      .withTransaction(() => noteRequests
        .updateOne(
          eb => eb.and([
            eb('noteRequests.id', '=', requestId),
            eb('userId', '=', me.id),
            eb('version', '=', version),
            eb('requestStatus', 'not in', ['ACCEPTED', 'DENIED'])
          ]),
          eb => ({
            ...values,
            version: eb(eb.ref('version'), '+', 1)
          })
        )
        .andThen(request => noteRequests
          .images
          .softDeleteOne(
            eb => eb.and([
              eb('requestId', '=', requestId),
              eb('noteRequestImages.status', '=', 'ready')
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
        .andThrough(() => noteRequests
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
        mapNoteRequestRowToNoteRequestSummary,
        throwError
      )
  }

  getResolvers (): MutationResolvers {
    return {
      stageNoteRequestImage: this.stageNoteRequestImage,
      finalizeNoteRequestImage: this.finalizeNoteRequestImage
    }
  }
}
