import { s3 } from '@src/graphql/schema/datasources'

export const generateSignedUrl = async (key: string): Promise<string> => {
  const bucket = process.env.S3_BUCKET || null
  if (!bucket) return ''

  return s3.getSignedUrlPromise('getObject', {
    Bucket: bucket,
    Key: key,
    Expires: 60
  })
}
