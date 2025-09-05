import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: ['src/server/**/*.graphql'],
  generates: {
    'src/generated/gql-types.ts': {
      config: {
        useIndexSignature: true,
        enumsAsConst: true,
        contextType: '@src/server/context#ServerContext',
        defaultMapper: 'Partial<{T}>',
        scalars: {
          Date: 'Date',
          JSON: 'Record<string, any>'
        },
        mappers: {
          User: '../server/features/users/types#IUserSummary',

          Brand: '../server/features/brands/types#IBrandSummary',

          FragranceRequest: '../server/features/fragranceRequests/types#IFragranceRequestSummary',

          BrandRequest: '../server/features/brandRequests/types#IBrandRequestSummary',

          AccordRequest: '../server/features/accordRequests/types#IAccordRequestSummary',

          NoteRequest: '../server/features/noteRequests/types#INoteRequestSummary'
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
