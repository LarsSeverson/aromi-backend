import type { FragranceResolvers } from '@src/graphql/gql-types.js'
import { RequestResolver } from '@src/resolvers/RequestResolver.js'
import { type FACursorType, FAPaginationFactory } from '../factories/FAPaginationFactory.js'
import { type BackendError, type FragranceAccordVoteRow, unwrapOrThrow, type CombinedFragranceAccordScoreRow, type CursorPaginationInput } from '@aromi/shared'
import { PageFactory } from '@src/factories/PageFactory.js'
import { okAsync, ResultAsync } from 'neverthrow'

type Query = FragranceResolvers['accords']

export class FragranceAccordsResolver extends RequestResolver<Query> {
  private readonly pageFactory = new PageFactory()
  private readonly pagination = new FAPaginationFactory()

  resolve () {
    return ResultAsync
      .fromPromise(
        this.handleGetAccords(),
        error => error as BackendError
      )
  }

  async handleGetAccords () {
    const { input } = this.args

    const pagination = this.pagination.parse(input)

    const scoreRows = await unwrapOrThrow(this.getScoreRows(pagination))
    const myVoteRows = await unwrapOrThrow(this.getMyVoteRows())

    const myVoteRowsMap = new Map(myVoteRows.map(v => [v.accordId, v]))

    const connection = this.pageFactory.paginate(scoreRows, pagination)
    const transformed = this.pageFactory.transform(connection, node => this.mapToOutput(node, myVoteRowsMap))

    return transformed
  }

  getScoreRows (pagination: CursorPaginationInput<FACursorType>) {
    const { id } = this.parent
    const { services } = this.context

    const { fragrances } = services

    return fragrances
      .accords
      .scores
      .findCombinedAccords(
        where => where.and([
          where('fragranceId', '=', id),
          where('score', '>', 0)
        ]),
        pagination
      )
  }

  getMyVoteRows () {
    const { id } = this.parent
    const { me, loaders } = this.context

    if (me == null) return okAsync([])

    const { fragrances } = loaders

    return fragrances.loadUserAccordVotes(id, me.id)
  }

  mapToOutput (
    row: CombinedFragranceAccordScoreRow,
    myVotesMap: Map<string, FragranceAccordVoteRow>
  ) {
    const myVote = myVotesMap.get(row.accordId) == null ? null : 1

    const {
      id,
      upvotes,
      downvotes,
      score,

      accordId,
      accordName,
      accordColor,
      accordDescription
    } = row

    return {
      id,
      accord: {
        id: accordId,
        name: accordName,
        color: accordColor,
        description: accordDescription
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