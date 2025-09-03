import { type DB } from '@src/generated/db-schema'
import { type BrandRequest } from '@src/generated/gql-types'
import { type Selectable } from 'kysely'

export type BrandRequestRow = Selectable<DB['brandRequests']>
export type BrandRequestImageRow = Selectable<DB['brandRequestImages']>
export type BrandRequestVoteRow = Selectable<DB['brandRequestVotes']>

export interface IBrandRequestSummary extends Omit<BrandRequest, 'image' | 'user' | 'votes'> { }

export type BrandRequestLoadersKey = string
