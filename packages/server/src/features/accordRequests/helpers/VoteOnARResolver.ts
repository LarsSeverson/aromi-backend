import type { AccordRequestRow } from '@aromi/shared'
import { VoteOnRequestResolver } from '@src/features/requests/helpers/VoteOnRequestResolver.js'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { mapAccordRequestRowToAccordRequestSummary } from '../utils/mappers.js'

export class VoteOnARResolver extends VoteOnRequestResolver<MutationResolvers['voteOnAccordRequest'], AccordRequestRow> {
  mapToOutput (request: AccordRequestRow) {
    return mapAccordRequestRowToAccordRequestSummary(request)
  }
}