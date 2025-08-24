import { FragranceDraftLoaders } from '@src/features/fragranceDrafts/loaders/FragranceDraftLoaders'
import { type ApiServices } from '@src/services/ApiServices'

export class ApiLoaders {
  fragranceDrafts: FragranceDraftLoaders

  constructor (services: ApiServices) {
    this.fragranceDrafts = new FragranceDraftLoaders(services)
  }
}
