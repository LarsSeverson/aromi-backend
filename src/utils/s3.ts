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
