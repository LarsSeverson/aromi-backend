import type { FragranceRequestRow } from '@aromi/shared'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { mapFragranceRequestRowToFragranceRequest } from '../utils/mappers.js'
import { VoteOnRequestResolver } from '@src/features/requests/helpers/VoteOnRequestResolver.js'

//   return fragranceRequests
//     .withTransactionAsync(async trx => {
//       this.trxService = trx
//       return await this.handleVote()
//     })
//     .andThrough(({ request, voteCounts }) => {
//       if (!this.shouldPromote(voteCounts, request)) return okAsync()
//       return this.handlePromotion(request)
//     })
//     .map(({ request }) =>
//       mapFragranceRequestRowToFragranceRequest(request)
//     )
// }

// private async handleVote () {
//   if (this.trxService == null) {
//     throw new BackendError(
//       'NOT_INITIALIZED',
//       'Transaction service not initialized',
//       500
//     )
//   }

//   const { input } = this.args
//   parseSchema(VoteOnRequestSchema, input)

//   const request = await this.getRequest()
//   const existingVote = await this.getExistingVote()

//   if (existingVote == null) {
//     await this.insertVote()
//   } else if (existingVote.vote !== input.vote) {
//     await this.updateVote(existingVote.vote)
//   }

//   const voteCounts = await this.getVoteCount()

//   return { request, voteCounts }
// }

// private handlePromotion (request: FragranceRequestRow) {
//   const { queues } = this.context
//   const { promotions } = queues

//   return promotions.enqueue({ jobName: 'promote-fragrance', data: request })
// }

export class VoteOnFRResolver extends VoteOnRequestResolver<MutationResolvers['voteOnFragranceRequest'], FragranceRequestRow> {
  mapToOutput (request: FragranceRequestRow) {
    return mapFragranceRequestRowToFragranceRequest(request)
  }
}