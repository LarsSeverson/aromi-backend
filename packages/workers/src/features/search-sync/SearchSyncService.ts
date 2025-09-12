import { QUEUE_NAMES } from '@aromi/shared'
import type { SearchSyncJobPayload } from '@aromi/shared/src/queues/services/search-sync/types.js'
import type { WorkerContext } from '@src/context/WorkerContext.js'
import { WorkerService } from '@src/services/WorkerService.js'

export class SearchSyncService extends WorkerService<keyof SearchSyncJobPayload, SearchSyncJobPayload> {
  constructor (context: WorkerContext) {
    super(QUEUE_NAMES.SEARCH_SYNC, context)
  }
}