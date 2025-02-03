import { Pool } from 'pg'
import aromidb from './datasources'
import { JwtHeader, JwtPayload, SigningKeyCallback, verify } from 'jsonwebtoken'
import { JwksClient } from 'jwks-rsa'
import { requiredEnv } from '../utils/requiredEnv'
import { User } from '../types/userTypes'

export interface Context {
  pool: Pool

  token?: string | undefined

  user?: User | undefined
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
    console.log(error)

    return null
  }
}

const getCurrentUser = async (cognitoId: string, pool: Pool): Promise<User | null> => {
  const query = `
    SELECT
      id,
      email,
      username,
      cognito_id as "cognitoId"
      FROM users
      WHERE cognito_id = $1
  `
  const values = [cognitoId]

  const res = await pool.query<User>(query, values)
  const user = res.rows[0]

  return user || null
}

export const getContext = async ({ event }: { event: any }): Promise<Context> => {
  const authHeader = event.headers.authorization || ''

  const pool = aromidb
  const token = authHeader.replace('Bearer ', '')

  const ctx: Context = { pool, token }

  const decoded = await decodeToken(token)
  const cognitoId = decoded?.sub || undefined

  if (cognitoId) {
    ctx.user = await getCurrentUser(cognitoId, pool) || undefined
  }

  return ctx
}
