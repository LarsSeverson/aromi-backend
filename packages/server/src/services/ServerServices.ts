import { AccordService, AssetService, AuthService, BrandService, type DataSources, FragranceService, NoteService, PostService, SearchServices, TraitService, UserService } from '@aromi/shared'

export class ServerServices {
  readonly sources: DataSources

  auth: AuthService
  assets: AssetService

  users: UserService

  fragrances: FragranceService
  brands: BrandService
  traits: TraitService
  accords: AccordService
  notes: NoteService
  posts: PostService

  search: SearchServices

  constructor (sources: DataSources) {
    this.sources = sources

    this.auth = new AuthService(sources)
    this.assets = new AssetService(sources)

    this.users = new UserService(sources)

    this.fragrances = new FragranceService(sources)
    this.brands = new BrandService(sources)
    this.traits = new TraitService(sources)
    this.accords = new AccordService(sources)
    this.notes = new NoteService(sources)
    this.posts = new PostService(sources)

    this.search = new SearchServices(sources)
  }

  async ensure () {
    await this.search.ensureIndexes()
  }

  async withTransaction <R>(
    fn: (services: this) => Promise<R>
  ) {
    const { db } = this.sources

    return await db
      .transaction()
      .execute(async trx => {
        const trxServices = this.createTrxServices(trx)
        return await fn(trxServices)
      })
  }

  private createTrxServices (trx: DataSources['db']): this {
    const Ctor = this.constructor as new (sources: DataSources) => this
    const sources = this.sources.with({ db: trx })
    return new Ctor(sources)
  }
}
