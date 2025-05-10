import { type QueryResolvers, type Resolvers, type FragranceResolvers as FragranceFieldResolvers } from '@src/generated/gql-types'
import { GraphQLDateTime } from 'graphql-scalars'
import { FragranceResolvers } from './fragranceResolvers'

const fragranceResolvers = new FragranceResolvers()

export class ApiResolvers implements Resolvers {
  Date = GraphQLDateTime

  Query: QueryResolvers = {
    fragrance: fragranceResolvers.fragrance,
    fragrances: fragranceResolvers.fragrances
  }

  // Field resolvers
  Fragrance: FragranceFieldResolvers = {
    traits: fragranceResolvers.fragranceTraits,
    images: fragranceResolvers.fragranceImages,
    accords: fragranceResolvers.fragranceAccords,
    reviews: fragranceResolvers.fragranceReviews,
    reviewDistribution: fragranceResolvers.fragranceReviewDistribution
  }
}
