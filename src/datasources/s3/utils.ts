import { nanoid } from 'nanoid'
import path from 'path'

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

const FRAGRANCE_REQUESTS = 'fragrance-requests'

export const genFragranceRequestsKey = (
  requestId: string,
  fileName: string
): UtilKeyReturn => {
  const { id, name } = withIdFileName(fileName)
  return {
    id,
    key: `${FRAGRANCE_REQUESTS}/${requestId}/${name}`
  }
}

export const BRAND_REQUESTS = 'brand-requests'

export const genBrandRequestsKey = (
  requestId: string,
  fileName: string
): UtilKeyReturn => {
  const { id, name } = withIdFileName(fileName)
  return {
    id,
    key: `${BRAND_REQUESTS}/${requestId}/${name}`
  }
}

export const ACCORD_REQUESTS = 'accord-requests'

export const genAccordRequestsKey = (
  requestId: string,
  fileName: string
): UtilKeyReturn => {
  const { id, name } = withIdFileName(fileName)
  return {
    id,
    key: `${ACCORD_REQUESTS}/${requestId}/${name}`
  }
}

export const NOTE_REQUESTS = 'note-requests'

export const genNoteRequestsKey = (
  requestId: string,
  fileName: string
): UtilKeyReturn => {
  const { id, name } = withIdFileName(fileName)
  return {
    id,
    key: `${NOTE_REQUESTS}/${requestId}/${name}`
  }
}
