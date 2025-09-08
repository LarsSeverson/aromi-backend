import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: ['**/*.graphql'],
  generates: {
    'src/graphql/gql-types.ts': {
      config: {
        useIndexSignature: true,
        enumsAsConst: true,
        contextType: '@src/context#ServerContext',
        defaultMapper: 'Partial<{T}>',
        scalars: {
          Date: 'Date',
          JSON: 'Record<string, any>'
        },
        mappers: {
          User: '../features/users/types#IUserSummary',

          Brand: '../features/brands/types#IBrandSummary',

          FragranceRequest: '../features/fragranceRequests/types#IFragranceRequestSummary',

          BrandRequest: '../features/brandRequests/types#IBrandRequestSummary',

          AccordRequest: '../features/accordRequests/types#IAccordRequestSummary',

          NoteRequest: '../features/noteRequests/types#INoteRequestSummary'
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
