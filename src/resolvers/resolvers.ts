import { type QueryResolvers, type Resolvers, type FragranceResolvers as FragranceFieldResolvers, type FragranceNotesResolvers } from '@src/generated/gql-types'
import { GraphQLDateTime } from 'graphql-scalars'
import { FragranceResolvers } from './fragranceResolvers'
import { NoteResolvers } from './noteResolvers'

const fragranceResolvers = new FragranceResolvers()
const noteResolvers = new NoteResolvers()

export class ApiResolvers implements Resolvers {
  Date = GraphQLDateTime

  Query: QueryResolvers = {
    fragrance: fragranceResolvers.fragrance,
    fragrances: fragranceResolvers.fragrances
  }

  // Fragrance Field resolvers
  Fragrance: FragranceFieldResolvers = {
    traits: fragranceResolvers.fragranceTraits,
    images: fragranceResolvers.fragranceImages,
    accords: fragranceResolvers.fragranceAccords,
    notes: fragranceResolvers.fragranceNotes,
    reviews: fragranceResolvers.fragranceReviews,
    reviewDistribution: fragranceResolvers.fragranceReviewDistribution
  }

  // Fragrance Field Note resolvers
  FragranceNotes: FragranceNotesResolvers = {
    top: noteResolvers.notes,
    middle: noteResolvers.notes,
    base: noteResolvers.notes
  }
}
