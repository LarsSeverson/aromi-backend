import { type FragranceImage, type FragranceResolvers } from '@src/generated/gql-types'
import { generateSignedUrl } from '@src/common/s3'

const IMAGES_QUERY = `--sql
  SELECT
    id,
    s3_key AS url
  FROM fragrance_images
  WHERE fragrance_id = $1
  LIMIT $2
  OFFSET $3
`

export const images: FragranceResolvers['images'] = async (parent, args, context, info) => {
  const { id } = parent
  const { pool } = context
  const { limit = 5, offset = 0 } = args

  const values = [id, limit, offset]
  const { rows } = await pool.query<FragranceImage>(IMAGES_QUERY, values)

  const signedImgs = await Promise.all(rows.map<Promise<FragranceImage>>(async image => {
    try {
      const url = await generateSignedUrl(image.url)
      return { id: image.id, url }
    } catch (error) {
      return { id: image.id, url: '' }
    }
  }))

  return signedImgs
}
