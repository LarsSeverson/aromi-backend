import type { Asset } from '@src/graphql/gql-types.js'

export interface IAssetResult extends Omit<Partial<Asset>, 'sizeBytes'> {
  sizeBytes?: string | null
}

export type AssetLoaderKey = string