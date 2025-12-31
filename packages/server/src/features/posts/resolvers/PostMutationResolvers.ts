import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { CreatePostResolver } from '../helpers/CreatePostResolver.js'
import { UpdatePostResolver } from '../helpers/UpdatePostResolver.js'
import { DeletePostResolver } from '../helpers/DeletePostResolver.js'
import { PostCommentMutationResolvers } from './PostCommentMutationResolvers.js'
import { VoteOnPostResolver } from '../helpers/VoteOnPostResolver.js'

export class PostMutationResolvers extends BaseResolver<MutationResolvers> {
  comments = new PostCommentMutationResolvers()

  createPost: MutationResolvers['createPost'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new CreatePostResolver({ parent, args, context, info })
    return await resolver.resolve()
  }

  updatePost: MutationResolvers['updatePost'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new UpdatePostResolver({ parent, args, context, info })
    return await resolver.resolve()
  }

  deletePost: MutationResolvers['deletePost'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new DeletePostResolver({ parent, args, context, info })
    return await resolver.resolve()
  }

  voteOnPost: MutationResolvers['voteOnPost'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new VoteOnPostResolver({ parent, args, context, info })
    return await resolver.resolve()
  }

  getResolvers (): MutationResolvers {
    return {
      createPost: this.createPost,
      updatePost: this.updatePost,
      deletePost: this.deletePost,
      voteOnPost: this.voteOnPost,
      ...this.comments.getResolvers()
    }
  }
}