import type { DB } from '@src/db/index.js'
import type { Selectable } from 'kysely'

export type BrandRow = Selectable<DB['brands']>
export type BrandImageRow = Selectable<DB['brandImages']>
export type BrandVoteRow = Selectable<DB['brandVotes']>
export type BrandScoreRow = Selectable<DB['brandScores']>

export type BrandEditRow = Selectable<DB['brandEdits']>
export type BrandRequestRow = Selectable<DB['brandRequests']>
export type BrandRequestVoteRow = Selectable<DB['brandRequestVotes']>
export type BrandRequestScoreRow = Selectable<DB['brandRequestScores']>
