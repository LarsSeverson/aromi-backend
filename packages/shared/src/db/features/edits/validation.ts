import z from 'zod'

export const MIN_REASON_LENGTH = 10
export const MAX_REASON_LENGTH = 1000

export const ValidEditReason = z
  .string()
  .min(MIN_REASON_LENGTH, `Reason must be at least ${MIN_REASON_LENGTH} characters`)
  .max(MAX_REASON_LENGTH, `Reason must be at most ${MAX_REASON_LENGTH} characters`)