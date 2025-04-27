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

  return new ApiError('INTERNAL_ERROR', 'Internal server error', 500).serialize()
}

export const COGNITO_ERROR_TO_API_ERROR: Record<string, ApiError> = {
  NotAuthorizedException: new ApiError('NOT_AUTHORIZED', 'Incorrect username or password', 401),
  UserNotFoundException: new ApiError('USER_NOT_FOUND', 'No account found with these credentials', 404),
  UserNotConfirmedException: new ApiError('USER_NOT_CONFIRMED', 'This account is not yet confirmed', 403),
  PasswordResetRequiredException: new ApiError('PASSWORD_RESET_REQUIRED', 'A password reset is required', 403)
} as const

export const mapCognitoError = (error: Error): ApiError => {
  const mapping = COGNITO_ERROR_TO_API_ERROR[error.name]

  if (mapping != null) return new ApiError(mapping.code, mapping.message, mapping.status, error)

  return new ApiError('AUTH_SERVICE_ERROR', 'Authentication service error', 500, error)
}
