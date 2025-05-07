import { type QueryResolvers, type Resolvers } from '@src/generated/gql-types'
import { GraphQLDateTime } from 'graphql-scalars'
import { FragranceResolvers } from './fragranceResolvers'

export class ApiResolvers implements Resolvers {
  private readonly fragranceResolvers = new FragranceResolvers()

  Date = GraphQLDateTime

  Query: QueryResolvers = {
    fragrance: this.fragranceResolvers.fragrance
  }
}
