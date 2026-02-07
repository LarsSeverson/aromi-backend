import { FragranceTraitTypeEnum } from '@src/graphql/gql-types.js'

export const GQLTraitToDBTrait: Record<FragranceTraitTypeEnum, string> = {
  GENDER: 'Gender',
  TIME: 'Time',
  SEASON: 'Season',
  APPEAL: 'Appeal',
  BALANCE: 'Balance',
  COMPLEXITY: 'Complexity',
  LONGEVITY: 'Longevity',
  PROJECTION: 'Projection'
}

export const DBTraitToGQLTrait: Record<string, FragranceTraitTypeEnum> = {
  Appeal: FragranceTraitTypeEnum.Appeal,
  Time: FragranceTraitTypeEnum.Time,
  Season: FragranceTraitTypeEnum.Season,
  Balance: FragranceTraitTypeEnum.Balance,
  Complexity: FragranceTraitTypeEnum.Complexity,
  Gender: FragranceTraitTypeEnum.Gender,
  Longevity: FragranceTraitTypeEnum.Longevity,
  Projection: FragranceTraitTypeEnum.Projection
}
