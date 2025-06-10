import { type ApiServices } from '@src/services/services'
import type DataLoader from 'dataloader'

export abstract class LoaderFactory<K> {
  protected readonly cache = new Map<string, DataLoader<K, unknown>>()
  protected readonly services: ApiServices

  constructor (services: ApiServices) {
    this.services = services
  }

  protected getLoader<T>(key: string, factory: () => DataLoader<K, T>): DataLoader<K, T> {
    if (!this.cache.has(key)) {
      this.cache.set(key, factory())
    }

    return this.cache.get(key) as DataLoader<K, T>
  }

  protected generateKey (...params: unknown[]): string {
    return params.map(p => JSON.stringify(p)).sort().join(':')
  }
}
