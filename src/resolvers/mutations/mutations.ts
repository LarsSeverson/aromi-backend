import { logIn } from './auth/log-in'
import { refresh } from './auth/refresh'
import { logOut } from './auth/log-out'
import { forgotPassword } from './auth/forgot-password'
import { confirmForgotPassword } from './auth/confirm-forgot-password'
import { signUp } from './auth/sign-up'
import { confirmSignUp } from './auth/confirm-sign-up'
import { resendSignUpConfirmationCode } from './auth/resend-sign-up-confirmation-code'
import { type MutationResolvers } from '@src/generated/gql-types'

export const Mutation: MutationResolvers = {
  refresh,
  logIn,
  logOut,
  signUp,
  confirmSignUp,
  forgotPassword,
  confirmForgotPassword,
  resendSignUpConfirmationCode
}
