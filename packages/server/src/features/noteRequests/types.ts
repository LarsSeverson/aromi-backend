import type { NoteRequest } from '@src/graphql/gql-types.js'

export interface INoteRequestSummary extends Omit<NoteRequest, 'image' | 'user' | 'votes'> {}

export type NoteRequestLoadersKey = string
