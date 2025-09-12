import type { DataSources } from '@src/datasources/DataSources.js'
import { MQueueService } from '../MQueueService.js'
import type { SearchSyncJobName, SearchSyncJobPayload } from './types.js'

export class SearchSyncQueueService extends MQueueService<SearchSyncJobName, SearchSyncJobPayload> {
  getJobId<J extends SearchSyncJobName>(
    jobName: J,
    data: SearchSyncJobPayload[J]
  ): string {
    return `${jobName}:${data.fragranceId}`
  }

  constructor (sources: DataSources) {
    super(sources, 'search-sync')
  }
}