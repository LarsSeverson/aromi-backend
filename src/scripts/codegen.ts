import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: ['src/**/schema.graphql', '!src/generated/**'],
  generates: {
    'src/generated/gql-types.ts': {
      config: {
        useIndexSignature: true,
        contextType: '@src/context#Context'
      },
      plugins: ['typescript', 'typescript-resolvers']
    },
    'src/generated/schema.graphql': {
      plugins: ['schema-ast']
    }
  }
}

export default config
