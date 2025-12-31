import type { DataSources } from '@src/datasources/DataSources.js'
import { MQueueService } from '../MQueueService.js'
import { INDEXATION_JOB_NAMES, type IndexationJobName, type IndexationJobPayload } from './types.js'
import { QUEUE_NAMES } from '@src/queues/types.js'

const jobKeyBuilders = {
  [INDEXATION_JOB_NAMES.INDEX_FRAGRANCE]:
    (data: IndexationJobPayload[typeof INDEXATION_JOB_NAMES.INDEX_FRAGRANCE]) => data.fragranceId,
  [INDEXATION_JOB_NAMES.INDEX_BRAND]:
    (data: IndexationJobPayload[typeof INDEXATION_JOB_NAMES.INDEX_BRAND]) => data.brandId,
  [INDEXATION_JOB_NAMES.INDEX_ACCORD]:
    (data: IndexationJobPayload[typeof INDEXATION_JOB_NAMES.INDEX_ACCORD]) => data.accordId,
  [INDEXATION_JOB_NAMES.INDEX_NOTE]:
    (data: IndexationJobPayload[typeof INDEXATION_JOB_NAMES.INDEX_NOTE]) => data.noteId,

  [INDEXATION_JOB_NAMES.UPDATE_FRAGRANCE]:
    (data: IndexationJobPayload[typeof INDEXATION_JOB_NAMES.UPDATE_FRAGRANCE]) => data.id,
  [INDEXATION_JOB_NAMES.UPDATE_BRAND]:
    (data: IndexationJobPayload[typeof INDEXATION_JOB_NAMES.UPDATE_BRAND]) => data.id,
  [INDEXATION_JOB_NAMES.UPDATE_ACCORD]:
    (data: IndexationJobPayload[typeof INDEXATION_JOB_NAMES.UPDATE_ACCORD]) => data.id,
  [INDEXATION_JOB_NAMES.UPDATE_NOTE]:
    (data: IndexationJobPayload[typeof INDEXATION_JOB_NAMES.UPDATE_NOTE]) => data.id,
  [INDEXATION_JOB_NAMES.INDEX_USER]:
    (data: IndexationJobPayload[typeof INDEXATION_JOB_NAMES.INDEX_USER]) => data.userId,

  [INDEXATION_JOB_NAMES.INDEX_POST]:
    (data: IndexationJobPayload[typeof INDEXATION_JOB_NAMES.INDEX_POST]) => data.id,
  [INDEXATION_JOB_NAMES.UPDATE_POST]:
    (data: IndexationJobPayload[typeof INDEXATION_JOB_NAMES.UPDATE_POST]) => data.id,
  [INDEXATION_JOB_NAMES.DELETE_POST]:
    (data: IndexationJobPayload[typeof INDEXATION_JOB_NAMES.DELETE_POST]) => data.id,

  [INDEXATION_JOB_NAMES.INDEX_POST_COMMENT]:
    (data: IndexationJobPayload[typeof INDEXATION_JOB_NAMES.INDEX_POST_COMMENT]) => data.id,
  [INDEXATION_JOB_NAMES.UPDATE_POST_COMMENT]:
    (data: IndexationJobPayload[typeof INDEXATION_JOB_NAMES.UPDATE_POST_COMMENT]) => data.id,
  [INDEXATION_JOB_NAMES.DELETE_POST_COMMENT]:
    (data: IndexationJobPayload[typeof INDEXATION_JOB_NAMES.DELETE_POST_COMMENT]) => data.id
}

export class IndexationQueueService extends MQueueService<IndexationJobName, IndexationJobPayload> {
  constructor (sources: DataSources) {
    super(sources, QUEUE_NAMES.INDEXATION)
  }

  getJobId<J extends IndexationJobName>(
    jobName: J,
    data: IndexationJobPayload[J]
  ): string {
    const builder = jobKeyBuilders[jobName] as (data: IndexationJobPayload[J]) => string
    return `${jobName}-${builder(data)}`
  }
}