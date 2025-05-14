import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: ['src/**/schema.graphql', '!src/generated/**'],
  generates: {
    'src/generated/gql-types.ts': {
      config: {
        useIndexSignature: true,
        contextType: '@src/context#ApiContext',
        defaultMapper: 'Partial<{T}>',
        scalars: {
          Date: 'Date'
        },
        mappers: {
          Fragrance: '../schemas/fragrance/mappers#FragranceSummary',
          FragranceEdge: '../schemas/fragrance/mappers#FragranceSummaryEdge',
          FragranceReview: '../schemas/fragrance/mappers#FragranceReviewSummary',
          FragranceReviewEdge: '../schemas/fragrance/mappers#FragranceReviewSummaryEdge',
          FragranceNotes: '../schemas/fragrance/mappers#FragranceNotesSummary',

          User: '../schemas/user/mappers#UserSummary',
          UserCollection: '../schemas/user/mappers#UserCollectionSummary',
          UserCollectionEdge: '../schemas/user/mappers#UserCollectionSummaryEdge',
          UserCollectionItem: '../schemas/user/mappers#UserCollectionItemSummary',
          UserCollectionItemEdge: '../schemas/user/mappers#UserCollectionItemSummaryEdge'
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
