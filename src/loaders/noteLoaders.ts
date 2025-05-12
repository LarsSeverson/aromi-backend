  private createNotesLoader (): FragranceLoadersCache['notes'] {
    const { me, paginationParams, fill } = this

    return new DataLoader<FragranceNoteLoaderKey, FragranceNoteRow[]>(async (keys) => {
      const fragranceIds = keys.map(({ fragranceId }) => fragranceId)
      const layers = keys.map(({ layer }) => layer)

      const layerResults = layers.map(layer =>
        this
          .fragranceService
          .withMe(me)
          .getNotes({ fragranceIds, paginationParams, layer, fill })
      )

      return await ResultAsync
        .combine(layerResults)
        .map(results => results.flat())
        .match(
          rows => {
            const noteMap = rows.reduce(
              (map, row) => {
                const key = `${row.fragranceId}:${row.layer}`

                const list = map.get(key) ?? []
                if (!map.has(key)) map.set(key, list)

                list.push(row)

                return map
              }, new Map<string, FragranceNoteRow[]>()
            )

            return keys.map(({ fragranceId, layer }) => noteMap.get(`${fragranceId}:${layer}`) ?? [])
          },
          error => { throw error }
        )
    })
  }