import type { FragranceResolvers } from '@src/graphql/gql-types.js'
import { RequestResolver } from '@src/resolvers/RequestResolver.js'
import { type BackendError, unwrapOrThrow, type CombinedFragranceNoteScoreRow, type CursorPaginationInput, type FragranceNoteVoteRow } from '@aromi/shared'
import { PageFactory } from '@src/factories/PageFactory.js'
import { type FNCursorType, FNPaginationFactory } from '../factories/FNPaginationFactory.js'
import { mapDBNoteLayerToGQLNoteLayer } from '../utils/mappers.js'
import { okAsync, ResultAsync } from 'neverthrow'

type Field = FragranceResolvers['notes']

export class FragranceNotesResolver extends RequestResolver<Field> {
  private readonly pageFactory = new PageFactory()
  private readonly pagination = new FNPaginationFactory()

  resolve () {
    return ResultAsync
      .fromPromise(
        this.handleGetNotes(),
        error => error as BackendError
      )
  }

  async handleGetNotes () {
    const { input } = this.args

    const pagination = this.pagination.parse(input)

    const scoreRows = await unwrapOrThrow(this.getScoreRows(pagination))
    const myVoteRows = await unwrapOrThrow(this.getMyVoteRows())

    const myVoteRowsMap = new Map(myVoteRows.map(v => [v.noteId, v]))

    const connection = this.pageFactory.paginate(scoreRows, pagination)
    const transformed = this.pageFactory.transform(connection, node => this.mapToOutput(node, myVoteRowsMap))

    return transformed
  }

  getScoreRows (
    pagination: CursorPaginationInput<FNCursorType>
  ) {
    const { id } = this.parent
    const { services } = this.context

    const { fragrances } = services

    return fragrances
      .notes
      .scores
      .findCombinedNotes(
        eb => eb('fragranceId', '=', id),
        pagination
      )
  }

  getMyVoteRows () {
    const { id } = this.parent
    const { me, loaders } = this.context

    if (me == null) return okAsync([])

    const { fragrances } = loaders

    return fragrances.loadUserNoteVotes(id, me.id)
  }

  mapToOutput (
    row: CombinedFragranceNoteScoreRow,
    myVoteRowsMap: Map<string, FragranceNoteVoteRow>
  ) {
    const myVote = myVoteRowsMap.get(row.noteId) != null ? 1 : null

    const {
      id,
      layer,
      upvotes,
      downvotes,
      score,

      noteId,
      noteName,
      noteDescription,
      noteThumbnailImageId
    } = row

    return {
      id,
      layer: mapDBNoteLayerToGQLNoteLayer(layer),
      note: {
        id: noteId,
        name: noteName,
        description: noteDescription,
        thumbnailImageId: noteThumbnailImageId
      },
      votes: {
        upvotes,
        downvotes,
        score,
        myVote
      }
    }
  }
}