import { ApolloServerErrorCode } from '@apollo/server/errors'
import { GraphQLError, type GraphQLFormattedError } from 'graphql'
import { NoResultError } from 'kysely'
import { type MeiliSearchApiError } from 'meilisearch'

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

  static fromDatabase (error: unknown): ApiError {
    error = error as Error
    if (error instanceof NoResultError) {
      return new ApiError('RESOURCE_NOT_FOUND', 'Resource not found', 404, error)
    }
    return new ApiError('DB_QUERY_FAILED', 'Something went wrong. Please try again later', 500, error)
  }

  static fromCognito (error: Error): ApiError {
    const mapping = COGNITO_ERROR_TO_API_ERROR[error.name]
    if (mapping != null) return new ApiError(mapping.code, mapping.message, mapping.status, error)
    return new ApiError('AUTH_SERVICE_ERROR', 'Something went wrong. Please try again later', 500, error)
  }

  static fromS3 (error: Error): ApiError {
    const mapping = S3_ERROR_TO_API_ERROR[error.name]
    if (mapping != null) return new ApiError(mapping.code, mapping.message, mapping.status, error)
    return new ApiError('S3_SERVICE_ERROR', 'Something went wrong. Please try again later', 500, error)
  }

  static fromMeili (error: unknown): ApiError {
    const code = (error as MeiliSearchApiError)?.cause?.code

    if (code == null) {
      return new ApiError(
        'MEILI_SERVICE_ERROR',
        'Something went wrong searching. Please try again later',
        500,
        error
      )
    }

    const mapping = MEILI_ERROR_TO_API_ERROR[code]
    if (mapping != null) return new ApiError(mapping.code, mapping.message, mapping.status, error)
    return new ApiError('MEILI_SERVICE_ERROR', 'Something went wrong. Please try again later', 500, error)
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
    return new ApiError('GRAPHQL_VALIDATION_FAILED', 'Invalid query', 400, error)
      .serialize()
  }

  return new ApiError('INTERNAL_ERROR', 'Something went wrong on our end. Please try again later', 500, error)
    .serialize()
}

export const COGNITO_ERROR_TO_API_ERROR: Record<string, ApiError> = {
  NotAuthorizedException: new ApiError('NOT_AUTHORIZED', 'Incorrect email or password', 401),
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
  InvalidParameterException: new ApiError('INVALID_PARAMETER', 'Invalid input provided', 400),
  AccessDeniedException: new ApiError('ACCESS_DENIED', 'Access denied to this operation', 403),
  ResourceNotFoundException: new ApiError('RESOURCE_NOT_FOUND', 'Cognito resource not found', 500)
} as const

export const S3_ERROR_TO_API_ERROR: Record<string, ApiError> = {
  AccessDenied: new ApiError('S3_ACCESS_DENIED', 'You do not have permission to access this resource', 403),
  NoSuchBucket: new ApiError('S3_NO_SUCH_BUCKET', 'The requested bucket does not exist', 404),
  NoSuchKey: new ApiError('S3_NO_SUCH_KEY', 'The requested file does not exist', 404),
  InvalidBucketName: new ApiError('S3_INVALID_BUCKET_NAME', 'Invalid bucket name', 400),
  InvalidObjectState: new ApiError('S3_INVALID_OBJECT_STATE', 'Invalid object state for the requested operation', 400),
  EntityTooLarge: new ApiError('S3_FILE_TOO_LARGE', 'The uploaded file is too large', 413),
  SlowDown: new ApiError('S3_TOO_MANY_REQUESTS', 'Too many requests to S3, please slow down', 429),
  NotFound: new ApiError('S3_NO_OBJECT', 'The requested asset does not exist', 404)
} as const

export const MEILI_ERROR_TO_API_ERROR: Record<string, ApiError> = {
  index_not_found: new ApiError('MEILI_INDEX_NOT_FOUND', 'The requested search index was not found', 404),
  invalid_api_key: new ApiError('MEILI_INVALID_API_KEY', 'Invalid API key provided to search service', 403),
  missing_authorization_header: new ApiError('MEILI_MISSING_AUTH', 'Missing authorization header for search', 401),
  invalid_request: new ApiError('MEILI_INVALID_REQUEST', 'Invalid request made to search service', 400),
  internal: new ApiError('MEILI_INTERNAL_ERROR', 'Search service encountered an internal error', 500)
} as const

export const throwError = (error: unknown): never => {
  throw error
}
