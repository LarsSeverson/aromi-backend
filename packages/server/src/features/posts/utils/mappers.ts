import type { PostType } from '@aromi/shared'
import type { PostType as GQLPostType } from '@src/graphql/gql-types.js'

export const mapDBPostTypeToGQLPostType = (type: PostType) => {
  return type as GQLPostType
}