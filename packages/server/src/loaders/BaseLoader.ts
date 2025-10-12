import type { ServerServices } from '@src/services/ServerServices.js'
import type DataLoader from 'dataloader'

export abstract class BaseLoader<K = string> {
  protected readonly cache = new Map<string, DataLoader<K, unknown>>()
  protected readonly services: ServerServices

  constructor (services: ServerServices) {
    this.services = services
  }

  protected getLoader<T>(
    key: string,
    loader: () => DataLoader<K, T>
  ): DataLoader<K, T> {
    if (!this.cache.has(key)) {
      this.cache.set(key, loader())
    }

    return this.cache.get(key) as DataLoader<K, T>
  }

  protected genKey (
    ...params: unknown[]
  ): string {
    return params
      .map(p => JSON.stringify(p))
      .sort()
      .join(':')
  }
}
