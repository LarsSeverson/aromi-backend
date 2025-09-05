export const WORKER_KEYS = {
  TEST_JOB: 'test_job',
  PROMOTE_REQUESTS: 'promote_requests'
} as const

export type WorkerKey = (typeof WORKER_KEYS)[keyof typeof WORKER_KEYS]
