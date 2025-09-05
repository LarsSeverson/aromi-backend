import { type DB } from '@generated/db-schema'
import type { Selectable } from 'kysely'

export type UserRow = Selectable<DB['users']>
