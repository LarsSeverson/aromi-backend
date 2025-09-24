export const S3_ENTITIES = [
  'fragrances',
  'brands',
  'accords',
  'notes',
  'users'
] as const

export type S3Entity = (typeof S3_ENTITIES)[number]
