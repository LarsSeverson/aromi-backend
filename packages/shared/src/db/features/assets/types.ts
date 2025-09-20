import type { DB } from '@src/db/db-schema.js'
import type { Selectable } from 'kysely'

export type AssetUploadRow = Selectable<DB['assetUploads']>