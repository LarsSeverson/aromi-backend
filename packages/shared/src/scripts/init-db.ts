import { config } from 'dotenv'
import { join } from 'node:path'
import { execSync } from 'node:child_process'

config()

function initializeDb () {
  const schemaPath = join(import.meta.dirname, '..', 'db', 'sql', 'schema.sql')
  console.log('running schema.sql with psql...')
  try {
    execSync(`psql "${process.env.DB_URL}" -f "${schemaPath}"`, { stdio: 'inherit' })
    console.log('database initialized successfully')
  } catch (error) {
    console.error('error recreating db:', error)
    process.exit(1)
  }
}

initializeDb()
