import z from 'zod'

export const ValidEmail = z
  .string()
  .nonempty('Email is required')
  .regex(
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    'Please enter a valid email address'
  )

export const ValidPassword = z
  .string()
  .nonempty('Password is required')
  .min(8, 'Password must be at least 8 characters long')

export const ValidConfirmationCode = z
  .string()
  .nonempty('Code is required')
  .length(6)
  .regex(/^\d{6}$/, 'Code must be a 6-digit number')

export const LogInSchema = z
  .object({
    email: ValidEmail,
    password: ValidPassword
  })

export const SignUpSchema = z
  .object({
    email: ValidEmail,
    password: ValidPassword
  })

export const ConfirmSignUpSchema = z
  .object({
    email: ValidEmail,
    code: ValidConfirmationCode
  })

export const ResendSignUpCodeSchema = z
  .object({
    email: ValidEmail
  })

export const ForgotPasswordSchema = z
  .object({
    email: ValidEmail
  })

export const ConfirmForgotPasswordSchema = z
  .object({
    email: ValidEmail,
    code: ValidConfirmationCode,
    password: ValidPassword
  })
