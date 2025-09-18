import type { FragranceResolvers } from '@src/graphql/gql-types.js'
import { RequestResolver } from '@src/resolvers/RequestResolver.js'
import { type BackendError, unwrapOrThrow, type CombinedFragranceNoteScoreRow, type CursorPaginationInput, type FragranceNoteVoteRow } from '@aromi/shared'
import { PageFactory } from '@src/factories/PageFactory.js'
import { type FNCursorType, FNPaginationFactory } from '../factories/FNPaginationFactory.js'
import { mapDBNoteLayerToGQLNoteLayer } from '../utils/mappers.js'
import { okAsync, ResultAsync } from 'neverthrow'

type Query = FragranceResolvers['notes']

export class FragranceNotesResolver extends RequestResolver<Query> {
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
      .findNotes(
        eb => eb('fragranceId', '=', id),
        pagination
      )
  }

  getMyVoteRows () {
    const { id } = this.parent
    const { me, loaders } = this.context

    if (me == null) return okAsync([])

    const { fragrances } = loaders

    return fragrances.loadMyNoteVotes(id, me.id)
  }

  mapToOutput (
    row: CombinedFragranceNoteScoreRow,
    myVoteRowsMap: Map<string, FragranceNoteVoteRow>
  ) {
    const { assets } = this.context.services
    const myVote = myVoteRowsMap.get(row.noteId) != null ? 1 : null

    const {
      id,
      layer,
      upvotes,
      downvotes,
      score,

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