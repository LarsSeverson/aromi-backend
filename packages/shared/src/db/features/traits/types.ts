import type { DB } from '@src/db/index.js'
import type { Selectable } from 'kysely'

export type TraitTypeRow = Selectable<DB['traitTypes']>
export type TraitOptionRow = Selectable<DB['traitOptions']>
export type TraitVoteRow = Selectable<DB['traitVotes']>

export interface CombinedTraitRow {
  traitType: TraitTypeRow
  traitOption: TraitOptionRow
}
