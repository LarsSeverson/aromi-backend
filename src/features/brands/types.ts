import { type DB } from '@src/db/schema'
import { type Brand } from '@src/generated/gql-types'
import { type Selectable } from 'kysely'

export type BrandRow = Selectable<DB['brands']>

export interface IBrandSummary extends Omit<Brand, 'image'> {}
