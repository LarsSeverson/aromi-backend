import { parseSchema } from '@src/common/validation'
import { type MutationResolvers } from '@src/generated/gql-types'
import { BaseResolver } from '@src/resolvers/BaseResolver'
import { FinalizeFragranceDraftImageSchema, StageFragranceDraftImageSchema } from './validation'
import { genFragranceDraftsKey } from '@src/datasources/s3/utils'
import { throwError } from '@src/common/error'
import { errAsync, okAsync } from 'neverthrow'
import { mapFragranceDraftRowToFragranceDraft } from '../utils/mappers'

export class FragranceDraftImageMutationResolvers extends BaseResolver<MutationResolvers> {
  stageFragranceDraftImage: MutationResolvers['stageFragranceDraftImage'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context
    const me = this.checkAuthenticated(context)

    const { id, fileName } = input
    const { contentType, contentSize } = parseSchema(StageFragranceDraftImageSchema, input)
    const { assets, fragranceDrafts } = services

    const { key } = genFragranceDraftsKey(id, fileName)

    const values = {
      draftId: id,
      name: fileName,
      contentType,
      sizeBytes: String(contentSize),
      s3Key: key
    }

    return await fragranceDrafts
      .withTransaction(() => fragranceDrafts
        .findOne(
          eb => eb.and([
            eb('id', '=', id),
            eb('userId', '=', me.id)
          ])
        )
        .andThen(() => fragranceDrafts
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

  finalizeFragranceDraftImage: MutationResolvers['finalizeFragranceDraftImage'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context
    const me = this.checkAuthenticated(context)

    const { draftId, assetId } = input
    const { version } = parseSchema(FinalizeFragranceDraftImageSchema, input)
    const { assets, fragranceDrafts } = services

    const values = {
      updatedAt: new Date().toISOString()
    }

    return await fragranceDrafts
      .withTransaction(() => fragranceDrafts
        .updateOne(
          eb => eb.and([
            eb('fragranceDrafts.id', '=', draftId),
            eb('userId', '=', me.id),
            eb('version', '=', version)
          ]),
          eb => ({
            ...values,
            version: eb(eb.ref('version'), '+', 1)
          })
        )
        .andThen(draft => fragranceDrafts
          .images
          .softDeleteOne(
            eb => eb.and([
              eb('fragranceDraftImages.draftId', '=', draftId),
              eb('fragranceDraftImages.status', '=', 'ready')
            ])
          )
          .orElse(error => {
            if (error.status === 404) {
              return okAsync(null)
            }
            return errAsync(error)
          })
          .map(oldAsset => ({ oldAsset, draft }))
        )
        .andThrough(() => fragranceDrafts
          .images
          .updateOne(
            eb => eb.and([
              eb('fragranceDraftImages.draftId', '=', draftId),
              eb('fragranceDraftImages.id', '=', assetId),
              eb('fragranceDraftImages.status', '=', 'staged')
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
      .map(({ draft }) => draft)
      .match(
        mapFragranceDraftRowToFragranceDraft,
        throwError
      )
  }

  getResolvers (): MutationResolvers {
    return {
      stageFragranceDraftImage: this.stageFragranceDraftImage,
      finalizeFragranceDraftImage: this.finalizeFragranceDraftImage
    }
  }
}
