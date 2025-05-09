import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { ResultAsync } from 'neverthrow'
import { ApiError } from './error'
import { type ApiDataSources } from '@src/datasources/datasources'

const generateSignedUrl = (
  s3: ApiDataSources['s3'],
  s3Key: string
): ResultAsync<string, ApiError> => {
  const { client, bucket } = s3

  return ResultAsync.fromPromise(
    getSignedUrl(
      client,
      new GetObjectCommand({ Bucket: bucket, Key: s3Key }),
      { expiresIn: 3600 }
    ),
    e => new ApiError('SIGNED_URL_ERROR', 'Failed to generate signed URL', 500, e)
  )
    .map(url => url ?? '')
}

export interface SignParams {
  s3: ApiDataSources['s3']
  src: string
}

export const sign = async (params: SignParams): Promise<string> => {
  const { s3, src } = params

  return await generateSignedUrl(s3, src)
    .match(
      url => url,
      () => ''
    )
}

export interface SignAllParams {
  s3: ApiDataSources['s3']
  srcs: string[]
}

export const signAll = async (params: SignAllParams): Promise<string[]> => {
  const { s3, srcs } = params

  return await Promise.all(
    srcs.map(async src => await sign({ s3, src }))
  )
}

export type MergeSignedSrcOn = Record<string, unknown> & { src: string }
export interface MergeSignedSrcParams {
  s3: ApiDataSources['s3']
  on: MergeSignedSrcOn
}

export const mergeSignedSrc = async (params: MergeSignedSrcParams): Promise<MergeSignedSrcOn> => {
  const { s3, on } = params
  on.src = await sign({ s3, src: on.src })
  return on
}

export interface MergeAllSignedSrcsParams {
  s3: ApiDataSources['s3']
  on: MergeSignedSrcOn[]
}

export const mergeAllSignedSrcs = async (params: MergeAllSignedSrcsParams): Promise<MergeSignedSrcOn[]> => {
  const { s3, on: ons } = params

  return await Promise.all(
    ons.map(async on => await mergeSignedSrc({ s3, on }))
  )
}
