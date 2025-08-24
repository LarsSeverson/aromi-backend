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
          FragranceDraft: '../features/fragranceDrafts/types#IFragranceDraftSummary',
          FragranceDraftImage: '../features/fragranceDrafts/types#IFragranceDraftImageSummary'
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
