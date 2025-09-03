import { type DB } from '@src/generated/db-schema'
import { type AccordRequest } from '@src/generated/gql-types'
import { type Selectable } from 'kysely'

export type AccordRequestRow = Selectable<DB['accordRequests']>
export type AccordRequestImageRow = Selectable<DB['accordRequestImages']>
export type AccordRequestVoteRow = Selectable<DB['accordRequestVotes']>

export interface IAccordRequestSummary extends Omit<AccordRequest, 'image' | 'user' | 'votes'> {}

export type AccordRequestLoadersKey = string
