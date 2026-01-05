import { generateHTML, generateJSON } from '@tiptap/html'
import { generateText, type JSONContent } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { BackendError } from './error.js'
import type { JsonValue } from '@src/db/db-schema.js'

export const extensions = [StarterKit]

export const getSanitizedTiptapContent = (value: unknown, maxLength: number) => {
  const content = value as JSONContent

  const text = generateText(
    content,
    extensions
  )

  if (text.length > maxLength) {
    throw new BackendError(
      'CONTENT_TOO_LONG',
      `Content exceeds ${maxLength} characters`,
      400
    )
  }

  const html = generateHTML(
    content,
    extensions
  )

  const newContent = generateJSON(html, extensions)

  if (JSON.stringify(newContent) !== JSON.stringify(content)) {
    throw new BackendError(
      'INVALID_CONTENT',
      'Content contains invalid or unsafe elements',
      400
    )
  }

  return newContent
}

export const getTextFromContent = (content?: JSONContent | JsonValue | null) => {
  if (content == null) return undefined

  return generateText(
    content as JSONContent,
    extensions
  )
}