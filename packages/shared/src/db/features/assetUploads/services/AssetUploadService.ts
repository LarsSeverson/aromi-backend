import type { AssetUploadRow } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'
import { FeaturedTableService } from '@src/db/services/FeaturedTableService.js'

export class AssetUploadService extends FeaturedTableService<AssetUploadRow> {
  constructor (sources: DataSources) {
    super(sources, 'assetUploads')
  }
}