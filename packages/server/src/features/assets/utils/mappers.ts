import { ValidAccordThumbnail, ValidBrandAvatar, ValidFragranceImage, ValidNoteThumbnail, type S3Entity } from '@aromi/shared'
import { AssetKey } from '@src/graphql/gql-types.js'

export const mapAssetKeyToS3Entity = (key: AssetKey): S3Entity => {
  switch (key) {
    case AssetKey.FragranceImages: return 'fragrances'
    case AssetKey.BrandImages: return 'brands'
    case AssetKey.AccordImages: return 'accords'
    case AssetKey.NoteImages: return 'notes'
  }
}

export const mapAssetKeyToSchema = (key: AssetKey) => {
  switch (key) {
    case AssetKey.FragranceImages: return ValidFragranceImage
    case AssetKey.BrandImages: return ValidBrandAvatar
    case AssetKey.AccordImages: return ValidAccordThumbnail
    case AssetKey.NoteImages: return ValidNoteThumbnail
  }
}