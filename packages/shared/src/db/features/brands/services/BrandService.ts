import type { DataSources } from '@src/datasources/index.js'
import { BrandImageService } from './BrandImageService.js'
import type { BrandRow } from '../types.js'
import { FeaturedTableService } from '@src/db/services/FeaturedTableService.js'
import { BrandEditService } from './BrandEditService.js'
import { BrandRequestService } from './BrandRequestService.js'

export class BrandService extends FeaturedTableService<BrandRow> {
  images: BrandImageService
  edits: BrandEditService
  requests: BrandRequestService

  constructor (sources: DataSources) {
    super(sources, 'brands')

    this.images = new BrandImageService(sources)
    this.edits = new BrandEditService(sources)
    this.requests = new BrandRequestService(sources)
  }
}
