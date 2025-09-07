import { type DB } from '@src/db'
import type { Selectable } from 'kysely'

export type UserRow = Selectable<DB['users']>
