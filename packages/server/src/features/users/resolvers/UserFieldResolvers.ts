import { INVALID_ID, RequestStatus, unwrapOrThrow } from '@aromi/shared'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import type { UserResolvers } from '@src/graphql/gql-types.js'
import { RequestPaginationFactory } from '@src/features/requests/factories/RequestPaginationFactory.js'
import { mapFragranceRequestRowToFragranceRequest, mapFragranceReviewRowToFragranceReview, mapFragranceRowToFragranceSummary } from '@src/features/fragrances/utils/mappers.js'
import { mapBrandRequestRowToBrandRequestSummary } from '@src/features/brands/utils/mappers.js'
import { mapAccordRequestRowToAccordRequestSummary } from '@src/features/accords/utils/mappers.js'
import { mapNoteRequestRowToNoteRequestSummary } from '@src/features/notes/utils/mappers.js'
import { FragranceCollectionPaginationFactory, FragranceReviewPaginationFactory } from '@src/features/fragrances/index.js'

export class UserFieldResolvers extends BaseResolver<UserResolvers> {
  private readonly requestPagination = new RequestPaginationFactory()
  private readonly collectionPagination = new FragranceCollectionPaginationFactory()
  private readonly reviewPagination = new FragranceReviewPaginationFactory()

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
    const pagination = this.collectionPagination.parse(input)

    const likedFragrances = await unwrapOrThrow(
      fragrances.findLikedFragrances(id, { pagination })
    )

    const connection = this.pageFactory.paginate(likedFragrances, pagination)
    const transformed = this.pageFactory.transform(connection, mapFragranceRowToFragranceSummary)

    return transformed
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

  getResolvers (): UserResolvers {
    return {
      email: this.email,
      avatar: this.avatar,
      collection: this.collection,
      collections: this.collections,
      likes: this.likes,
      review: this.review,
      reviews: this.reviews,
      fragranceRequests: this.fragranceRequests,
      brandRequests: this.brandRequests,
      accordRequests: this.accordRequests,
      noteRequests: this.noteRequests
    }
  }
}
