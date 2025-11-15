import { ApolloServerErrorCode } from '@apollo/server/errors'
import { GraphQLError, type GraphQLFormattedError } from 'graphql'
import { NoResultError } from 'kysely'
import type { Result, ResultAsync } from 'neverthrow'
import type z from 'zod'

export class BackendError extends GraphQLError {
  readonly code: string
  readonly status: number
  readonly details?: unknown

  constructor (code: string, message: string, status: number, details?: unknown) {
    const parsedDetails = details instanceof Error
      ? { name: details.name, message: details.message, stack: details.stack }
      : typeof details === 'object'
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        ? JSON.parse(JSON.stringify(details, (_, v) => (typeof v === 'object' ? undefined : v))) as unknown
        : details

    super(message, { extensions: { code, status, details: parsedDetails } })

    this.code = code
    this.message = message
    this.status = status
    this.details = parsedDetails
  }

  static fromDatabase (error: unknown): BackendError {
    if (error instanceof NoResultError) {
      return new BackendError('RESOURCE_NOT_FOUND', 'Resource not found', 404, error)
    }
    return new BackendError('DB_QUERY_FAILED', 'Something went wrong. Please try again later', 500, error)
  }

  static fromCognito (error: unknown): BackendError {
    const typed = error as Error
    const mapping = COGNITO_ERROR_TO_API_ERROR[typed.name]
    if (mapping != null) return new BackendError(mapping.code, mapping.message, mapping.status, error)
    return new BackendError('AUTH_SERVICE_ERROR', 'Something went wrong. Please try again later', 500, error)
  }

  static fromS3 (error: unknown): BackendError {
    const typed = error as Error
    const mapping = S3_ERROR_TO_API_ERROR[typed.name]
    if (mapping != null) return new BackendError(mapping.code, mapping.message, mapping.status, error)
    return new BackendError('S3_SERVICE_ERROR', 'Something went wrong. Please try again later', 500, error)
  }

  static fromMeili (error: unknown): BackendError {
    const typed = error as Error
    const mapping = MEILI_ERROR_TO_API_ERROR[typed.name]
    if (mapping != null) return new BackendError(mapping.code, mapping.message, mapping.status, error)
    return new BackendError('SEARCH_SERVICE_ERROR', 'Something went wrong with search. Please try again later', 500, error)
  }

  static fromMQ (error: unknown): BackendError {
    const typed = error as Error
    const mapping = MQ_ERROR_TO_API_ERROR[typed.name]
    if (mapping != null) {
      return new BackendError(mapping.code, mapping.message, mapping.status, error)
    }
    return new BackendError(
      'QUEUE_SERVICE_ERROR',
      'Something went wrong with the queue. Please try again later',
      500,
      error
    )
  }

  static fromSharp (error: unknown): BackendError {
    const typed = error as Error
    return new BackendError(
      'IMAGE_PROCESSING_ERROR',
      typed.message ?? 'Image processing failed',
      400,
      error
    )
  }

  static fromVibrant (error: unknown): BackendError {
    const typed = error as Error
    return new BackendError(
      'COLOR_EXTRACTION_ERROR',
      typed.message ?? 'Color extraction failed',
      500,
      error
    )
  }

  static fromZod <T>(error: z.ZodError<T>): BackendError {
    return new BackendError('INVALID_INPUT', error.issues.at(0)?.message ?? 'Invalid input', 400, error)
  }

  static fromLoader (error: unknown): BackendError {
    if (error instanceof BackendError) return error
    return new BackendError('LOADER_ERROR', 'Something went wrong. Please try again later', 500, error)
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
    return new BackendError('GRAPHQL_VALIDATION_FAILED', 'Invalid query', 400, error)
      .serialize()
  }

  console.log(error)

  return new BackendError('INTERNAL_ERROR', 'Something went wrong on our end. Please try again later', 500, error)
    .serialize()
}

export const COGNITO_ERROR_TO_API_ERROR: Record<string, BackendError> = {
  NotAuthorizedException: new BackendError('NOT_AUTHORIZED', 'Incorrect email or password', 401),
  UsernameExistsException: new BackendError('USER_EXISTS', 'A user with this email already exists', 403),
  UserNotFoundException: new BackendError('NOT_AUTHORIZED', 'Incorrect email or password', 401),
  UserNotConfirmedException: new BackendError('NOT_CONFIRMED', 'You have not yet confirmed your account', 403),
  PasswordResetRequiredException: new BackendError('PASSWORD_RESET_REQUIRED', 'A password reset is required', 403),
  CodeMismatchException: new BackendError('CODE_MISMATCH', 'Invalid verification code provided', 400),
  ExpiredCodeException: new BackendError('EXPIRED_CODE', 'This code has expired. Please request a new one to reset your password', 400),
  LimitExceededException: new BackendError('LIMIT_EXCEEDED', 'Attempt limit exceeded, please try again later', 429),
  InvalidPasswordException: new BackendError('INVALID_PASSWORD', 'Incorrect email or password', 400),
  CodeDeliveryFailureException: new BackendError('CODE_DELIVERY_FAILURE', 'Failed to deliver verification code', 500),
  TooManyRequestsException: new BackendError('TOO_MANY_REQUESTS', 'Too many requests, please slow down', 429),
  InvalidParameterException: new BackendError('INVALID_PARAMETER', 'Invalid input provided', 400),
  AccessDeniedException: new BackendError('ACCESS_DENIED', 'Access denied to this operation', 403),
  ResourceNotFoundException: new BackendError('RESOURCE_NOT_FOUND', 'Something went wrong on our end. Please try again', 500)
} as const

export const S3_ERROR_TO_API_ERROR: Record<string, BackendError> = {
  AccessDenied: new BackendError('S3_ACCESS_DENIED', 'You do not have permission to access this resource', 403),
  NoSuchBucket: new BackendError('S3_NO_SUCH_BUCKET', 'The requested bucket does not exist', 404),
  NoSuchKey: new BackendError('S3_NO_SUCH_KEY', 'The requested file does not exist', 404),
  InvalidBucketName: new BackendError('S3_INVALID_BUCKET_NAME', 'Invalid bucket name', 400),
  InvalidObjectState: new BackendError('S3_INVALID_OBJECT_STATE', 'Invalid object state for the requested operation', 400),
  EntityTooLarge: new BackendError('S3_FILE_TOO_LARGE', 'The uploaded file is too large', 413),
  SlowDown: new BackendError('S3_TOO_MANY_REQUESTS', 'Too many requests to S3, please slow down', 429),
  NotFound: new BackendError('S3_NO_OBJECT', 'The requested asset does not exist', 404)
} as const

export const MEILI_ERROR_TO_API_ERROR: Record<string, BackendError> = {
  MeiliSearchCommunicationError: new BackendError('SEARCH_COMMUNICATION_ERROR', 'Could not reach search Service.js', 503),
  MeiliSearchApiError: new BackendError('SEARCH_API_ERROR', 'Search service returned an error', 502),
  MeiliSearchError: new BackendError('SEARCH_ERROR', 'Unexpected search service error', 500),
  TimeoutError: new BackendError('SEARCH_TIMEOUT', 'Search request timed out', 504)
} as const

export const MQ_ERROR_TO_API_ERROR: Record<string, BackendError> = {
  QueueClosedError: new BackendError('QUEUE_CLOSED', 'The queue is closed', 500),
  ConnectionError: new BackendError('QUEUE_CONNECTION_ERROR', 'Could not connect to queue Service.js', 503),
  TimeoutError: new BackendError('QUEUE_TIMEOUT', 'Queue request timed out', 504),
  UnknownCommandError: new BackendError('QUEUE_UNKNOWN_COMMAND', 'Invalid queue command issued', 500)
} as const

export const throwError = (error: unknown): never => {
  throw error as Error
}

export const unwrapOrThrow = async <T, E> (result: ResultAsync<T, E>): Promise<T> => {
  return await result.match(
    v => v,
    throwError
  )
}

export const unwrapOrThrowSync = <T, E> (result: Result<T, E>): T => {
  return result.match(
    v => v,
    throwError
  )
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
