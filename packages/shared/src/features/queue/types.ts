export const QUEUE_NAMES = {
  PROMOTION: 'promotion'
} as const

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES]

export type JobPayload<J extends string, P = Record<string, unknown>> = Record<J, P>

export type JobPayloadKey = keyof JobPayload<string>

export interface EnqueueParams<M extends JobPayload<string>, J extends keyof M & string> {
  jobName: J
  data: M[J]
}
