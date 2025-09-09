import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { okAsync } from 'neverthrow'
import { mapFragranceRequestRowToFragranceRequest } from '../utils/mappers.js'
import { throwError } from '@aromi/shared'
import { mapGQLNoteLayerToDBNoteLayer } from '@src/features/fragrances/utils/mappers.js'

export class FragranceRequestNoteMutationResolvers extends BaseResolver<MutationResolvers> {
  setFragrancRequestNotes: MutationResolvers['setFragranceRequestNotes'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context
    const me = this.checkAuthenticated(context)

    const { requestId, version, noteIds, layer } = input
    const { fragranceRequests } = services

    const dbLayer = mapGQLNoteLayerToDBNoteLayer(layer)

    const values = {
      updatedAt: new Date().toISOString()
    }

    return await fragranceRequests
      .withTransaction(trxService => trxService
        .updateOne(
          eb => eb.and([
            eb('id', '=', requestId),
            eb('userId', '=', me.id),
            eb('version', '=', version),
            eb('requestStatus', 'not in', ['ACCEPTED', 'DENIED'])
          ]),
          eb => ({
            ...values,
            version: eb(eb.ref('version'), '+', 1)
          })
        )
        .andThrough(() => trxService
          .notes
          .softDelete(
            eb => eb.and([
              eb('requestId', '=', requestId),
              eb('layer', '=', dbLayer)
            ])
          )
          .andThen(() => {
            if (noteIds.length === 0) {
              return okAsync([])
            }

            const insertValues = noteIds.map((noteId) => ({
              requestId,
              noteId,
              layer: dbLayer
            }))

            return trxService
              .notes
              .upsert(
                insertValues,
                oc => oc
                  .columns(['requestId', 'noteId', 'layer'])
                  .doUpdateSet({ deletedAt: null })
              )
          })
        )
      )
      .match(
        mapFragranceRequestRowToFragranceRequest,
        throwError
      )
  }

  getResolvers (): MutationResolvers {
    return {
      setFragranceRequestNotes: this.setFragrancRequestNotes
    }
  }
}
