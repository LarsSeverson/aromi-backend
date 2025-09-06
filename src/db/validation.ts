import z from 'zod'

export const ValidVersion = z
  .number()
  .int()
  .nonnegative()

export const VALID_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp'
]
