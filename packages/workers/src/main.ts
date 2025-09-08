import { WorkerServices } from './services/WorkerServices'

const main = (): void => {
  const sourcesRes = createDataSources()
  if (sourcesRes.isErr()) {
    throw sourcesRes.error
  }

  const sources = sourcesRes.value
  const workers = new WorkerServices(sources)
}

main()
