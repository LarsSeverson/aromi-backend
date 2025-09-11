import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: ['**/*.graphql', '!src/graphql/schema.graphql'],
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
          User: '../features/users/types.js#IUserSummary',

          Brand: '../features/brands/types.js#IBrandSummary',

          FragranceRequest: '../features/fragranceRequests/types.js#IFragranceRequestSummary',

          BrandRequest: '../features/brandRequests/types.js#IBrandRequestSummary',

          AccordRequest: '../features/accordRequests/types.js#IAccordRequestSummary',

          NoteRequest: '../features/noteRequests/types.js#INoteRequestSummary'
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
