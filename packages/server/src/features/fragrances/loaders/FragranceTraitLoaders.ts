import { BackendError, type TraitOptionRow, unwrapOrThrow } from '@aromi/shared'
import { BaseLoader } from '@src/loaders/BaseLoader.js'
import DataLoader from 'dataloader'
import { ResultAsync } from 'neverthrow'
import { FragranceTraitOptionLoaders } from './FragranceTraitOptionLoaders.js'
import type { ServerServices } from '@src/services/ServerServices.js'

export class FragranceTraitLoaders extends BaseLoader {
  options: FragranceTraitOptionLoaders

  constructor (services: ServerServices) {
    super(services)
    this.options = new FragranceTraitOptionLoaders(services)
  }

  loadOptions (traitTypeId: string) {
    return ResultAsync.fromPromise(
      this.getOptionsLoader().load(traitTypeId),
      error => BackendError.fromLoader(error)
    )
  }

  private getOptionsLoader () {
    const key = this.genKey('options')

    return this.getLoader(
      key,
      () => this.createOptionsLoader()
    )
  }

  private createOptionsLoader () {
    const { traits } = this.services

    return new DataLoader<string, TraitOptionRow[]>(
      async ids => {
        const rows = await unwrapOrThrow(
          traits.findOptions(
            where => where('traits.id', 'in', ids)
          )
        )

        const rowsMap = new Map<string, TraitOptionRow[]>()

        rows.forEach(row => {
          const list = rowsMap.get(row.traitTypeId) ?? []
          list.push(row)
          rowsMap.set(row.traitTypeId, list)
        })

        return ids.map(id => rowsMap.get(id) ?? [])
      }
    )
  }
}