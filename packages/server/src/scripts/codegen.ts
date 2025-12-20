import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: ['src/**/*.graphql', '!src/graphql/schema.graphql'],
  generates: {
    'src/graphql/gql-types.ts': {
      config: {
        useIndexSignature: true,
        enumsAsConst: true,
        contextType: '@src/context/index.js#ServerContext',
        defaultMapper: 'Partial<{T}>',
        scalars: {
          Date: 'Date',
          JSON: 'Record<string, any>'
        },
        mappers: {
          Asset: '../features/assets/types.js#IAssetResult',

          User: '../features/users/types.js#IUserSummary',
          UserFollow: '../features/users/types.js#IUserFollowSummary',

          Fragrance: '../features/fragrances/types.js#IFragranceSummary',
          FragranceImage: '../features/fragrances/types.js#IFragranceImageSummary',
          FragranceEdit: '../features/fragrances/types.js#IFragranceEditSummary',
          FragranceRequest: '../features/fragrances/types.js#IFragranceRequestSummary',
          FragranceCollection: '../features/fragrances/types.js#IFragranceCollectionSummary',
          FragranceCollectionItem: '../features/fragrances/types.js#IFragranceCollectionItemSummary',
          FragranceReview: '../features/fragrances/types.js#IFragranceReviewSummary',

          Brand: '../features/brands/types.js#IBrandSummary',
          BrandEdit: '../features/brands/types.js#IBrandEditSummary',
          BrandRequest: '../features/brands/types.js#IBrandRequestSummary',

          AccordEdit: '../features/accords/types.js#IAccordEditSummary',
          AccordRequest: '../features/accords/types.js#IAccordRequestSummary',

          Note: '../features/notes/types.js#INoteSummary',
          NoteEdit: '../features/notes/types.js#INoteEditSummary',
          NoteRequest: '../features/notes/types.js#INoteRequestSummary'
        }
      },
      plugins: ['typescript', 'typescript-resolvers']
    },
    'src/graphql/schema.graphql': {
      plugins: ['schema-ast']
    }
  }
}

export default config
