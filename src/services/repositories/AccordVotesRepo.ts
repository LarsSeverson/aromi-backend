import { type DB } from '@src/db/schema'
import { type Selectable } from 'kysely'
import { TableService } from '../TableService'
import { type ApiDataSources } from '@src/datasources/datasources'
import { errAsync, okAsync, type ResultAsync } from 'neverthrow'
import { type ApiError } from '@src/common/error'

export type AccordVoteRow = Selectable<DB['fragranceAccordVotes']>

export interface AccordVoteParams {
  userId: number
  fragranceAccordId: number
  vote: number
  updatedAt: string
  deletedAt: string | null
}

export class AccordVotesRepo extends TableService<'fragranceAccordVotes', AccordVoteRow> {
  constructor (sources: ApiDataSources) {
    super(sources, 'fragranceAccordVotes')
  }

  vote (
    params: AccordVoteParams
  ): ResultAsync<{ previousVoteRow: AccordVoteRow | null, updatedVoteRow: AccordVoteRow }, ApiError> {
    const {
      userId,
      fragranceAccordId,
      vote,
      updatedAt,
      deletedAt
    } = params

    return this
      .findOne(
        eb => eb.and([
          eb('fragranceAccordVotes.fragranceAccordId', '=', fragranceAccordId),
          eb('fragranceAccordVotes.userId', '=', userId)
        ])
      )
      .orElse(error => {
        if (error.status === 404) {
          return okAsync(null)
        }

        return errAsync(error)
      })
      .andThen(previousVoteRow => this
        .upsert(
          {
            userId,
            fragranceAccordId,
            vote,
            deletedAt
          },
          oc => oc
            .columns(['userId', 'fragranceAccordId'])
            .doUpdateSet(
              {
                vote,
                deletedAt,
                updatedAt
              }
            )
        )
        .map(updatedVoteRow => ({ previousVoteRow, updatedVoteRow }))
      )
  }
}
