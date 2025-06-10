import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: ['src/**/schema.graphql', '!src/generated/**'],
  generates: {
    'src/generated/gql-types.ts': {
      config: {
        useIndexSignature: true,
        enumsAsConst: true,
        contextType: '@src/context#ApiContext',
        defaultMapper: 'Partial<{T}>',
        scalars: {
          Date: 'Date',
          JSON: 'Record<string, any>'
        },
        mappers: {
          Fragrance: '../schemas/fragrance/mappers#FragranceSummary',
          FragranceEdge: '../schemas/fragrance/mappers#FragranceSummaryEdge',
          FragranceReview: '../schemas/fragrance/mappers#FragranceReviewSummary',
          FragranceReviewEdge: '../schemas/fragrance/mappers#FragranceReviewSummaryEdge',
          FragranceNotes: '../schemas/fragrance/mappers#FragranceNotesSummary',
          FragranceCollection: '../schemas/fragrance/mappers#FragranceCollectionSummary',
          FragranceCollectionEdge: '../schemas/fragrance/mappers#FragranceCollectionSummaryEdge',
          FragranceCollectionItem: '../schemas/fragrance/mappers#FragranceCollectionItemSummary',
          FragranceCollectionItemEdge: '../schemas/fragrance/mappers#FragranceCollectionItemSummaryEdge',
          FragranceVote: '../schemas/fragrance/mappers#FragranceVoteSummary',
          FragranceVoteEdge: '../schemas/fragrance/mappers#FragranceVoteSummaryEdge',

          User: '../schemas/user/mappers#UserSummary',
          UserReview: '../schemas/user/mappers#UserReviewSummary',
          UserReviewEdge: '../schemas/user/mappers#UserReviewSummaryEdge'
        }
      },
      plugins: ['typescript', 'typescript-resolvers']
    },
    'src/generated/schema.graphql': {
      plugins: ['schema-ast']
    }
  }
}

export default config
