export const REVISION_JOB_NAMES = {
  REVISE_FRAGRANCE: 'revise-fragrance',
  REVISE_BRAND: 'revise-brand',
  REVISE_ACCORD: 'revise-accord',
  REVISE_NOTE: 'revise-note'
} as const

export type RevisionJobName = (typeof REVISION_JOB_NAMES)[keyof typeof REVISION_JOB_NAMES]

export interface RevisionJobPayload {
  [REVISION_JOB_NAMES.REVISE_FRAGRANCE]: { editId: string }
  [REVISION_JOB_NAMES.REVISE_BRAND]: { editId: string }
  [REVISION_JOB_NAMES.REVISE_ACCORD]: { editId: string }
  [REVISION_JOB_NAMES.REVISE_NOTE]: { editId: string }
}

export type RevisionJobData = RevisionJobPayload[keyof RevisionJobPayload]