import { INVALID_ID, RequestStatus, unwrapOrThrow } from '@aromi/shared'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { RelationshipStatus, type UserResolvers } from '@src/graphql/gql-types.js'
import { RequestPaginationFactory } from '@src/features/requests/factories/RequestPaginationFactory.js'
import { mapFragranceRequestRowToFragranceRequest, mapFragranceReviewRowToFragranceReview } from '@src/features/fragrances/utils/mappers.js'
import { mapBrandRequestRowToBrandRequestSummary } from '@src/features/brands/utils/mappers.js'
import { mapAccordRequestRowToAccordRequestSummary } from '@src/features/accords/utils/mappers.js'
import { mapNoteRequestRowToNoteRequestSummary } from '@src/features/notes/utils/mappers.js'
import { FragranceCollectionPaginationFactory, FragranceReviewPaginationFactory } from '@src/features/fragrances/index.js'
import { UserFollowPaginationFactory } from '../factories/UserPaginationFactory.js'
import { UserLikesPaginationFactory } from '../factories/UserLikesPaginationFactory.js'
import { VOTE_TYPES } from '@src/utils/constants.js'

export class UserFieldResolvers extends BaseResolver<UserResolvers> {
  private readonly requestPagination = new RequestPaginationFactory()
  private readonly collectionPagination = new FragranceCollectionPaginationFactory()
  private readonly reviewPagination = new FragranceReviewPaginationFactory()
  private readonly userFollowPagination = new UserFollowPaginationFactory()
  private readonly userLikesPagination = new UserLikesPaginationFactory()

  email: UserResolvers['email'] = (
    parent,
    args,
    context,
    info
  ) => {
    const { id, email } = parent
    const { me } = context

    if (me?.id !== id) return null

    return email ?? null
  }

  avatar: UserResolvers['avatar'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { avatarId } = parent
    const { loaders } = context

    if (avatarId == null) return null

    const { users } = loaders

    const image = await unwrapOrThrow(users.images.load(avatarId))

    return image
  }

  followerCount: UserResolvers['followerCount'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { loaders } = context

    const count = await unwrapOrThrow(
      loaders.users.loadFollowerCount(id)
    )

    return count
  }

  followingCount: UserResolvers['followingCount'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { loaders } = context

    const count = await unwrapOrThrow(
      loaders.users.loadFollowingCount(id)
    )

    return count
  }

  collection: UserResolvers['collection'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { id: collectionId } = args
    const { services } = context

    const { users } = services

    const collection = await unwrapOrThrow(
      users.collections.findOne(
        where => where.and([
          where('id', '=', collectionId),
          where('userId', '=', id)
        ])
      )
    )

    return collection
  }

  collections: UserResolvers['collections'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { input } = args
    const { services } = context

    const { users } = services
    const pagination = this.collectionPagination.parse(input)

    const collections = await unwrapOrThrow(
      users
        .collections
        .find(
          eb => eb('userId', '=', id),
          { pagination }
        )
    )

    const connection = this.pageFactory.paginate(collections, pagination)

    return connection
  }

  likes: UserResolvers['likes'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { input } = args
    const { services } = context

    const { fragrances } = services
    const pagination = this.userLikesPagination.parse(input)

    const likes = await unwrapOrThrow(
      fragrances.votes.find(
        where => where.and([
          where('userId', '=', id),
          where('vote', '=', VOTE_TYPES.UPVOTE)
        ]),
        { pagination }
      )
    )

    const connection = this.pageFactory.paginate(likes, pagination)

    return connection
  }

  review: UserResolvers['review'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { id: reviewId } = args
    const { services } = context

    const { users } = services

    const review = await unwrapOrThrow(
      users.reviews.findOne(
        where => where.and([
          where('id', '=', reviewId),
          where('userId', '=', id)
        ])
      )
    )

    return mapFragranceReviewRowToFragranceReview(review)
  }

  reviews: UserResolvers['reviews'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { input } = args
    const { services } = context

    const { users } = services
    const pagination = this.reviewPagination.parse(input)

    const reviews = await unwrapOrThrow(
      users
        .reviews
        .find(
          eb => eb('userId', '=', id),
          { pagination }
        )
    )

    const connection = this.pageFactory.paginate(reviews, pagination)
    const transformed = this.pageFactory.transform(connection, mapFragranceReviewRowToFragranceReview)

    return transformed
  }

  fragranceRequests: UserResolvers['fragranceRequests'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { input } = args
    const { me, services } = context

    const { fragrances } = services
    const { status } = input ?? {}
    const pagination = this.requestPagination.parse(input)

    const requests = await unwrapOrThrow(
      fragrances
        .requests
        .find(
          eb => {
            if (status === RequestStatus.DRAFT) {
              return eb.and([
                eb('userId', '=', id),
                eb('requestStatus', '=', RequestStatus.DRAFT),
                eb('userId', '=', me?.id ?? INVALID_ID)
              ])
            }

            return eb.and([
              eb('userId', '=', id),
              eb.or([
                eb('requestStatus', '!=', RequestStatus.DRAFT),
                eb.and([
                  eb('requestStatus', '=', RequestStatus.DRAFT),
                  eb('userId', '=', me?.id ?? INVALID_ID)
                ])
              ])
            ])
          },
          { pagination }
        )
    )

    const connection = this.pageFactory.paginate(requests, pagination)
    const transformed = this.pageFactory.transform(connection, mapFragranceRequestRowToFragranceRequest)

    return transformed
  }

  brandRequests: UserResolvers['brandRequests'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { input } = args
    const { me, services } = context

    const { brands } = services
    const { status } = input ?? {}
    const pagination = this.requestPagination.parse(input)

    const requests = await unwrapOrThrow(
      brands
        .requests
        .find(
          eb => {
            if (status === RequestStatus.DRAFT) {
              return eb.and([
                eb('userId', '=', id),
                eb('requestStatus', '=', RequestStatus.DRAFT),
                eb('userId', '=', me?.id ?? INVALID_ID)
              ])
            }

            return eb.and([
              eb('userId', '=', id),
              eb.or([
                eb('requestStatus', '!=', RequestStatus.DRAFT),
                eb.and([
                  eb('requestStatus', '=', RequestStatus.DRAFT),
                  eb('userId', '=', me?.id ?? INVALID_ID)
                ])
              ])
            ])
          },
          { pagination }
        )
    )

    const connection = this.pageFactory.paginate(requests, pagination)
    const transformed = this.pageFactory.transform(connection, mapBrandRequestRowToBrandRequestSummary)

    return transformed
  }

  accordRequests: UserResolvers['accordRequests'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { input } = args
    const { me, services } = context

    const { accords } = services
    const { status } = input ?? {}
    const pagination = this.requestPagination.parse(input)

    const requests = await unwrapOrThrow(
      accords
        .requests
        .find(
          eb => {
            if (status === RequestStatus.DRAFT) {
              return eb.and([
                eb('userId', '=', id),
                eb('requestStatus', '=', RequestStatus.DRAFT),
                eb('userId', '=', me?.id ?? INVALID_ID)
              ])
            }

            return eb.and([
              eb('userId', '=', id),
              eb.or([
                eb('requestStatus', '!=', RequestStatus.DRAFT),
                eb.and([
                  eb('requestStatus', '=', RequestStatus.DRAFT),
                  eb('userId', '=', me?.id ?? INVALID_ID)
                ])
              ])
            ])
          },
          { pagination }
        )
    )

    const connection = this.pageFactory.paginate(requests, pagination)
    const transformed = this.pageFactory.transform(connection, mapAccordRequestRowToAccordRequestSummary)

    return transformed
  }

  noteRequests: UserResolvers['noteRequests'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { input } = args
    const { me, services } = context

    const { notes } = services
    const { status } = input ?? {}
    const pagination = this.requestPagination.parse(input)

    const requests = await unwrapOrThrow(
      notes
        .requests
        .find(
          eb => {
            if (status === RequestStatus.DRAFT) {
              return eb.and([
                eb('userId', '=', id),
                eb('requestStatus', '=', RequestStatus.DRAFT),
                eb('userId', '=', me?.id ?? INVALID_ID)
              ])
            }

            return eb.and([
              eb('userId', '=', id),
              eb.or([
                eb('requestStatus', '!=', RequestStatus.DRAFT),
                eb.and([
                  eb('requestStatus', '=', RequestStatus.DRAFT),
                  eb('userId', '=', me?.id ?? INVALID_ID)
                ])
              ])
            ])
          },
          { pagination }
        )
    )

    const connection = this.pageFactory.paginate(requests, pagination)
    const transformed = this.pageFactory.transform(connection, mapNoteRequestRowToNoteRequestSummary)

    return transformed
  }

  followers: UserResolvers['followers'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { input } = args
    const { services } = context

    const { users } = services
    const pagination = this.userFollowPagination.parse(input)

    const followers = await unwrapOrThrow(
      users.follows.find(where => where('followedId', '=', id), { pagination })
    )

    const connection = this.pageFactory.paginate(followers, pagination)
    const transformed = this.pageFactory.transform(connection, follow => ({
      ...follow,
      id: `follower:${follow.followerId}`,
      userId: follow.followerId
    }))

    return transformed
  }

  following: UserResolvers['following'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { input } = args
    const { services } = context

    const { users } = services
    const pagination = this.userFollowPagination.parse(input)

    const following = await unwrapOrThrow(
      users.follows.find(where => where('followerId', '=', id), { pagination })
    )

    const connection = this.pageFactory.paginate(following, pagination)
    const transformed = this.pageFactory.transform(connection, follow => ({
      ...follow,
      id: `following:${follow.followedId}`,
      userId: follow.followedId
    }))

    return transformed
  }

  relationship: UserResolvers['relationship'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id: targetUserId } = parent
    const { me, loaders } = context
    const { users } = loaders

    if (me == null || me.id === targetUserId) return RelationshipStatus.None

    const { isFollowing, isFollowedBy } = await unwrapOrThrow(
      users.loadRelationship(me.id, targetUserId)
    )

    if (isFollowing && isFollowedBy) return RelationshipStatus.Mutual
    if (isFollowing) return RelationshipStatus.Following
    if (isFollowedBy) return RelationshipStatus.Follower

    return RelationshipStatus.None
  }

  getResolvers (): UserResolvers {
    return {
      email: this.email,
      avatar: this.avatar,
      followerCount: this.followerCount,
      followingCount: this.followingCount,
      collection: this.collection,
      collections: this.collections,
      likes: this.likes,
      review: this.review,
      reviews: this.reviews,
      fragranceRequests: this.fragranceRequests,
      brandRequests: this.brandRequests,
      accordRequests: this.accordRequests,
      noteRequests: this.noteRequests,
      followers: this.followers,
      following: this.following,
      relationship: this.relationship
    }
  }
}
