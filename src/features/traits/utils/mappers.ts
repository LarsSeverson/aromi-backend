import { TraitTypeEnum } from '@src/generated/gql-types'

export const GQLTraitToDBTrait: Record<TraitTypeEnum, string> = {
  APPEAL: 'Appeal',
  BALANCE: 'Balance',
  COMPLEXITY: 'Complexity',
  GENDER: 'Gender',
  LONGEVITY: 'Longevity',
  PROJECTION: 'Projection'
}

export const DBTraitToGQLTrait: Record<string, TraitTypeEnum> = {
  Appeal: TraitTypeEnum.Appeal,
  Balance: TraitTypeEnum.Balance,
  Complexity: TraitTypeEnum.Complexity,
  Gender: TraitTypeEnum.Gender,
  Longevity: TraitTypeEnum.Longevity,
  Projection: TraitTypeEnum.Projection
}
