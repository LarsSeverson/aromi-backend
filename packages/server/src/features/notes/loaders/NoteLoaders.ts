import { BaseLoader } from '@src/loaders/BaseLoader.js'
import type { NoteLoadersKey } from '../types.js'
import DataLoader from 'dataloader'
import { type NoteImageRow, throwError } from '@aromi/shared'

export class NoteLoaders extends BaseLoader<NoteLoadersKey> {
  getThumbnailLoader () {
    const key = this.genKey('thumbnail')
    return this
      .getLoader(
        key,
        () => this.createThumbnailLoader()
      )
  }

  private createThumbnailLoader () {
    const { images } = this.services.notes

    return new DataLoader<NoteLoadersKey, NoteImageRow | null>(async keys => {
      return await images
        .findDistinct(
          eb => eb('noteImages.noteId', 'in', keys)
        )
        .match(
          rows => {
            const map = new Map<string, NoteImageRow>()

            rows.forEach(row => {
              if (!map.has(row.noteId)) map.set(row.noteId, row)
            })

            return keys.map(id => map.get(id) ?? null)
          },
          throwError
        )
    })
  }
}