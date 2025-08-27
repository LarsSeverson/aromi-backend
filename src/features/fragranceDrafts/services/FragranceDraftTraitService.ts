import { TableService } from '@src/services/TableService'
import { type DraftTraitResult, type FragranceDraftTraitRow } from '../types'
import { type DataSources } from '@src/datasources'
import { ResultAsync } from 'neverthrow'
import { ApiError } from '@src/common/error'

export class FragranceDraftTraitService extends TableService<'fragranceDraftTraits', FragranceDraftTraitRow> {
  constructor (sources: DataSources) {
    super(sources, 'fragranceDraftTraits')
  }

  getDraftTrait (
    draftId: string,
    traitType: string
  ): ResultAsync<DraftTraitResult | null | undefined, ApiError> {
    const { db } = this.sources

    return ResultAsync
      .fromPromise(
        db
          .selectFrom('traitTypes as tt')
          .leftJoin('fragranceDraftTraits as fdt', join =>
            join
              .onRef('fdt.traitTypeId', '=', 'tt.id')
              .on('fdt.draftId', '=', draftId)
          )
          .leftJoin('traitOptions as to2', 'to2.id', 'fdt.traitOptionId')
          .select([
            'tt.id as traitTypeId',
            'to2.id as optionId',
            'to2.label as optionLabel',
            'to2.score as optionScore'
          ])
          .where('tt.name', '=', traitType)
          .executeTakeFirst(),
        error => ApiError.fromDatabase(error)
      )
  }
}
