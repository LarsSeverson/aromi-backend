import type { DB } from '@src/db/index.js'
import type { Selectable } from 'kysely'

export type UserRow = Selectable<DB['users']>
export type UserImageRow = Selectable<DB['userImages']>
