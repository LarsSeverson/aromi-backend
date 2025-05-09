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

          User: '../schemas/user/mappers#UserSummary'
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
