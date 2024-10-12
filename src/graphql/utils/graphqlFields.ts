export const graphqlFields = (selectionSetList: string[], mainField: string, relationFields: string[] = []): Record<string, string[]> => {
  const fieldsMap: Record<string, string[]> = {
    [mainField]: []
  }

  relationFields.forEach(field => {
    fieldsMap[field] = []
  })

  selectionSetList.forEach(field => {
    const parts = field.split('/')

    // TODO: Nested within nested instead of just expectation of 2
    if (parts.length === 1) {
      if (!fieldsMap[parts[0]]) {
        fieldsMap[mainField].push(parts[0])
      }
    } else if (parts.length === 2) {
      const [parent, child] = parts
      if (fieldsMap[parent]) {
        fieldsMap[parent].push(child)
      }
    }
  })

  return fieldsMap
}
