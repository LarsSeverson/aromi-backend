import { config } from 'dotenv'
import { ResultAsync } from 'neverthrow'
import { Pool, type PoolClient } from 'pg'
import { exec } from 'node:child_process'
import { join } from 'node:path'
import { writeFileSync, mkdirSync } from 'node:fs'
import { format } from 'sql-formatter'

config()

const pool = new Pool({
  connectionString: process.env.DB_URL
})

const dumpSchemas = async (client: PoolClient) => {
  const res = await client.query<{ table_name: string }>(`
    select table_name
    from information_schema.tables
    where table_schema = 'public'
  `)

  const tables = res.rows.map(r => r.table_name)
  const outDir = join(import.meta.dirname, '..', 'db', 'sql')
  mkdirSync(outDir, { recursive: true })

  tables.forEach(table => {
    console.log(`creating table: ${table}`)
    const cmd = `pg_dump --schema-only --no-owner --no-privileges --no-comments --no-tablespaces -t ${table} -d "${process.env.DB_URL}" | sed -E '/^(--|SET|SELECT pg_catalog|\\\\|CREATE EXTENSION|COMMENT ON|ALTER DATABASE)/d'`
    exec(cmd, (error, stdout) => {
      if (error != null) {
        console.error(`error executing pg_dump for table ${table}:`, error)
        return
      }

      const formatted = format(stdout, {
        language: 'postgresql',
        keywordCase: 'upper'
      })

      const filePath = join(outDir, `${table}.sql`)
      writeFileSync(filePath, formatted, 'utf-8')
      console.log(`schema for table ${table} written to ${filePath}`)
    })
  })
}

const dumpTypes = async (client: PoolClient) => {
  const res = await client.query<{ ddl: string }>(`
    select format(
      'create type %I.%I as enum (%s);',
      n.nspname,
      t.typname,
      string_agg(quote_literal(e.enumlabel), ', ')
    ) as ddl
    from pg_type t
    join pg_enum e on t.oid = e.enumtypid
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public'
    group by n.nspname, t.typname
    order by t.typname
  `)

  const outDir = join(import.meta.dirname, '..', 'db', 'sql')
  mkdirSync(outDir, { recursive: true })

  const filePath = join(outDir, 'types.sql')
  const ddl = res.rows.map(r => r.ddl).join('\n\n')
  const formatted = format(ddl, {
    language: 'postgresql',
    keywordCase: 'upper'
  })

  writeFileSync(filePath, formatted + '\n', 'utf-8')
  console.log(`types written to ${filePath}`)
}

const dumpFullSchema = () => {
  const outDir = join(import.meta.dirname, '..', 'db', 'sql')
  mkdirSync(outDir, { recursive: true })

  const filePath = join(outDir, 'schema.sql')
  const cmd = `pg_dump --schema-only --no-owner --no-privileges --no-comments --no-tablespaces -d "${process.env.DB_URL}"`

  exec(cmd, (error, stdout) => {
    if (error != null) {
      console.error('error executing pg_dump for full schema:', error)
      return
    }

    writeFileSync(filePath, stdout, 'utf-8')
    console.log(`full schema written to ${filePath}`)
  })
}

const dump = async (client: PoolClient) => {
  await ResultAsync.fromPromise(dumpSchemas(client), error => error)
  await ResultAsync.fromPromise(dumpTypes(client), error => error)
  dumpFullSchema()
}

const copyDb = async () => {
  const client = await pool.connect()
  await dump(client)
  client.release()
  await pool.end()
}

copyDb()
