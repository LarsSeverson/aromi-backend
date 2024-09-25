import { Pool } from 'pg'
import rdsPool from './datasources/rdsPool'

export interface Context {
  pool: Pool
  token?: string
}

const context = (): Context => {
  return {
    pool: rdsPool
  }
}

export default context
