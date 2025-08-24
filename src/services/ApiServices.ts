import type { DataSources } from '@src/datasources'
import { AccordService } from '@src/features/accords/services/AccordService'
import { AssetService } from '@src/features/assets/services/AssetService'
import { AuthService } from '@src/features/auth/services/AuthService'
import { FragranceDraftService } from '@src/features/fragranceDrafts/services/FragranceDraftService'
import { NoteService } from '@src/features/notes/services/NoteService'
import { UserService } from '@src/features/users/services/UserService'

export class ApiServices {
  auth: AuthService
  assets: AssetService

  users: UserService

  fragranceDrafts: FragranceDraftService

  accords: AccordService
  notes: NoteService

  constructor (sources: DataSources) {
    this.auth = new AuthService(sources)
    this.assets = new AssetService(sources)

    this.users = new UserService(sources)

    this.fragranceDrafts = new FragranceDraftService(sources)

    this.accords = new AccordService(sources)
    this.notes = new NoteService(sources)
  }
}
