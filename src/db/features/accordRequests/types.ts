import { type DB } from '@generated/db-schema'
import type { Selectable } from 'kysely'

export type AccordRequestRow = Selectable<DB['accordRequests']>
export type AccordRequestImageRow = Selectable<DB['accordRequestImages']>
export type AccordRequestVoteRow = Selectable<DB['accordRequestVotes']>
