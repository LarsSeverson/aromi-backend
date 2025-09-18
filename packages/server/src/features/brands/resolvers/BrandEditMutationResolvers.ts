import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { CreateBrandEditResolver } from '../helpers/CreateBrandEditResolver.js'
import { genImageKey, parseOrThrow, unwrapOrThrow } from '@aromi/shared'
import { StageBrandEditAvatarSchema } from '../utils/validation.js'
import { ReviewBrandEditResolver } from '../helpers/ReviewBrandEditResolver.js'

export class BrandEditMutationResolvers extends BaseResolver<MutationResolvers> {
  createBrandEdit: MutationResolvers['createBrandEdit'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new CreateBrandEditResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  reviewBrandEdit: MutationResolvers['reviewBrandEdit'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new ReviewBrandEditResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  stageBrandEditAvatar: MutationResolvers['stageBrandEditAvatar'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context

    this.checkAuthenticated(context)

    const { fileName } = input
    const { contentType, contentSize } = parseOrThrow(StageBrandEditAvatarSchema, input)

    const { key } = genImageKey('brands', fileName)
    const { assets } = services

    await unwrapOrThrow(
      assets
        .uploads
        .createOne({ s3Key: key, contentType, sizeBytes: String(contentSize) })
    )

    const payload = await unwrapOrThrow(
      assets
        .getPresignedUrl({ key, contentType, maxSizeBytes: contentSize })
    )

    return payload
  }

  getResolvers (): MutationResolvers {
    return {
      createBrandEdit: this.createBrandEdit,
      reviewBrandEdit: this.reviewBrandEdit,
      stageBrandEditAvatar: this.stageBrandEditAvatar
    }
  }
}