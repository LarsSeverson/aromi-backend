import { voteOnFragrance } from './fragrance/vote-on-fragrance'
import { voteOnAccord } from './fragrance/vote-on-accord'
import { voteOnNote } from './fragrance/vote-on-note'
import { voteOnTrait } from './fragrance/vote-on-trait'
import { reviewFragrance } from './fragrance/review-fragrance'
import { voteOnReview } from './fragrance/vote-on-review'
import { type MutationResolvers } from '@src/generated/gql-types'
import { createCollection } from './user/create-collection'
import { addFragranceToCollection } from './fragrance/add-fragrance-to-collection'
import { logIn } from './auth/log-in'
import { refresh } from './auth/refresh'
import { logOut } from './auth/log-out'
import { forgotPassword } from './auth/forgot-password'
import { confirmForgotPassword } from './auth/confirm-forgot-password'
import { signUp } from './auth/sign-up'

export const Mutation: MutationResolvers = {
  refresh,
  logIn,
  logOut,
  signUp,
  forgotPassword,
  confirmForgotPassword,

  voteOnFragrance,
  voteOnTrait,
  voteOnAccord,
  voteOnNote,
  voteOnReview,
  reviewFragrance,
  addFragranceToCollection,

  createCollection
}
