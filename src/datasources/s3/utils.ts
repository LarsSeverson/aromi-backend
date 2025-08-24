import { nanoid } from 'nanoid'
import path from 'path'

export interface UtilKeyReturn {
  id: string
  key: string
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

const FRAGRANCE_DRAFTS = 'fragrance-drafts'

const withIdFileName = (fileName: string): { id: string, name: string } => {
  const id = nanoid(8)
  const ext = path.extname(fileName)
  return {
    id,
    name: `${id}${ext}`
  }
}

export const genFragranceDraftsKey = (
  draftId: string,
  fileName: string
): UtilKeyReturn => {
  const { id, name } = withIdFileName(fileName)
  return {
    id,
    key: `${FRAGRANCE_DRAFTS}/${draftId}/${name}`
  }
}
