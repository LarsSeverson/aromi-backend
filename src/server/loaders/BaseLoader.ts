import { type ApiServices } from '@src/server/services/ApiServices'
import type DataLoader from 'dataloader'

export abstract class BaseLoader<K> {
  protected readonly cache = new Map<string, DataLoader<K, unknown>>()
  protected readonly services: ApiServices

  constructor (services: ApiServices) {
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
