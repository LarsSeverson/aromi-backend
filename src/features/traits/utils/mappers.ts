import { type TraitTypeEnum } from '@src/generated/gql-types'

export const GQLTraitToDBTrait: Record<TraitTypeEnum, string> = {
  APPEAL: 'Appeal',
  BALANCE: 'Balance',
  COMPLEXITY: 'Complexity',
  GENDER: 'Gender',
  LONGEVITY: 'Longevity',
  PROJECTION: 'Projection'
}
