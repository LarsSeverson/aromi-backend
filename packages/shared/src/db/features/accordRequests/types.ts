import type { DB } from '@src/db/db-schema.js'
import type { Selectable } from 'kysely'

export type AccordRequestRow = Selectable<DB['accordRequests']>
export type AccordRequestImageRow = Selectable<DB['accordRequestImages']>
export type AccordRequestVoteRow = Selectable<DB['accordRequestVotes']>
export type AccordRequestVoteCountRow = Selectable<DB['accordRequestVoteCounts']>
