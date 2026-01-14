import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { CreatePostCommentResolver } from '../helpers/CreatePostCommentResolver.js'
import { UpdatePostCommentResolver } from '../helpers/UpdatePostCommentResolver.js'
import { DeletePostCommentResolver } from '../helpers/DeletePostCommentResolver.js'
import { VoteOnPostCommentResolver } from '../helpers/VoteOnPostCommentResolver.js'

export class PostCommentMutationResolvers extends BaseResolver<MutationResolvers> {
  createPostComment: MutationResolvers['createPostComment'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new CreatePostCommentResolver({ parent, args, context, info })
    return await resolver.resolve()
  }

  updatePostComment: MutationResolvers['updatePostComment'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new UpdatePostCommentResolver({ parent, args, context, info })
    return await resolver.resolve()
  }

  deletePostComment: MutationResolvers['deletePostComment'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new DeletePostCommentResolver({ parent, args, context, info })
    return await resolver.resolve()
  }

  voteOnPostComment: MutationResolvers['voteOnPostComment'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new VoteOnPostCommentResolver({ parent, args, context, info })
    return await resolver.resolve()
  }

  getResolvers (): MutationResolvers {
    return {
      createPostComment: this.createPostComment,
      updatePostComment: this.updatePostComment,
      deletePostComment: this.deletePostComment,
      voteOnPostComment: this.voteOnPostComment
    }
  }
}