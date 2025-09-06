import { ApolloServerErrorCode } from '@apollo/server/errors'
import { GraphQLError, type GraphQLFormattedError } from 'graphql'
import { NoResultError } from 'kysely'
import { type Result } from 'neverthrow'
import type z from 'zod'

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
    if (error instanceof NoResultError) {
      return new ApiError('RESOURCE_NOT_FOUND', 'Resource not found', 404, error)
    }
    return new ApiError('DB_QUERY_FAILED', 'Something went wrong. Please try again later', 500, error)
  }

  static fromCognito (error: unknown): ApiError {
    const typed = error as Error
    const mapping = COGNITO_ERROR_TO_API_ERROR[typed.name]
    if (mapping != null) return new ApiError(mapping.code, mapping.message, mapping.status, error)
    return new ApiError('AUTH_SERVICE_ERROR', 'Something went wrong. Please try again later', 500, error)
  }

  static fromS3 (error: unknown): ApiError {
    const typed = error as Error
    const mapping = S3_ERROR_TO_API_ERROR[typed.name]
    if (mapping != null) return new ApiError(mapping.code, mapping.message, mapping.status, error)
    return new ApiError('S3_SERVICE_ERROR', 'Something went wrong. Please try again later', 500, error)
  }

  static fromMeili (error: unknown): ApiError {
    const typed = error as Error
    const mapping = MEILI_ERROR_TO_API_ERROR[typed.name]
    if (mapping != null) return new ApiError(mapping.code, mapping.message, mapping.status, error)
    return new ApiError('SEARCH_SERVICE_ERROR', 'Something went wrong with search. Please try again later', 500, error)
  }

  static fromMQ (error: unknown): ApiError {
    const typed = error as Error
    const mapping = MQ_ERROR_TO_API_ERROR[typed.name]
    if (mapping != null) {
      return new ApiError(mapping.code, mapping.message, mapping.status, error)
    }
    return new ApiError(
      'QUEUE_SERVICE_ERROR',
      'Something went wrong with the queue. Please try again later',
      500,
      error
    )
  }

  static fromZod <T>(error: z.ZodError<T>): ApiError {
    return new ApiError('INVALID_INPUT', error.issues.at(0)?.message ?? 'Invalid input', 400, error)
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
  UsernameExistsException: new ApiError('USER_EXISTS', 'A user with this email already exists', 403),
  UserNotFoundException: new ApiError('NOT_AUTHORIZED', 'Incorrect email or password', 401),
  UserNotConfirmedException: new ApiError('NOT_CONFIRMED', 'You have not yet confirmed your account', 403),
  PasswordResetRequiredException: new ApiError('PASSWORD_RESET_REQUIRED', 'A password reset is required', 403),
  CodeMismatchException: new ApiError('CODE_MISMATCH', 'Invalid verification code provided', 400),
  ExpiredCodeException: new ApiError('EXPIRED_CODE', 'This code has expired. Please request a new one to reset your password', 400),
  LimitExceededException: new ApiError('LIMIT_EXCEEDED', 'Attempt limit exceeded, please try again later', 429),
  InvalidPasswordException: new ApiError('INVALID_PASSWORD', 'Incorrect email or password', 400),
  CodeDeliveryFailureException: new ApiError('CODE_DELIVERY_FAILURE', 'Failed to deliver verification code', 500),
  TooManyRequestsException: new ApiError('TOO_MANY_REQUESTS', 'Too many requests, please slow down', 429),
  InvalidParameterException: new ApiError('INVALID_PARAMETER', 'Invalid input provided', 400),
  AccessDeniedException: new ApiError('ACCESS_DENIED', 'Access denied to this operation', 403),
  ResourceNotFoundException: new ApiError('RESOURCE_NOT_FOUND', 'Something went wrong on our end. Please try again', 500)
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
  MeiliSearchCommunicationError: new ApiError('SEARCH_COMMUNICATION_ERROR', 'Could not reach search service', 503),
  MeiliSearchApiError: new ApiError('SEARCH_API_ERROR', 'Search service returned an error', 502),
  MeiliSearchError: new ApiError('SEARCH_ERROR', 'Unexpected search service error', 500),
  TimeoutError: new ApiError('SEARCH_TIMEOUT', 'Search request timed out', 504)
} as const

export const MQ_ERROR_TO_API_ERROR: Record<string, ApiError> = {
  QueueClosedError: new ApiError('QUEUE_CLOSED', 'The queue is closed', 500),
  ConnectionError: new ApiError('QUEUE_CONNECTION_ERROR', 'Could not connect to queue service', 503),
  TimeoutError: new ApiError('QUEUE_TIMEOUT', 'Queue request timed out', 504),
  UnknownCommandError: new ApiError('QUEUE_UNKNOWN_COMMAND', 'Invalid queue command issued', 500)
} as const

export const throwError = (error: unknown): never => {
  throw error
}

export const partitionResults = <T, E> (results: Array<Result<T, E>>): [T[], E[]] => {
  const oks = results
    .filter(r => r.isOk())
    .map(r => r.value)

  const errs = results
    .filter(r => r.isErr())
    .map(r => r.error)

  return [oks, errs]
}
