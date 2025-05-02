import { ApolloServerErrorCode } from '@apollo/server/errors'
import { GraphQLError, type GraphQLFormattedError } from 'graphql'

export class ApiError extends GraphQLError {
  readonly code: string
  readonly status: number
  readonly details?: unknown

  constructor (code: string, message: string, status: number, details?: unknown) {
    super(message, { extensions: { code, status, details } })

    this.code = code
    this.message = message
    this.status = status
    this.details = details
  }

  serialize (): GraphQLFormattedError {
    const { message, extensions } = this

    return {
      message,
      extensions
    }
  }
}

export const formatApiError = (formattedError: GraphQLFormattedError, error: unknown): GraphQLFormattedError => {
  const { extensions } = formattedError

  if (extensions?.code != null && extensions?.status != null) return formattedError
  if (extensions?.code === ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED) {
    return new ApiError('GRAPHQL_VALIDATION_FAILED', 'Invalid query', 400).serialize()
  }

  return new ApiError('INTERNAL_ERROR', 'Something went wrong on our end. Please try again later', 500).serialize()
}

export const COGNITO_ERROR_TO_API_ERROR: Record<string, ApiError> = {
  NotAuthorizedException: new ApiError('NOT_AUTHORIZED', 'Incorrect username or password', 401),
  UsernameExistsException: new ApiError('USERNAME_EXISTS', 'An account with this email already exists', 400),
  UserNotFoundException: new ApiError('USER_NOT_FOUND', "We couldn't find an account with this email address", 404),
  UserNotConfirmedException: new ApiError('USER_NOT_CONFIRMED', 'This account is not yet confirmed', 403),
  PasswordResetRequiredException: new ApiError('PASSWORD_RESET_REQUIRED', 'A password reset is required', 403),
  CodeMismatchException: new ApiError('CODE_MISMATCH', 'Invalid verification code provided', 400),
  ExpiredCodeException: new ApiError('EXPIRED_CODE', 'This code has expired. Please request a new one to reset your password', 400),
  LimitExceededException: new ApiError('LIMIT_EXCEEDED', 'Attempt limit exceeded, please try again later', 429),
  InvalidPasswordException: new ApiError('INVALID_PASSWORD', 'Password does not conform to policy', 400),
  CodeDeliveryFailureException: new ApiError('CODE_DELIVERY_FAILURE', 'Failed to deliver verification code', 500),
  TooManyRequestsException: new ApiError('TOO_MANY_REQUESTS', 'Too many requests, please slow down', 429),
  InvalidParameterException: new ApiError('INVALID_PARAMETER', 'Invalid input provided', 400)
} as const

export const mapCognitoError = (error: Error): ApiError => {
  const mapping = COGNITO_ERROR_TO_API_ERROR[error.name]

  if (mapping != null) return new ApiError(mapping.code, mapping.message, mapping.status, error)

  return new ApiError('AUTH_SERVICE_ERROR', 'Something went wrong with authentication. Please try again later', 500, error)
}
