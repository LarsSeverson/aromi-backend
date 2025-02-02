import { AppSyncIdentityCognito, Context, RDSRequest, util } from '@aws-appsync/utils'
import { createPgStatement, toJsonObject, insert, sql, select } from '@aws-appsync/utils/rds'
import { NoteLayerType } from '@src/graphql/types/fragranceTypes'

interface VoteOnNoteArgs {
 fragranceId: number
 noteId: number

 layer: NoteLayerType
}

export const request = (ctx: Context): RDSRequest | null => {
  const { fragranceId, noteId, layer }: VoteOnNoteArgs = ctx.args

  const cogId = (ctx.identity as AppSyncIdentityCognito).sub

  const query = sql`
    WITH user_info AS (
      SELECT id as user_id
      FROM users
      WHERE cognito_id = ${cogId}
      LIMIT 1
    ),
    fragrance_note AS (
      INSERT INTO fragrance_notes (fragrance_id, note_id, layer)
      VALUES (${fragranceId}, ${noteId}, ${layer}::note_layer)
      ON CONFLICT (fragrance_id, note_id, layer) DO NOTHING
      RETURNING id
    ),
    final_note_id AS (
      SELECT COALESCE(
        (SELECT id FROM fragrance_note),
        (SELECT id FROM fragrance_notes
          WHERE fragrance_id = ${fragranceId} AND note_id = ${noteId} AND layer = ${layer}::note_layer)
      ) AS note_id
    )
    INSERT INTO fragrance_note_votes_view ("fragranceNoteId", "userId")
    SELECT
      (SELECT note_id FROM final_note_id),
      (SELECT user_id FROM user_info)
    ON CONFLICT ("fragranceNoteId", "userId") DO UPDATE SET
      "deletedAt" = CASE
        WHEN fragrance_note_votes_view."deletedAt" IS NULL
        THEN CURRENT_TIMESTAMP
        ELSE NULL
      END,
      "updatedAt" = CURRENT_TIMESTAMP
    RETURNING *
  `

  return createPgStatement(query)
}

export const response = (ctx: Context): any => {
  const { error, result } = ctx

  if (error) {
    return util.appendError(
      error.message,
      error.type,
      result
    )
  }

  const vote = toJsonObject(result)[0][0]

  return vote
}
