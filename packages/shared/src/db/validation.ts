import z from 'zod'

export const VALID_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp'
] as const

export const ValidVersion = z
  .number()
  .int()
  .nonnegative()

export const ValidWebsite = z
  .url('Website must be a valid URL')
  .max(2000, 'Website cannot exceed 2000 characters')

export const ValidVote = z
  .union(
    [
      z.literal(-1),
      z.literal(0),
      z.literal(1)
    ],
    'Vote must be -1, 0, or 1'
  )
