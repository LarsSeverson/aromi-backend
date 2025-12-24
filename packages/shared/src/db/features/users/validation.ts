import { VALID_IMAGE_TYPES } from '@src/db/validation.js'
import z from 'zod'

export const MIN_PASSWORD_LENGTH = 8
export const MAX_PASSWORD_LENGTH = 128
export const MAX_USER_AVATAR_SIZE = 5_000_000 // 5 MB

export const ValidUserEmail = z
  .email('Please enter a valid email address')
  .toLowerCase()

export const ValidUserPassowrd = z
  .string('Password must be a string')
  .min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`)
  .max(MAX_PASSWORD_LENGTH, `Password must be at most ${MAX_PASSWORD_LENGTH} characters long`)

export const ValidUserAvatarType = z
  .enum(VALID_IMAGE_TYPES, 'Image must be a JPEG, PNG, or WEBP')

export const ValidUserAvatarSize = z
  .number()
  .int()
  .max(MAX_USER_AVATAR_SIZE, 'Image size cannot exceed 5 MB')

export const ValidUserAvatar = z
  .object({
    contentType: ValidUserAvatarType.nonoptional('Image type is required'),
    contentSize: ValidUserAvatarSize.nonoptional('Image size is required')
  })
  .strip()

export const ValidUser = z
  .object({
    email: ValidUserEmail.nonoptional('Email is required'),
    password: ValidUserPassowrd.nonoptional('Password is required')
  })
  .strip()