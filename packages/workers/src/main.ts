import { WorkerServices } from './services/WorkerServices.js'
import { WorkerContext } from './context/WorkerContext.js'

const main = (): void => {
  const context = new WorkerContext()
  const workers = new WorkerServices(context)

  console.log('Workers are running...', workers)
}

main()
