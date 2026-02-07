import type { DB } from '@src/db/index.js'
import type { Selectable } from 'kysely'

export type TraitRow = Selectable<DB['traits']>
export type TraitOptionRow = Selectable<DB['traitOptions']>

export interface CombinedTraitRow {
  traitType: TraitRow
  fragranceTraitOption: TraitOptionRow
}

export interface CombinedTraitRow2 extends TraitRow {
  optionId: string
  optionLabel: string
  optionScore: number
}