export const PRESIGNED_EXP = 3600
export const SIGNED_CDN_URL_EXP = (): string => new Date(Date.now() + 3600 * 1000).toISOString() // 1 hr
