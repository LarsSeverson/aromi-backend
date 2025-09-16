import type { FragranceResolvers } from '@src/graphql/gql-types.js'
import { RequestResolver } from '@src/resolvers/RequestResolver.js'
import type { CombinedFragranceNoteRow, CursorPaginationInput } from '@aromi/shared'
import { PageFactory } from '@src/factories/PageFactory.js'
import { type FNCursorType, FNPaginationFactory } from '../factories/FNPaginationFactory.js'
import { mapDBNoteLayerToGQLNoteLayer } from '../utils/mappers.js'

type Query = FragranceResolvers['notes']

export class FragranceNotesResolver extends RequestResolver<Query> {
  private readonly pageFactory = new PageFactory()
  private readonly pagination = new FNPaginationFactory()

  resolve () {
    const { input } = this.args
    const pagination = this.pagination.parse(input)

    return this
      .getRows(pagination)
      .map(rows => this.pageFactory.paginate(rows, pagination))
      .map(rows => this.pageFactory.transform(rows, this.mapToOutput.bind(this)))
  }

  getRows (
    pagination: CursorPaginationInput<FNCursorType>
  ) {
    const { id } = this.parent
    const { services } = this.context

    const { fragrances } = services

    return fragrances
      .notes
      .findNotes(
        eb => eb('fragranceId', '=', id),
        pagination
      )
  }

  mapToOutput (
    row: CombinedFragranceNoteRow
  ) {
    const { assets } = this.context.services

    const {
      id,
      layer,

      noteId,
      noteName,
      noteS3Key,
      noteDescription
    } = row

    return {
      id,
      layer: mapDBNoteLayerToGQLNoteLayer(layer),
      note: {
        id: noteId,
        name: noteName,
        description: noteDescription,
        thumbnail: assets.getCdnUrl(noteS3Key)
      }
    }
  }
}