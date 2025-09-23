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

          Fragrance: '../features/fragrances/types.js#IFragranceSummary',
          FragranceEdit: '../features/fragrances/types.js#IFragranceEditSummary',
          FragranceRequest: '../features/fragrances/types.js#IFragranceRequestSummary',

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
