import type { FragranceResolvers } from '@src/graphql/gql-types.js'
import { RequestResolver } from '@src/resolvers/RequestResolver.js'
import type { FragranceImageRow } from '@aromi/shared'

type Query = FragranceResolvers['images']

export class FragranceImagesResolver extends RequestResolver<Query> {
  resolve () {
    return this.getRows().map(rows => this.mapToOutput(rows))
  }

  getRows () {
    const { id } = this.parent
    const { loaders } = this.context

    const { fragrances } = loaders

    return fragrances.loadImages(id)
  }

  mapToOutput (rows: FragranceImageRow[]) {
    const { services } = this.context
    const { assets } = services

    return rows.map(row => {
      const { id, primaryColor, width, height } = row
      const url = assets.getCdnUrl(row.s3Key)
      return {
        id, url, width, height, primaryColor
      }
    })
  }
}