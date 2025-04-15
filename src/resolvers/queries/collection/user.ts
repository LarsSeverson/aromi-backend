import { type FragranceCollectionResolvers } from '@src/generated/gql-types'
import { type CollectionUserKey } from '@src/loaders/collection-user-loader'

export const collectionUser: FragranceCollectionResolvers['user'] = async (parent, args, context, info) => {
  const { id: collectionId, user: parentUser } = parent
  if (parentUser != null) return parentUser

  const { dataLoaders } = context

  const key: CollectionUserKey = { collectionId }
  const user = await dataLoaders.collectionUser.load(key)

  return user
}
