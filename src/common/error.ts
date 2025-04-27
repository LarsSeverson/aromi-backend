export class ApiError extends Error {
  readonly code: string
  readonly status: number
  readonly details?: unknown

  constructor (code: string, message: string, status: number, details?: unknown) {
    super(message)
    this.code = code
    this.message = message
    this.status = status
    this.details = details
  }
}
