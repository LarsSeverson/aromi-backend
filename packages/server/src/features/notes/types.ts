import type { Note, NoteEdit, NoteRequest } from '@src/graphql/gql-types.js'

export interface INoteSummary extends Omit<Note, 'thumbnail'> {}

export interface INoteEditSummary extends Omit<NoteEdit, 'note' | 'user' | 'reviewedBy'> {
  noteId: string
  userId: string
  reviewedBy: string | null
  proposedThumbnailId: string | null
}

export interface INoteRequestSummary extends Omit<NoteRequest, 'image' | 'user' | 'votes'> {
  assetId: string | null
  userId: string
}

export type NoteLoadersKey = string
export type NoteRequestLoadersKey = string
