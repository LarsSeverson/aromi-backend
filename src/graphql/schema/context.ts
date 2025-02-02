import { Pool } from 'pg'
import aromidb from './datasources'
import { JwtHeader, JwtPayload, SigningKeyCallback, verify } from 'jsonwebtoken'
import { JwksClient } from 'jwks-rsa'
import { requiredEnv } from '../utils/requiredEnv'

export interface Context {
  pool: Pool

  token?: string | undefined

  userId?: number | null | undefined
}

const client = new JwksClient({ jwksUri: requiredEnv('USER_POOL_JWKS') })

const getKey = (header: JwtHeader, callback: SigningKeyCallback): void => {
  client.getSigningKey(header.kid, (err, key) => {
    callback(err, key?.getPublicKey())
  })
}

const decodeToken = async (token?: string | undefined) => {
  if (!token) return null

  try {
    const decoded = await new Promise<JwtPayload>((resolve, reject) => {
      verify(
        token,
        getKey,
        (err, decoded) => {
          if (err) reject(err)
          else resolve(decoded as JwtPayload)
        }
      )
    })

    return decoded
  } catch (error) {
    return null
  }
}

const getUserId = async (cognitoId: string, pool: Pool): Promise<number> => {
  const res = await pool.query('SELECT id FROM users WHERE cognito_id = $1', [cognitoId])

  const userId: number = res.rows[0].id

  return userId
}

export const getContext = async ({ event }: { event: any }): Promise<Context> => {
  const authHeader = event.headers.authorization || ''

  const pool = aromidb
  const token = authHeader.replace('Bearer ', '')

  const ctx: Context = { pool, token }

  const decoded = await decodeToken(token)

  const cognitoId = decoded?.sub || null

  if (cognitoId) {
    ctx.userId = await getUserId(cognitoId, pool)
  }

  return ctx
}
