export interface PresignUploadParams {
  key: string
  contentType: string
  maxSizeBytes: number
  expiresIn?: number
}
