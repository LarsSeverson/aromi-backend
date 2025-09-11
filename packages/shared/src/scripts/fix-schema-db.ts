import fs from 'node:fs'

const schemaPath = './src/db/db-schema.ts'
const schema = fs.readFileSync(schemaPath, 'utf8')

const fixedSchema = schema.replace(
  /export type Timestamp = ColumnType<.*?>;/,
  'export type Timestamp = ColumnType<string, string, string>;'
)

fs.writeFileSync(schemaPath, fixedSchema, 'utf8')

console.log('✅ Updated Timestamp type to use string in schema.d.ts')
