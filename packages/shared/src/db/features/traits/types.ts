import type { DB } from '@src/db/index.js'
import type { Selectable } from 'kysely'

export type TraitTypeRow = Selectable<DB['traitTypes']>
export type TraitOptionRow = Selectable<DB['traitOptions']>

export interface CombinedTraitRow {
  traitType: TraitTypeRow
  traitOption: TraitOptionRow
}

export interface CombinedTraitRow2 extends TraitTypeRow {
  optionId: string
  optionLabel: string
  optionScore: number
}