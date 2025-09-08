import z from 'zod'

export const VALID_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp'
]

export const ValidVersion = z
  .number()
  .int()
  .nonnegative()

export const ValidWebsite = z
  .url('Website must be a valid URL')
  .max(2000, 'Website cannot exceed 2000 characters')
