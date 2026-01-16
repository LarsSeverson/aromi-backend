import { generateHTML, generateJSON } from '@tiptap/html'
import { generateText, type JSONContent } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { BackendError } from './error.js'
import type { JsonValue } from '@src/db/db-schema.js'

export const extensions = [StarterKit]

export const trimTiptapNode = (node: JSONContent): JSONContent => {
  if (node.content == null) return node

  const cleanedContent = node.content.reduce<JSONContent[]>((acc, child) => {
    const isText = child.type === 'text'
    const isBlock = ['paragraph', 'heading', 'blockquote', 'listItem'].includes(child.type ?? '')

    if (isText && child.text != null) {
      const trimmedText = child.text.trim()
      if (trimmedText === '') return acc

      acc.push({ ...child, text: trimmedText })
      return acc
    }

    const processedChild = trimTiptapNode(child)

    const isEmptyBlock = isBlock && (processedChild.content == null || processedChild.content.length === 0)

    if (!isEmptyBlock) {
      acc.push(processedChild)
    }

    return acc
  }, [])

  return {
    ...node,
    content: cleanedContent
  }
}

export const getSanitizedTiptapContent = (value: unknown, minLength: number, maxLength: number) => {
  const content = trimTiptapNode(value as JSONContent)

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

  return newContent
}

export const getTextFromContent = (content?: JSONContent | JsonValue | null) => {
  if (content == null) return undefined

  return generateText(
    content as JSONContent,
    extensions
  )
}