import { BaseLoader } from '@src/loaders/BaseLoader'
import { type FragranceDraftLoadersKey } from './types'
import DataLoader from 'dataloader'
import { type FragranceDraftImageRow } from '../types'
import { throwError } from '@src/common/error'

export class FragranceDraftLoaders extends BaseLoader<FragranceDraftLoadersKey> {
  getImageLoader (): DataLoader<FragranceDraftLoadersKey, FragranceDraftImageRow | null> {
    const key = this.genKey('image')
    return this
      .getLoader(
        key,
        () => this.createImageLoader()
      )
  }

  private createImageLoader (): DataLoader<FragranceDraftLoadersKey, FragranceDraftImageRow | null> {
    const { images } = this.services.fragranceDrafts

    return new DataLoader<FragranceDraftLoadersKey, FragranceDraftImageRow | null>(async keys => {
      return await images
        .find(
          eb => eb('fragranceDraftImages.draftId', 'in', keys)
        )
        .match(
          rows => {
            const map = new Map<string, FragranceDraftImageRow>()

            rows.forEach(row => {
              if (!map.has(row.draftId)) {
                map.set(row.draftId, row)
              }
            })

            return keys.map(id => map.get(id) ?? null)
          },
          throwError
        )
    })
  }
}
