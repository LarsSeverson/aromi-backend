import { nanoid } from 'nanoid'

const AVATARS = 'avatars'
const AVATAR_UPLOADS = `${AVATARS}/uploads`

export const genAvatarUploadKey = (userId: string): { id: string, key: string } => {
  const id = nanoid(8)
  return {
    id,
    key: `${AVATAR_UPLOADS}/${userId}/${id}.orig`
  }
}
