export const QUEUE_NAMES = {
  PROMOTION: 'promotion'
} as const

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES]

export interface BaseJobPayload extends Record<string, unknown> {
  id: string
}

export type JobPayload<J extends string> = {
  [K in J]: BaseJobPayload
}

export interface EnqueueParams<M extends JobPayload<string>, J extends keyof M & string> {
  jobName: J
  data: M[J]
}
