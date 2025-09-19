import type { Note, NoteEdit } from '@src/graphql/gql-types.js'

export interface INoteSummary extends Omit<Note, 'thumbnail'> {}
export interface INoteEditSummary extends Omit<NoteEdit, 'note' | 'user' | 'reviewedBy'> {
  noteId: string
  userId: string
  reviewedBy: string | null
  proposedThumbnailId: string | null
}

export type NoteLoadersKey = string