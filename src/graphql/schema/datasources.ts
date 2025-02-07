import { Pool } from 'pg'
import { requiredEnv } from '../../utils/requiredEnv'

const aromidb = new Pool({
  host: requiredEnv('DB_HOST'),
  user: requiredEnv('DB_USER'),
  password: requiredEnv('DB_PASSWORD'),
  database: requiredEnv('DB_NAME'),
  port: Number(requiredEnv('DB_PORT'))
})

export default aromidb
