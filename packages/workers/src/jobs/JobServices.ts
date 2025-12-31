import { AccordService, AssetService, BrandService, type DataSources, EditJobService, FragranceService, NoteService, PostService, RequestJobService, SearchServices, UserService } from '@aromi/shared'

export class JobServices {
  assets: AssetService

  users: UserService

  fragrances: FragranceService
  brands: BrandService
  accords: AccordService
  notes: NoteService
  posts: PostService

  search: SearchServices
  editJobs: EditJobService
  requestJobs: RequestJobService

  constructor (sources: DataSources) {
    this.assets = new AssetService(sources)

    this.users = new UserService(sources)

    this.fragrances = new FragranceService(sources)
    this.brands = new BrandService(sources)
    this.accords = new AccordService(sources)
    this.notes = new NoteService(sources)
    this.posts = new PostService(sources)

    this.search = new SearchServices(sources)
    this.editJobs = new EditJobService(sources)
    this.requestJobs = new RequestJobService(sources)
  }
}
