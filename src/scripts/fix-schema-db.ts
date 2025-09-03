import fs from 'fs'

const schemaPath = './src/generated/db-schema.d.ts'
const schema = fs.readFileSync(schemaPath, 'utf8')

const fixedSchema = schema.replace(
  /export type Timestamp = ColumnType<.*?>;/,
  'export type Timestamp = ColumnType<string, string, string>;'
)

fs.writeFileSync(schemaPath, fixedSchema, 'utf8')

console.log('✅ Updated Timestamp type to use string in schema.d.ts')
