import type { DataSources } from '@src/datasources/DataSources.js'
import { MQueueService } from '../MQueueService.js'
import type { RevisionJobName, RevisionJobPayload } from './types.js'

export class RevisionQueueService extends MQueueService<RevisionJobName, RevisionJobPayload> {
  constructor (sources: DataSources) {
    super(sources, 'revision')
  }

  getJobId<K extends RevisionJobName>(
    jobName: K,
    data: RevisionJobPayload[K]
  ): string {
    return `${jobName}:${data.editId}`
  }
}