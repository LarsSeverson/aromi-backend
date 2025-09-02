import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: ['src/**/*.graphql', '!src/generated/**'],
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
    'src/generated/schema.graphql': {
      plugins: ['schema-ast']
    }
  }
}

export default config
