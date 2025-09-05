import { type Brand } from '@generated/gql-types'

export interface IBrandSummary extends Omit<Brand, 'image'> {}
