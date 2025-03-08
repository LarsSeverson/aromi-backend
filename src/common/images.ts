import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { s3 } from '@src/datasources'

export const generateSignedUrl = async (key: string): Promise<string> => {
  const bucket = process.env.S3_BUCKET
  if (bucket === undefined || bucket === '') return ''

  const command = new GetObjectCommand({ Bucket: bucket, Key: key })
  const url = await getSignedUrl(s3, command, { expiresIn: 3600 })

  return url ?? ''
}

export const getSignedImages = async <T extends Record<K, string>, K extends string>(images: T[], key: K): Promise<T[]> => {
  return await Promise.all(images.map(async image => {
    try {
      const url = await generateSignedUrl(image[key])
      return { ...image, [key]: url }
    } catch (error) {
      return { ...image, [key]: '' }
    }
  }))
}
