export const ASCENDING_ORDER = 'asc'
export const DESCENDING_ORDER = 'desc'

export const INVALID_ID = '00000000-0000-0000-0000-000000000000'

export const IS_APP_PRODUCTION = process.env.NODE_ENV === 'production'

export const NOW = (): number => Math.floor(Date.now() / 1000) // Current time in seconds
