import { createDataSources } from '@src/datasources'
import { WorkerServices } from './services/WorkerServices'
import { TestJob } from './jobs/TestJob/TestJob'

const main = (): void => {
  const sourcesRes = createDataSources()
  if (sourcesRes.isErr()) {
    throw sourcesRes.error
  }

  const sources = sourcesRes.value
  const services = new WorkerServices(sources)
  const context = { sources, services }

  const job = new TestJob(context)

  setInterval(
    () => {
      void job.handle()
    },
    10_000
  )
}

main()
