import { ResultAsync } from 'neverthrow'
import { ApiError } from '@src/utils/error.js'

export const streamToBuffer = (stream: NodeJS.ReadableStream): ResultAsync<Buffer, ApiError> => {
  const read = async (): Promise<Buffer> => {
    const chunks: Uint8Array[] = []
    for await (const chunk of stream) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
    }
    return Buffer.concat(chunks)
  }

  return ResultAsync
    .fromPromise(
      read(),
      (error) => new ApiError('READ_STREAM_ERROR', 'Failed to read stream', 500, error)
    )
}
