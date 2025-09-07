import { type DB } from '@src/db'
import type { Selectable } from 'kysely'

export type BrandRequestRow = Selectable<DB['brandRequests']>
export type BrandRequestImageRow = Selectable<DB['brandRequestImages']>
export type BrandRequestVoteRow = Selectable<DB['brandRequestVotes']>
