import { unwrapOrThrow } from '@aromi/shared'
import type { BrandRequestResolvers } from '@src/graphql/gql-types.js'
import { RequestResolver } from '@src/resolvers/RequestResolver.js'
import { okAsync, ResultAsync } from 'neverthrow'

type Field = BrandRequestResolvers['votes']

export class BrandRequestVotesResolver extends RequestResolver<Field> {
  async resolve () {
    const combined = await unwrapOrThrow(
      ResultAsync.combine([this.getScore(), this.getMyVote()])
    )

    const [scoreRow, myVote] = combined
    const { upvotes, downvotes, score } = scoreRow

    return {
      upvotes,
      downvotes,
      score,
      myVote
    }
  }

  getScore () {
    const { id } = this.parent
    const { services } = this.context

    const { brands } = services

    return brands
      .requests
      .votes
      .scores
      .findOne(
        eb => eb('requestId', '=', id)
      )
  }

  getMyVote () {
    const { id } = this.parent
    const { me, services } = this.context

    if (me == null) return okAsync(null)

    const { brands } = services

    return brands
      .requests
      .votes
      .findOne(
        eb => eb.and([
          eb('requestId', '=', id),
          eb('userId', '=', me.id)
        ])
      )
      .map(row => row.vote)
  }
}