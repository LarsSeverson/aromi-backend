import type { Brand } from '@src/graphql/gql-types.js'

export interface IBrandSummary extends Omit<Brand, 'avatar'> {}
