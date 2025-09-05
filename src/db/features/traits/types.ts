import type { DB } from '@generated/db-schema'
import type { Selectable } from 'kysely'

export type TraitTypeRow = Selectable<DB['traitTypes']>
export type TraitOptionRow = Selectable<DB['traitOptions']>

export interface CombinedTraitRow {
  traitType: TraitTypeRow
  traitOption: TraitOptionRow
}
