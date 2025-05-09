import { type QueryResolvers, type Resolvers } from '@src/generated/gql-types'
import { GraphQLDateTime } from 'graphql-scalars'
import { FragranceResolvers } from './fragranceResolvers'

const fragranceResolvers = new FragranceResolvers()

export class ApiResolvers implements Resolvers {
  Date = GraphQLDateTime

  Query: QueryResolvers = {
    fragrance: fragranceResolvers.fragrance,
    fragrances: fragranceResolvers.fragrances
  }
}
