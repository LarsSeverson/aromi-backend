import { type ApiDataSources } from '@src/datasources/datasources'
import { type ApiServiceContext } from './ApiService'
import { FragranceService } from './FragranceService'
import { AuthService } from './AuthService'
import { UserService } from './UserService'
import { AssetService } from './AssetService'
import { AccordService } from './AccordService'
import { NoteService } from './NoteService'

export class ApiServices {
  auth: AuthService
  asset: AssetService
  user: UserService
  fragrance: FragranceService
  accord: AccordService
  note: NoteService

  constructor (sources: ApiDataSources) {
    this.auth = new AuthService(sources)
    this.asset = new AssetService(sources)
    this.user = new UserService(sources)
    this.fragrance = new FragranceService(sources)
    this.accord = new AccordService(sources)
    this.note = new NoteService(sources)
  }

  setContext (context: ApiServiceContext): this {
    this
      .user
      .setContext(context)

    this
      .fragrance
      .setContext(context)

    this
      .accord
      .setContext(context)

    this
      .note
      .setContext(context)

    return this
  }
}
