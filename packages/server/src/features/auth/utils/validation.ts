import { ValidUserEmail, ValidUserPassowrd } from '@aromi/shared'
import z from 'zod'

export const ValidConfirmationCode = z
  .string()
  .nonempty('Code is required')
  .length(6)
  .regex(/^\d{6}$/, 'Code must be a 6-digit number')

export const LogInSchema = z
  .object({
    email: ValidUserEmail,
    password: ValidUserPassowrd
  })

export const SignUpSchema = z
  .object({
    email: ValidUserEmail,
    password: ValidUserPassowrd
  })

export const ConfirmSignUpSchema = z
  .object({
    email: ValidUserEmail,
    code: ValidConfirmationCode
  })

export const ResendSignUpCodeSchema = z
  .object({
    email: ValidUserEmail
  })

export const ForgotPasswordSchema = z
  .object({
    email: ValidUserEmail
  })

export const ConfirmForgotPasswordSchema = z
  .object({
    email: ValidUserEmail,
    code: ValidConfirmationCode,
    password: ValidUserPassowrd
  })

export const ChangePasswordSchema = z
  .object({
    oldPassword: ValidUserPassowrd,
    newPassword: ValidUserPassowrd
  })
  .strip()