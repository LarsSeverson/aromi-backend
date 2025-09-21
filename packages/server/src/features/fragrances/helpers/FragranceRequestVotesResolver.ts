import { unwrapOrThrow } from '@aromi/shared'
import type { FragranceRequestResolvers } from '@src/graphql/gql-types.js'
import { RequestResolver } from '@src/resolvers/RequestResolver.js'
import { okAsync, ResultAsync } from 'neverthrow'

type Field = FragranceRequestResolvers['votes']

export class FragranceRequestVotesResolver extends RequestResolver<Field> {
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

    const { fragrances } = services

    return fragrances
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

    const { fragrances } = services

    return fragrances
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