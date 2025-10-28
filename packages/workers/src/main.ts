import { WorkerServices } from './services/WorkerServices.js'
import { WorkerContext } from './context/WorkerContext.js'

const main = async () => {
  const context = new WorkerContext()
  await context.healthCheck()

  const workers = new WorkerServices(context)

  console.log('Workers are running...', workers)
}

main()
