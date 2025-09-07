import { type Brand } from '@src/graphql/gql-types'

export interface IBrandSummary extends Omit<Brand, 'image'> {}
