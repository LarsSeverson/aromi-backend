import { type DB } from '@generated/db-schema'
import type { Selectable } from 'kysely'

export type BrandRequestRow = Selectable<DB['brandRequests']>
export type BrandRequestImageRow = Selectable<DB['brandRequestImages']>
export type BrandRequestVoteRow = Selectable<DB['brandRequestVotes']>
