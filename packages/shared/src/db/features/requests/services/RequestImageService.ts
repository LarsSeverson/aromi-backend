import { FeaturedTableService } from '@src/db/services/FeaturedTableService.js'
import type { SomeRequestImageRow } from '../types.js'

export abstract class RequestImageService<I extends SomeRequestImageRow> extends FeaturedTableService<I> {}