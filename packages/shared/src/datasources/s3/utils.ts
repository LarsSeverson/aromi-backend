import { nanoid } from 'nanoid'
import path from 'node:path'
import type { S3Entity } from './types.js'

export interface UtilKeyReturn {
  id: string
  key: string
}

const withIdFileName = (fileName: string): { id: string, name: string } => {
  const id = nanoid(8)
  const ext = path.extname(fileName)
  return {
    id,
    name: `${id}${ext}`
  }
}

const AVATARS = 'avatars'
const AVATAR_UPLOADS = `${AVATARS}/uploads`

export const genAvatarUploadKey = (userId: string): { id: string, key: string } => {
  const id = nanoid(8)
  return {
    id,
    key: `${AVATAR_UPLOADS}/${userId}/${id}.orig`
  }
}

export const IMAGES = 'images'

export const genImageKey = (
  entity: S3Entity,
  fileName: string
): UtilKeyReturn => {
  const { id, name } = withIdFileName(fileName)
  return {
    id,
    key: `${IMAGES}/${entity}/${name}`
  }
}
