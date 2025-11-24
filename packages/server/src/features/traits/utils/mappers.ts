import { TraitTypeEnum } from '@src/graphql/gql-types.js'

export const GQLTraitToDBTrait: Record<TraitTypeEnum, string> = {
  GENDER: 'Gender',
  TIME: 'Time',
  SEASON: 'Season',
  APPEAL: 'Appeal',
  BALANCE: 'Balance',
  COMPLEXITY: 'Complexity',
  LONGEVITY: 'Longevity',
  PROJECTION: 'Projection'
}

export const DBTraitToGQLTrait: Record<string, TraitTypeEnum> = {
  Appeal: TraitTypeEnum.Appeal,
  Time: TraitTypeEnum.Time,
  Season: TraitTypeEnum.Season,
  Balance: TraitTypeEnum.Balance,
  Complexity: TraitTypeEnum.Complexity,
  Gender: TraitTypeEnum.Gender,
  Longevity: TraitTypeEnum.Longevity,
  Projection: TraitTypeEnum.Projection
}
