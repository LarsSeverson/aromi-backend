import { type NoteRequest } from '@generated/gql-types'

export interface INoteRequestSummary extends Omit<NoteRequest, 'image' | 'user' | 'votes'> {}

export type NoteRequestLoadersKey = string
