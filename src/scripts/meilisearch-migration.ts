import { config } from 'dotenv'
import { MeiliSearch } from 'meilisearch'
import { Pool } from 'pg'

config()

const db = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT)
})

const meili = new MeiliSearch({
  host: process.env.MEILISEARCH_URL,
  apiKey: process.env.MEILISEARCH_API_KEY
})

// interface F {
//   id: number
//   name: string
//   brand: string
// }

// const sync = async (): Promise<void> => {
//   const res = await db.query<F>(/* sql */`
//     SELECT
//       id, name, brand
//     FROM fragrances
//   `)

//   const docs = res
//     .rows
//     .map(row => ({
//       id: row.id,
//       name: row.name,
//       brand: row.brand
//     }))

//   await meili.index('fragrances').addDocuments(docs)

//   console.log(`Synced ${docs.length} fragrances`)
// }

// void sync().catch(err => { console.log(err) })

interface A {
  id: number
  name: string
}

const sync = async (): Promise<void> => {
  const res = await db.query<A>(/* sql */`
    SELECT
      id, name
    FROM accords
  `)

  const docs = res
    .rows
    .map(row => ({
      id: row.id,
      name: row.name
    }))

  await meili.index('accords').addDocuments(docs)

  console.log(`Synced ${docs.length} accords`)
}

void sync().catch(err => { console.log(err) })
