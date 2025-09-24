import { BaseLoader } from '@src/loaders/BaseLoader.js'
import type { NoteLoadersKey } from '../types.js'
import DataLoader from 'dataloader'
import { BackendError, type NoteImageRow, unwrapOrThrow } from '@aromi/shared'
import { ResultAsync } from 'neverthrow'
import { NoteImageLoaders } from './NoteImageLoaders.js'
import type { ServerServices } from '@src/services/ServerServices.js'

export class NoteLoaders extends BaseLoader<NoteLoadersKey> {
  images: NoteImageLoaders

  constructor (services: ServerServices) {
    super(services)
    this.images = new NoteImageLoaders(services)
  }

  loadThumbnail (key: NoteLoadersKey) {
    return ResultAsync.fromPromise(
      this
        .getThumbnailLoader()
        .load(key),
      error => BackendError.fromLoader(error)
    )
  }

  private getThumbnailLoader () {
    const key = this.genKey('thumbnail')
    return this
      .getLoader(
        key,
        () => this.createThumbnailLoader()
      )
  }

  private createThumbnailLoader () {
    const { images } = this.services.notes

    return new DataLoader<NoteLoadersKey, NoteImageRow | null>(
      async keys => {
        const thumbnails = await unwrapOrThrow(
          images
            .findDistinct(
              eb => eb('noteImages.noteId', 'in', keys),
              'noteId'
            )
        )

        const map = new Map(thumbnails.map(img => [img.noteId, img]))

        return keys.map(key => map.get(key) ?? null)
      }
    )
  }
}