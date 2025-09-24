import type { Asset } from '@src/graphql/gql-types.js'

export interface IAssetResult extends Partial<Asset> {
  sizeBytes?: string | null
}
export type AssetLoaderKey = string