export const S3_ENTITIES = [
  'fragrances',
  'brands',
  'accords',
  'notes'
] as const

export type S3Entity = (typeof S3_ENTITIES)[number]
