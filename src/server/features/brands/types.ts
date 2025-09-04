import { type Brand } from '@src/generated/gql-types'

export interface IBrandSummary extends Omit<Brand, 'image'> {}
