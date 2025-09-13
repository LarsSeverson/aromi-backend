import { QUEUE_NAMES } from '@aromi/shared'
import { SEARCH_SYNC_JOB_NAMES, type SearchSyncJobPayload } from '@aromi/shared/src/queues/services/search-sync/types.js'
import type { WorkerContext } from '@src/context/WorkerContext.js'
import { WorkerService } from '@src/services/WorkerService.js'
import { FragranceSearchSyncer } from '../jobs/FragranceSearchSyncer.js'

export class SearchSyncService extends WorkerService<keyof SearchSyncJobPayload, SearchSyncJobPayload> {
  constructor (context: WorkerContext) {
    super(QUEUE_NAMES.SEARCH_SYNC, context)

    const { sources } = context

    this
      .register(
        SEARCH_SYNC_JOB_NAMES.SYNC_FRAGRANCE,
        new FragranceSearchSyncer(sources)
      )
  }
}