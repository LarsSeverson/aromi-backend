import type { Note } from '@src/graphql/gql-types.js'

export interface INoteSummary extends Omit<Note, 'thumbnail'> {}

export type NoteLoadersKey = string