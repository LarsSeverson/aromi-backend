import { type DataSources } from '@src/datasources'
import { type WorkerServices } from '../services/WorkerServices'

export interface WorkerContext {
  sources: DataSources
  services: WorkerServices
}
