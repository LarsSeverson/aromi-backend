import { QUEUE_NAMES } from '@aromi/shared'
import { INDEXATION_JOB_NAMES, type IndexationJobPayload } from '@aromi/shared'
import type { WorkerContext } from '@src/context/WorkerContext.js'
import { WorkerService } from '@src/services/WorkerService.js'
import { FragranceIndexer } from '../jobs/FragranceIndexer.js'
import { BrandIndexer } from '../jobs/BrandIndexer.js'
import { AccordIndexer } from '../jobs/AccordIndexer.js'
import { NoteIndexer } from '../jobs/NoteIndexer.js'
import { FragranceUpdater } from '../jobs/FragranceUpdater.js'
import { BrandUpdater } from '../jobs/BrandUpdater.js'
import { AccordUpdater } from '../jobs/AccordUpdater.js'
import { NoteUpdater } from '../jobs/NoteUpdater.js'
import { UserIndexer } from '../jobs/UserIndexer.js'
import { PostIndexer } from '../jobs/PostIndexer.js'
import { PostUpdater } from '../jobs/PostUpdater.js'
import { PostDeleter } from '../jobs/PostDeleter.js'
import { PostCommentDeleter } from '../jobs/PostCommentDeleter.js'
import { PostCommentIndexer } from '../jobs/PostCommentIndexer.js'
import { PostCommentUpdater } from '../jobs/PostCommentUpdater.js'
import { UserUpdater } from '../jobs/UserUpdater.js'
import { ReviewIndexer } from '../jobs/ReviewIndexer.js'
import { ReviewUpdater } from '../jobs/ReviewUpdater.js'
import { ReviewDeleter } from '../jobs/ReviewDeleter.js'

export class IndexationService extends WorkerService<keyof IndexationJobPayload, IndexationJobPayload> {
  constructor (context: WorkerContext) {
    super(QUEUE_NAMES.INDEXATION, context)

    this
      .registerFragranceJobs()
      .registerBrandJobs()
      .registerAccordJobs()
      .registerNoteJobs()
      .registerUserJobs()
      .registerPostJobs()
      .registerPostCommentJobs()
      .registerReviewJobs()
  }

  private registerFragranceJobs () {
    return this
      .register(
        INDEXATION_JOB_NAMES.INDEX_FRAGRANCE,
        new FragranceIndexer(this.context.sources)
      )
      .register(
        INDEXATION_JOB_NAMES.UPDATE_FRAGRANCE,
        new FragranceUpdater(this.context.sources)
      )
  }

  private registerBrandJobs () {
    return this
      .register(
        INDEXATION_JOB_NAMES.INDEX_BRAND,
        new BrandIndexer(this.context.sources)
      )
      .register(
        INDEXATION_JOB_NAMES.UPDATE_BRAND,
        new BrandUpdater(this.context.sources)
      )
  }

  private registerAccordJobs () {
    return this
      .register(
        INDEXATION_JOB_NAMES.INDEX_ACCORD,
        new AccordIndexer(this.context.sources)
      )
      .register(
        INDEXATION_JOB_NAMES.UPDATE_ACCORD,
        new AccordUpdater(this.context.sources)
      )
  }

  private registerNoteJobs () {
    return this
      .register(
        INDEXATION_JOB_NAMES.INDEX_NOTE,
        new NoteIndexer(this.context.sources)
      )
      .register(
        INDEXATION_JOB_NAMES.UPDATE_NOTE,
        new NoteUpdater(this.context.sources)
      )
  }

  private registerUserJobs () {
    return this
      .register(
        INDEXATION_JOB_NAMES.INDEX_USER,
        new UserIndexer(this.context.sources)
      )
      .register(
        INDEXATION_JOB_NAMES.UPDATE_USER,
        new UserUpdater(this.context.sources)
      )
  }

  private registerPostJobs () {
    return this
      .register(
        INDEXATION_JOB_NAMES.INDEX_POST,
        new PostIndexer(this.context.sources)
      )
      .register(
        INDEXATION_JOB_NAMES.UPDATE_POST,
        new PostUpdater(this.context.sources)
      )
      .register(
        INDEXATION_JOB_NAMES.DELETE_POST,
        new PostDeleter(this.context.sources)
      )
  }

  private registerPostCommentJobs () {
    return this
      .register(
        INDEXATION_JOB_NAMES.INDEX_POST_COMMENT,
        new PostCommentIndexer(this.context.sources)
      )
      .register(
        INDEXATION_JOB_NAMES.UPDATE_POST_COMMENT,
        new PostCommentUpdater(this.context.sources)
      )
      .register(
        INDEXATION_JOB_NAMES.DELETE_POST_COMMENT,
        new PostCommentDeleter(this.context.sources)
      )
  }

  private registerReviewJobs () {
    return this
      .register(
        INDEXATION_JOB_NAMES.INDEX_REVIEW,
        new ReviewIndexer(this.context.sources)
      )
      .register(
        INDEXATION_JOB_NAMES.UPDATE_REVIEW,
        new ReviewUpdater(this.context.sources)
      )
      .register(
        INDEXATION_JOB_NAMES.DELETE_REVIEW,
        new ReviewDeleter(this.context.sources)
      )
  }
}