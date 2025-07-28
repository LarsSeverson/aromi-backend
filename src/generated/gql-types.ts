import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { FragranceSummary, FragranceSummaryEdge, FragranceReviewSummary, FragranceReviewSummaryEdge, FragranceNotesSummary, FragranceCollectionSummary, FragranceCollectionSummaryEdge, FragranceCollectionItemSummary, FragranceCollectionItemSummaryEdge, FragranceVoteSummary, FragranceVoteSummaryEdge } from '../schemas/fragrance/mappers';
import { UserSummary, UserReviewSummary, UserReviewSummaryEdge } from '../schemas/user/mappers';
import { ApiContext } from '@src/context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: Date; output: Date; }
  JSON: { input: Record<string, any>; output: Record<string, any>; }
};

export type Accord = {
  __typename?: 'Accord';
  audit: Audit;
  color: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type AccordConnection = {
  __typename?: 'AccordConnection';
  edges: Array<AccordEdge>;
  pageInfo: PageInfo;
};

export type AccordEdge = {
  __typename?: 'AccordEdge';
  cursor: Scalars['String']['output'];
  node: Accord;
};

export type Asset = {
  __typename?: 'Asset';
  alt?: Maybe<Scalars['String']['output']>;
  audit: Audit;
  id: Scalars['Int']['output'];
  src: Scalars['String']['output'];
};

export const AssetStatus = {
  Failed: 'FAILED',
  Pending: 'PENDING',
  Uploaded: 'UPLOADED'
} as const;

export type AssetStatus = typeof AssetStatus[keyof typeof AssetStatus];
export type AssetUploadPayload = {
  __typename?: 'AssetUploadPayload';
  fields: Scalars['JSON']['output'];
  s3Key: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type Audit = {
  __typename?: 'Audit';
  createdAt: Scalars['Date']['output'];
  deletedAt?: Maybe<Scalars['Date']['output']>;
  updatedAt: Scalars['Date']['output'];
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  accessToken: Scalars['String']['output'];
  expiresIn: Scalars['Int']['output'];
  idToken: Scalars['String']['output'];
};

export type CodeDeliveryDetails = {
  __typename?: 'CodeDeliveryDetails';
  attribute?: Maybe<Scalars['String']['output']>;
  destination?: Maybe<Scalars['String']['output']>;
  method?: Maybe<Scalars['String']['output']>;
};

export type ConfirmFragranceImageInput = {
  fragranceId: Scalars['Int']['input'];
  s3Key: Scalars['String']['input'];
};

export type ControlledPaginationInput = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<ControlledSortByInput>;
};

export type ControlledSortByInput = {
  direction?: InputMaybe<SortDirection>;
};

export type CreateFragranceCollectionInput = {
  name: Scalars['String']['input'];
};

export type CreateFragranceCollectionItemInput = {
  collectionId: Scalars['Int']['input'];
  fragranceId: Scalars['Int']['input'];
};

export type CreateFragranceImageInput = {
  fileSize: Scalars['Int']['input'];
  fileType: Scalars['String']['input'];
  fragranceId: Scalars['Int']['input'];
};

export type CreateFragranceReportInput = {
  fragranceId: Scalars['Int']['input'];
  report: Scalars['String']['input'];
};

export type CreateReviewReportInput = {
  report: Scalars['String']['input'];
  reviewId: Scalars['Int']['input'];
};

export type DeleteFragranceCollectionItemInput = {
  collectionId: Scalars['Int']['input'];
  fragranceId: Scalars['Int']['input'];
};

export type DeleteFragranceReviewInput = {
  reviewId: Scalars['Int']['input'];
};

export type DeliveryResult = {
  __typename?: 'DeliveryResult';
  complete: Scalars['Boolean']['output'];
  delivery?: Maybe<CodeDeliveryDetails>;
};

export type Fragrance = {
  __typename?: 'Fragrance';
  accords: FragranceAccordConnection;
  audit: Audit;
  brand: Scalars['String']['output'];
  fillerAccords: FragranceAccordConnection;
  id: Scalars['Int']['output'];
  images: FragranceImageConnection;
  myReview?: Maybe<FragranceReview>;
  name: Scalars['String']['output'];
  notes: FragranceNotes;
  rating: Scalars['Float']['output'];
  reviewDistribution: FragranceReviewDistribution;
  reviews: FragranceReviewConnection;
  reviewsCount: Scalars['Int']['output'];
  traits: Array<FragranceTrait>;
  votes: VoteSummary;
};


export type FragranceAccordsArgs = {
  input?: InputMaybe<VotePaginationInput>;
};


export type FragranceFillerAccordsArgs = {
  input?: InputMaybe<PaginationInput>;
};


export type FragranceImagesArgs = {
  input?: InputMaybe<PaginationInput>;
};


export type FragranceReviewsArgs = {
  input?: InputMaybe<VotePaginationInput>;
};

export type FragranceAccord = {
  __typename?: 'FragranceAccord';
  accordId: Scalars['Int']['output'];
  audit: Audit;
  color: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  votes: VoteSummary;
};

export type FragranceAccordConnection = {
  __typename?: 'FragranceAccordConnection';
  edges: Array<FragranceAccordEdge>;
  pageInfo: PageInfo;
};

export type FragranceAccordEdge = {
  __typename?: 'FragranceAccordEdge';
  cursor: Scalars['String']['output'];
  node: FragranceAccord;
};

export type FragranceCollection = {
  __typename?: 'FragranceCollection';
  audit: Audit;
  hasFragrance: Scalars['Boolean']['output'];
  id: Scalars['Int']['output'];
  items: FragranceCollectionItemConnection;
  name: Scalars['String']['output'];
  user: User;
};


export type FragranceCollectionHasFragranceArgs = {
  fragranceId?: InputMaybe<Scalars['Int']['input']>;
};


export type FragranceCollectionItemsArgs = {
  input?: InputMaybe<ControlledPaginationInput>;
};

export type FragranceCollectionConnection = {
  __typename?: 'FragranceCollectionConnection';
  edges: Array<FragranceCollectionEdge>;
  pageInfo: PageInfo;
};

export type FragranceCollectionEdge = {
  __typename?: 'FragranceCollectionEdge';
  cursor: Scalars['String']['output'];
  node: FragranceCollection;
};

export type FragranceCollectionItem = {
  __typename?: 'FragranceCollectionItem';
  audit: Audit;
  fragrance: Fragrance;
  id: Scalars['Int']['output'];
  rank: Scalars['Float']['output'];
};

export type FragranceCollectionItemConnection = {
  __typename?: 'FragranceCollectionItemConnection';
  edges: Array<FragranceCollectionItemEdge>;
  pageInfo: PageInfo;
};

export type FragranceCollectionItemEdge = {
  __typename?: 'FragranceCollectionItemEdge';
  cursor: Scalars['String']['output'];
  node: FragranceCollectionItem;
};

export type FragranceConnection = {
  __typename?: 'FragranceConnection';
  edges: Array<FragranceEdge>;
  pageInfo: PageInfo;
};

export type FragranceEdge = {
  __typename?: 'FragranceEdge';
  cursor: Scalars['String']['output'];
  node: Fragrance;
};

export type FragranceImage = {
  __typename?: 'FragranceImage';
  alt?: Maybe<Scalars['String']['output']>;
  audit: Audit;
  bg?: Maybe<Scalars['String']['output']>;
  height: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  src: Scalars['String']['output'];
  width: Scalars['Int']['output'];
};

export type FragranceImageConnection = {
  __typename?: 'FragranceImageConnection';
  edges: Array<FragranceImageEdge>;
  pageInfo: PageInfo;
};

export type FragranceImageEdge = {
  __typename?: 'FragranceImageEdge';
  cursor: Scalars['String']['output'];
  node: FragranceImage;
};

export type FragranceNote = {
  __typename?: 'FragranceNote';
  audit: Audit;
  id: Scalars['Int']['output'];
  layer: NoteLayer;
  name: Scalars['String']['output'];
  noteId: Scalars['Int']['output'];
  thumbnail?: Maybe<Scalars['String']['output']>;
  votes: VoteSummary;
};

export type FragranceNoteConnection = {
  __typename?: 'FragranceNoteConnection';
  edges: Array<FragranceNoteEdge>;
  pageInfo: PageInfo;
};

export type FragranceNoteEdge = {
  __typename?: 'FragranceNoteEdge';
  cursor: Scalars['String']['output'];
  node: FragranceNote;
};

export type FragranceNotes = {
  __typename?: 'FragranceNotes';
  base: FragranceNoteConnection;
  fillerBase: FragranceNoteConnection;
  fillerMiddle: FragranceNoteConnection;
  fillerTop: FragranceNoteConnection;
  middle: FragranceNoteConnection;
  top: FragranceNoteConnection;
};


export type FragranceNotesBaseArgs = {
  input?: InputMaybe<VotePaginationInput>;
};


export type FragranceNotesFillerBaseArgs = {
  input?: InputMaybe<PaginationInput>;
};


export type FragranceNotesFillerMiddleArgs = {
  input?: InputMaybe<PaginationInput>;
};


export type FragranceNotesFillerTopArgs = {
  input?: InputMaybe<PaginationInput>;
};


export type FragranceNotesMiddleArgs = {
  input?: InputMaybe<VotePaginationInput>;
};


export type FragranceNotesTopArgs = {
  input?: InputMaybe<VotePaginationInput>;
};

export type FragranceReport = {
  __typename?: 'FragranceReport';
  fragrance: Fragrance;
  id: Scalars['Int']['output'];
  report: Scalars['String']['output'];
  user: User;
};

export type FragranceReview = {
  __typename?: 'FragranceReview';
  audit: Audit;
  fragrance: Fragrance;
  id: Scalars['Int']['output'];
  rating: Scalars['Int']['output'];
  text: Scalars['String']['output'];
  user: User;
  votes: VoteSummary;
};

export type FragranceReviewConnection = {
  __typename?: 'FragranceReviewConnection';
  edges: Array<FragranceReviewEdge>;
  pageInfo: PageInfo;
};

export type FragranceReviewDistribution = {
  __typename?: 'FragranceReviewDistribution';
  five: Scalars['Int']['output'];
  four: Scalars['Int']['output'];
  one: Scalars['Int']['output'];
  three: Scalars['Int']['output'];
  two: Scalars['Int']['output'];
};

export type FragranceReviewEdge = {
  __typename?: 'FragranceReviewEdge';
  cursor: Scalars['String']['output'];
  node: FragranceReview;
};

export type FragranceTrait = {
  __typename?: 'FragranceTrait';
  id: Scalars['Int']['output'];
  myVote?: Maybe<Scalars['Float']['output']>;
  type: FragranceTraitType;
  voteScore: Scalars['Float']['output'];
};

export const FragranceTraitType = {
  Allure: 'ALLURE',
  Balance: 'BALANCE',
  Complexity: 'COMPLEXITY',
  Gender: 'GENDER',
  Longevity: 'LONGEVITY',
  Sillage: 'SILLAGE'
} as const;

export type FragranceTraitType = typeof FragranceTraitType[keyof typeof FragranceTraitType];
export type FragranceVote = {
  __typename?: 'FragranceVote';
  audit: Audit;
  fragrance: Fragrance;
  id: Scalars['Int']['output'];
  user: User;
  vote: Scalars['Int']['output'];
};

export type FragranceVoteConnection = {
  __typename?: 'FragranceVoteConnection';
  edges: Array<FragranceVoteEdge>;
  pageInfo: PageInfo;
};

export type FragranceVoteEdge = {
  __typename?: 'FragranceVoteEdge';
  cursor: Scalars['String']['output'];
  node: FragranceVote;
};

export type GenericAuthResult = {
  __typename?: 'GenericAuthResult';
  complete: Scalars['Boolean']['output'];
};

export type LogFragranceViewInput = {
  fragranceId: Scalars['Int']['input'];
};

export type MoveFragranceCollectionItemInput = {
  collectionId: Scalars['Int']['input'];
  insertBefore: Scalars['Int']['input'];
  rangeLength?: InputMaybe<Scalars['Int']['input']>;
  rangeStart: Scalars['Int']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  confirmForgotPassword: GenericAuthResult;
  confirmFragranceImage: FragranceImage;
  confirmSignUp: User;
  createFragranceCollection: FragranceCollection;
  createFragranceCollectionItem: FragranceCollectionItem;
  createFragranceImage: AssetUploadPayload;
  createFragranceReport: FragranceReport;
  createReviewReport: ReviewReport;
  deleteFragranceCollectionItem: Array<FragranceCollectionItem>;
  deleteFragranceReview: FragranceReview;
  forgotPassword: DeliveryResult;
  logFragranceView: Scalars['Boolean']['output'];
  logIn: AuthPayload;
  logOut: Scalars['Boolean']['output'];
  moveFragranceCollectionItem: Array<FragranceCollectionItem>;
  refresh?: Maybe<AuthPayload>;
  resendSignUpConfirmationCode: DeliveryResult;
  signUp: DeliveryResult;
  upsertFragranceReview: FragranceReview;
  voteOnAccord: FragranceAccord;
  voteOnFragrance: FragranceVote;
  voteOnNote: FragranceNote;
  voteOnReview: FragranceReview;
  voteOnTrait: FragranceTrait;
};


export type MutationConfirmForgotPasswordArgs = {
  confirmationCode: Scalars['String']['input'];
  email: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};


export type MutationConfirmFragranceImageArgs = {
  input: ConfirmFragranceImageInput;
};


export type MutationConfirmSignUpArgs = {
  confirmationCode: Scalars['String']['input'];
  email: Scalars['String']['input'];
};


export type MutationCreateFragranceCollectionArgs = {
  input: CreateFragranceCollectionInput;
};


export type MutationCreateFragranceCollectionItemArgs = {
  input: CreateFragranceCollectionItemInput;
};


export type MutationCreateFragranceImageArgs = {
  input: CreateFragranceImageInput;
};


export type MutationCreateFragranceReportArgs = {
  input: CreateFragranceReportInput;
};


export type MutationCreateReviewReportArgs = {
  input: CreateReviewReportInput;
};


export type MutationDeleteFragranceCollectionItemArgs = {
  input: DeleteFragranceCollectionItemInput;
};


export type MutationDeleteFragranceReviewArgs = {
  input: DeleteFragranceReviewInput;
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String']['input'];
};


export type MutationLogFragranceViewArgs = {
  input: LogFragranceViewInput;
};


export type MutationLogInArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationMoveFragranceCollectionItemArgs = {
  input: MoveFragranceCollectionItemInput;
};


export type MutationResendSignUpConfirmationCodeArgs = {
  email: Scalars['String']['input'];
};


export type MutationSignUpArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationUpsertFragranceReviewArgs = {
  input: UpsertFragranceReviewInput;
};


export type MutationVoteOnAccordArgs = {
  input: VoteOnAccordInput;
};


export type MutationVoteOnFragranceArgs = {
  input: VoteOnFragranceInput;
};


export type MutationVoteOnNoteArgs = {
  input: VoteOnNoteInput;
};


export type MutationVoteOnReviewArgs = {
  input: VoteOnReviewInput;
};


export type MutationVoteOnTraitArgs = {
  input: VoteOnTraitInput;
};

export type Note = {
  __typename?: 'Note';
  audit: Audit;
  id: Scalars['Int']['output'];
  name?: Maybe<Scalars['String']['output']>;
  thumbnail?: Maybe<Scalars['String']['output']>;
};

export type NoteConnection = {
  __typename?: 'NoteConnection';
  edges: Array<NoteEdge>;
  pageInfo: PageInfo;
};

export type NoteEdge = {
  __typename?: 'NoteEdge';
  cursor: Scalars['String']['output'];
  node: Note;
};

export const NoteLayer = {
  Base: 'BASE',
  Middle: 'MIDDLE',
  Top: 'TOP'
} as const;

export type NoteLayer = typeof NoteLayer[keyof typeof NoteLayer];
export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type PaginationInput = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortByInput>;
};

export type Query = {
  __typename?: 'Query';
  accords: AccordConnection;
  collection: FragranceCollection;
  fragrance?: Maybe<Fragrance>;
  fragrances: FragranceConnection;
  me?: Maybe<User>;
  notes: NoteConnection;
  searchFillerFragranceNotes: FragranceNoteConnection;
  searchFragranceAccords: FragranceAccordConnection;
  searchFragranceNotes: FragranceNoteConnection;
  searchFragrances: FragranceConnection;
  user?: Maybe<User>;
};


export type QueryAccordsArgs = {
  input?: InputMaybe<PaginationInput>;
};


export type QueryCollectionArgs = {
  id: Scalars['Int']['input'];
};


export type QueryFragranceArgs = {
  id: Scalars['Int']['input'];
};


export type QueryFragrancesArgs = {
  input?: InputMaybe<PaginationInput>;
};


export type QueryNotesArgs = {
  input?: InputMaybe<PaginationInput>;
};


export type QuerySearchFillerFragranceNotesArgs = {
  input?: InputMaybe<SearchFragranceNotesInput>;
};


export type QuerySearchFragranceAccordsArgs = {
  input?: InputMaybe<SearchInput>;
};


export type QuerySearchFragranceNotesArgs = {
  input?: InputMaybe<SearchFragranceNotesInput>;
};


export type QuerySearchFragrancesArgs = {
  input?: InputMaybe<SearchFragrancesInput>;
};


export type QueryUserArgs = {
  id: Scalars['Int']['input'];
};

export type ReviewReport = {
  __typename?: 'ReviewReport';
  id: Scalars['Int']['output'];
  report: Scalars['String']['output'];
  review: FragranceReview;
  user: User;
};

export type SearchFragranceNotesInput = {
  layer?: InputMaybe<NoteLayer>;
  pagination?: InputMaybe<VotePaginationInput>;
  query?: InputMaybe<Scalars['String']['input']>;
};

export type SearchFragrancesInput = {
  pagination?: InputMaybe<PaginationInput>;
  query?: InputMaybe<Scalars['String']['input']>;
};

export type SearchInput = {
  pagination?: InputMaybe<SearchPaginationInput>;
  query?: InputMaybe<Scalars['String']['input']>;
};

export type SearchPaginationInput = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SearchSortByInput>;
};

export const SearchSortBy = {
  Relevance: 'RELEVANCE'
} as const;

export type SearchSortBy = typeof SearchSortBy[keyof typeof SearchSortBy];
export type SearchSortByInput = {
  by?: InputMaybe<SearchSortBy>;
};

export const SortBy = {
  Id: 'ID',
  Updated: 'UPDATED'
} as const;

export type SortBy = typeof SortBy[keyof typeof SortBy];
export type SortByInput = {
  by?: InputMaybe<SortBy>;
  direction?: InputMaybe<SortDirection>;
};

export const SortDirection = {
  Ascending: 'ASCENDING',
  Descending: 'DESCENDING'
} as const;

export type SortDirection = typeof SortDirection[keyof typeof SortDirection];
export type UpsertFragranceReviewInput = {
  fragranceId: Scalars['Int']['input'];
  rating: Scalars['Int']['input'];
  review: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  audit: Audit;
  collections: FragranceCollectionConnection;
  email: Scalars['String']['output'];
  followerCount: Scalars['Int']['output'];
  followingCount: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  likes: FragranceVoteConnection;
  reviews: FragranceReviewConnection;
  username: Scalars['String']['output'];
};


export type UserCollectionsArgs = {
  input?: InputMaybe<PaginationInput>;
};


export type UserLikesArgs = {
  input?: InputMaybe<PaginationInput>;
};


export type UserReviewsArgs = {
  input?: InputMaybe<PaginationInput>;
};

export type VoteOnAccordInput = {
  accordId: Scalars['Int']['input'];
  fragranceId: Scalars['Int']['input'];
  vote?: InputMaybe<Scalars['Boolean']['input']>;
};

export type VoteOnFragranceInput = {
  fragranceId: Scalars['Int']['input'];
  vote?: InputMaybe<Scalars['Boolean']['input']>;
};

export type VoteOnNoteInput = {
  fragranceId: Scalars['Int']['input'];
  layer: NoteLayer;
  noteId: Scalars['Int']['input'];
  vote?: InputMaybe<Scalars['Boolean']['input']>;
};

export type VoteOnReviewInput = {
  reviewId: Scalars['Int']['input'];
  vote?: InputMaybe<Scalars['Boolean']['input']>;
};

export type VoteOnTraitInput = {
  fragranceTraitId: Scalars['Int']['input'];
  vote: Scalars['Float']['input'];
};

export type VotePaginationInput = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<VoteSortByInput>;
};

export const VoteSortBy = {
  Id: 'ID',
  Updated: 'UPDATED',
  Votes: 'VOTES'
} as const;

export type VoteSortBy = typeof VoteSortBy[keyof typeof VoteSortBy];
export type VoteSortByInput = {
  by?: InputMaybe<VoteSortBy>;
  direction?: InputMaybe<SortDirection>;
};

export type VoteSummary = {
  __typename?: 'VoteSummary';
  dislikesCount: Scalars['Int']['output'];
  likesCount: Scalars['Int']['output'];
  myVote?: Maybe<Scalars['Boolean']['output']>;
  voteScore: Scalars['Int']['output'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Accord: ResolverTypeWrapper<Partial<Accord>>;
  AccordConnection: ResolverTypeWrapper<Partial<AccordConnection>>;
  AccordEdge: ResolverTypeWrapper<Partial<AccordEdge>>;
  Asset: ResolverTypeWrapper<Partial<Asset>>;
  AssetStatus: ResolverTypeWrapper<Partial<AssetStatus>>;
  AssetUploadPayload: ResolverTypeWrapper<Partial<AssetUploadPayload>>;
  Audit: ResolverTypeWrapper<Partial<Audit>>;
  AuthPayload: ResolverTypeWrapper<Partial<AuthPayload>>;
  Boolean: ResolverTypeWrapper<Partial<Scalars['Boolean']['output']>>;
  CodeDeliveryDetails: ResolverTypeWrapper<Partial<CodeDeliveryDetails>>;
  ConfirmFragranceImageInput: ResolverTypeWrapper<Partial<ConfirmFragranceImageInput>>;
  ControlledPaginationInput: ResolverTypeWrapper<Partial<ControlledPaginationInput>>;
  ControlledSortByInput: ResolverTypeWrapper<Partial<ControlledSortByInput>>;
  CreateFragranceCollectionInput: ResolverTypeWrapper<Partial<CreateFragranceCollectionInput>>;
  CreateFragranceCollectionItemInput: ResolverTypeWrapper<Partial<CreateFragranceCollectionItemInput>>;
  CreateFragranceImageInput: ResolverTypeWrapper<Partial<CreateFragranceImageInput>>;
  CreateFragranceReportInput: ResolverTypeWrapper<Partial<CreateFragranceReportInput>>;
  CreateReviewReportInput: ResolverTypeWrapper<Partial<CreateReviewReportInput>>;
  Date: ResolverTypeWrapper<Partial<Scalars['Date']['output']>>;
  DeleteFragranceCollectionItemInput: ResolverTypeWrapper<Partial<DeleteFragranceCollectionItemInput>>;
  DeleteFragranceReviewInput: ResolverTypeWrapper<Partial<DeleteFragranceReviewInput>>;
  DeliveryResult: ResolverTypeWrapper<Partial<DeliveryResult>>;
  Float: ResolverTypeWrapper<Partial<Scalars['Float']['output']>>;
  Fragrance: ResolverTypeWrapper<FragranceSummary>;
  FragranceAccord: ResolverTypeWrapper<Partial<FragranceAccord>>;
  FragranceAccordConnection: ResolverTypeWrapper<Partial<FragranceAccordConnection>>;
  FragranceAccordEdge: ResolverTypeWrapper<Partial<FragranceAccordEdge>>;
  FragranceCollection: ResolverTypeWrapper<FragranceCollectionSummary>;
  FragranceCollectionConnection: ResolverTypeWrapper<Partial<Omit<FragranceCollectionConnection, 'edges'> & { edges: Array<ResolversTypes['FragranceCollectionEdge']> }>>;
  FragranceCollectionEdge: ResolverTypeWrapper<FragranceCollectionSummaryEdge>;
  FragranceCollectionItem: ResolverTypeWrapper<FragranceCollectionItemSummary>;
  FragranceCollectionItemConnection: ResolverTypeWrapper<Partial<Omit<FragranceCollectionItemConnection, 'edges'> & { edges: Array<ResolversTypes['FragranceCollectionItemEdge']> }>>;
  FragranceCollectionItemEdge: ResolverTypeWrapper<FragranceCollectionItemSummaryEdge>;
  FragranceConnection: ResolverTypeWrapper<Partial<Omit<FragranceConnection, 'edges'> & { edges: Array<ResolversTypes['FragranceEdge']> }>>;
  FragranceEdge: ResolverTypeWrapper<FragranceSummaryEdge>;
  FragranceImage: ResolverTypeWrapper<Partial<FragranceImage>>;
  FragranceImageConnection: ResolverTypeWrapper<Partial<FragranceImageConnection>>;
  FragranceImageEdge: ResolverTypeWrapper<Partial<FragranceImageEdge>>;
  FragranceNote: ResolverTypeWrapper<Partial<FragranceNote>>;
  FragranceNoteConnection: ResolverTypeWrapper<Partial<FragranceNoteConnection>>;
  FragranceNoteEdge: ResolverTypeWrapper<Partial<FragranceNoteEdge>>;
  FragranceNotes: ResolverTypeWrapper<FragranceNotesSummary>;
  FragranceReport: ResolverTypeWrapper<Partial<Omit<FragranceReport, 'fragrance' | 'user'> & { fragrance: ResolversTypes['Fragrance'], user: ResolversTypes['User'] }>>;
  FragranceReview: ResolverTypeWrapper<FragranceReviewSummary>;
  FragranceReviewConnection: ResolverTypeWrapper<Partial<Omit<FragranceReviewConnection, 'edges'> & { edges: Array<ResolversTypes['FragranceReviewEdge']> }>>;
  FragranceReviewDistribution: ResolverTypeWrapper<Partial<FragranceReviewDistribution>>;
  FragranceReviewEdge: ResolverTypeWrapper<FragranceReviewSummaryEdge>;
  FragranceTrait: ResolverTypeWrapper<Partial<FragranceTrait>>;
  FragranceTraitType: ResolverTypeWrapper<Partial<FragranceTraitType>>;
  FragranceVote: ResolverTypeWrapper<FragranceVoteSummary>;
  FragranceVoteConnection: ResolverTypeWrapper<Partial<Omit<FragranceVoteConnection, 'edges'> & { edges: Array<ResolversTypes['FragranceVoteEdge']> }>>;
  FragranceVoteEdge: ResolverTypeWrapper<FragranceVoteSummaryEdge>;
  GenericAuthResult: ResolverTypeWrapper<Partial<GenericAuthResult>>;
  Int: ResolverTypeWrapper<Partial<Scalars['Int']['output']>>;
  JSON: ResolverTypeWrapper<Partial<Scalars['JSON']['output']>>;
  LogFragranceViewInput: ResolverTypeWrapper<Partial<LogFragranceViewInput>>;
  MoveFragranceCollectionItemInput: ResolverTypeWrapper<Partial<MoveFragranceCollectionItemInput>>;
  Mutation: ResolverTypeWrapper<{}>;
  Note: ResolverTypeWrapper<Partial<Note>>;
  NoteConnection: ResolverTypeWrapper<Partial<NoteConnection>>;
  NoteEdge: ResolverTypeWrapper<Partial<NoteEdge>>;
  NoteLayer: ResolverTypeWrapper<Partial<NoteLayer>>;
  PageInfo: ResolverTypeWrapper<Partial<PageInfo>>;
  PaginationInput: ResolverTypeWrapper<Partial<PaginationInput>>;
  Query: ResolverTypeWrapper<{}>;
  ReviewReport: ResolverTypeWrapper<Partial<Omit<ReviewReport, 'review' | 'user'> & { review: ResolversTypes['FragranceReview'], user: ResolversTypes['User'] }>>;
  SearchFragranceNotesInput: ResolverTypeWrapper<Partial<SearchFragranceNotesInput>>;
  SearchFragrancesInput: ResolverTypeWrapper<Partial<SearchFragrancesInput>>;
  SearchInput: ResolverTypeWrapper<Partial<SearchInput>>;
  SearchPaginationInput: ResolverTypeWrapper<Partial<SearchPaginationInput>>;
  SearchSortBy: ResolverTypeWrapper<Partial<SearchSortBy>>;
  SearchSortByInput: ResolverTypeWrapper<Partial<SearchSortByInput>>;
  SortBy: ResolverTypeWrapper<Partial<SortBy>>;
  SortByInput: ResolverTypeWrapper<Partial<SortByInput>>;
  SortDirection: ResolverTypeWrapper<Partial<SortDirection>>;
  String: ResolverTypeWrapper<Partial<Scalars['String']['output']>>;
  UpsertFragranceReviewInput: ResolverTypeWrapper<Partial<UpsertFragranceReviewInput>>;
  User: ResolverTypeWrapper<UserSummary>;
  VoteOnAccordInput: ResolverTypeWrapper<Partial<VoteOnAccordInput>>;
  VoteOnFragranceInput: ResolverTypeWrapper<Partial<VoteOnFragranceInput>>;
  VoteOnNoteInput: ResolverTypeWrapper<Partial<VoteOnNoteInput>>;
  VoteOnReviewInput: ResolverTypeWrapper<Partial<VoteOnReviewInput>>;
  VoteOnTraitInput: ResolverTypeWrapper<Partial<VoteOnTraitInput>>;
  VotePaginationInput: ResolverTypeWrapper<Partial<VotePaginationInput>>;
  VoteSortBy: ResolverTypeWrapper<Partial<VoteSortBy>>;
  VoteSortByInput: ResolverTypeWrapper<Partial<VoteSortByInput>>;
  VoteSummary: ResolverTypeWrapper<Partial<VoteSummary>>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Accord: Partial<Accord>;
  AccordConnection: Partial<AccordConnection>;
  AccordEdge: Partial<AccordEdge>;
  Asset: Partial<Asset>;
  AssetUploadPayload: Partial<AssetUploadPayload>;
  Audit: Partial<Audit>;
  AuthPayload: Partial<AuthPayload>;
  Boolean: Partial<Scalars['Boolean']['output']>;
  CodeDeliveryDetails: Partial<CodeDeliveryDetails>;
  ConfirmFragranceImageInput: Partial<ConfirmFragranceImageInput>;
  ControlledPaginationInput: Partial<ControlledPaginationInput>;
  ControlledSortByInput: Partial<ControlledSortByInput>;
  CreateFragranceCollectionInput: Partial<CreateFragranceCollectionInput>;
  CreateFragranceCollectionItemInput: Partial<CreateFragranceCollectionItemInput>;
  CreateFragranceImageInput: Partial<CreateFragranceImageInput>;
  CreateFragranceReportInput: Partial<CreateFragranceReportInput>;
  CreateReviewReportInput: Partial<CreateReviewReportInput>;
  Date: Partial<Scalars['Date']['output']>;
  DeleteFragranceCollectionItemInput: Partial<DeleteFragranceCollectionItemInput>;
  DeleteFragranceReviewInput: Partial<DeleteFragranceReviewInput>;
  DeliveryResult: Partial<DeliveryResult>;
  Float: Partial<Scalars['Float']['output']>;
  Fragrance: FragranceSummary;
  FragranceAccord: Partial<FragranceAccord>;
  FragranceAccordConnection: Partial<FragranceAccordConnection>;
  FragranceAccordEdge: Partial<FragranceAccordEdge>;
  FragranceCollection: FragranceCollectionSummary;
  FragranceCollectionConnection: Partial<Omit<FragranceCollectionConnection, 'edges'> & { edges: Array<ResolversParentTypes['FragranceCollectionEdge']> }>;
  FragranceCollectionEdge: FragranceCollectionSummaryEdge;
  FragranceCollectionItem: FragranceCollectionItemSummary;
  FragranceCollectionItemConnection: Partial<Omit<FragranceCollectionItemConnection, 'edges'> & { edges: Array<ResolversParentTypes['FragranceCollectionItemEdge']> }>;
  FragranceCollectionItemEdge: FragranceCollectionItemSummaryEdge;
  FragranceConnection: Partial<Omit<FragranceConnection, 'edges'> & { edges: Array<ResolversParentTypes['FragranceEdge']> }>;
  FragranceEdge: FragranceSummaryEdge;
  FragranceImage: Partial<FragranceImage>;
  FragranceImageConnection: Partial<FragranceImageConnection>;
  FragranceImageEdge: Partial<FragranceImageEdge>;
  FragranceNote: Partial<FragranceNote>;
  FragranceNoteConnection: Partial<FragranceNoteConnection>;
  FragranceNoteEdge: Partial<FragranceNoteEdge>;
  FragranceNotes: FragranceNotesSummary;
  FragranceReport: Partial<Omit<FragranceReport, 'fragrance' | 'user'> & { fragrance: ResolversParentTypes['Fragrance'], user: ResolversParentTypes['User'] }>;
  FragranceReview: FragranceReviewSummary;
  FragranceReviewConnection: Partial<Omit<FragranceReviewConnection, 'edges'> & { edges: Array<ResolversParentTypes['FragranceReviewEdge']> }>;
  FragranceReviewDistribution: Partial<FragranceReviewDistribution>;
  FragranceReviewEdge: FragranceReviewSummaryEdge;
  FragranceTrait: Partial<FragranceTrait>;
  FragranceVote: FragranceVoteSummary;
  FragranceVoteConnection: Partial<Omit<FragranceVoteConnection, 'edges'> & { edges: Array<ResolversParentTypes['FragranceVoteEdge']> }>;
  FragranceVoteEdge: FragranceVoteSummaryEdge;
  GenericAuthResult: Partial<GenericAuthResult>;
  Int: Partial<Scalars['Int']['output']>;
  JSON: Partial<Scalars['JSON']['output']>;
  LogFragranceViewInput: Partial<LogFragranceViewInput>;
  MoveFragranceCollectionItemInput: Partial<MoveFragranceCollectionItemInput>;
  Mutation: {};
  Note: Partial<Note>;
  NoteConnection: Partial<NoteConnection>;
  NoteEdge: Partial<NoteEdge>;
  PageInfo: Partial<PageInfo>;
  PaginationInput: Partial<PaginationInput>;
  Query: {};
  ReviewReport: Partial<Omit<ReviewReport, 'review' | 'user'> & { review: ResolversParentTypes['FragranceReview'], user: ResolversParentTypes['User'] }>;
  SearchFragranceNotesInput: Partial<SearchFragranceNotesInput>;
  SearchFragrancesInput: Partial<SearchFragrancesInput>;
  SearchInput: Partial<SearchInput>;
  SearchPaginationInput: Partial<SearchPaginationInput>;
  SearchSortByInput: Partial<SearchSortByInput>;
  SortByInput: Partial<SortByInput>;
  String: Partial<Scalars['String']['output']>;
  UpsertFragranceReviewInput: Partial<UpsertFragranceReviewInput>;
  User: UserSummary;
  VoteOnAccordInput: Partial<VoteOnAccordInput>;
  VoteOnFragranceInput: Partial<VoteOnFragranceInput>;
  VoteOnNoteInput: Partial<VoteOnNoteInput>;
  VoteOnReviewInput: Partial<VoteOnReviewInput>;
  VoteOnTraitInput: Partial<VoteOnTraitInput>;
  VotePaginationInput: Partial<VotePaginationInput>;
  VoteSortByInput: Partial<VoteSortByInput>;
  VoteSummary: Partial<VoteSummary>;
}>;

export type AccordResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['Accord'] = ResolversParentTypes['Accord']> = ResolversObject<{
  audit?: Resolver<ResolversTypes['Audit'], ParentType, ContextType>;
  color?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AccordConnectionResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['AccordConnection'] = ResolversParentTypes['AccordConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['AccordEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AccordEdgeResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['AccordEdge'] = ResolversParentTypes['AccordEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Accord'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AssetResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['Asset'] = ResolversParentTypes['Asset']> = ResolversObject<{
  alt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  audit?: Resolver<ResolversTypes['Audit'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  src?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AssetUploadPayloadResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['AssetUploadPayload'] = ResolversParentTypes['AssetUploadPayload']> = ResolversObject<{
  fields?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  s3Key?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AuditResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['Audit'] = ResolversParentTypes['Audit']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  deletedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AuthPayloadResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['AuthPayload'] = ResolversParentTypes['AuthPayload']> = ResolversObject<{
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  expiresIn?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  idToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CodeDeliveryDetailsResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['CodeDeliveryDetails'] = ResolversParentTypes['CodeDeliveryDetails']> = ResolversObject<{
  attribute?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  destination?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  method?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type DeliveryResultResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['DeliveryResult'] = ResolversParentTypes['DeliveryResult']> = ResolversObject<{
  complete?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  delivery?: Resolver<Maybe<ResolversTypes['CodeDeliveryDetails']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['Fragrance'] = ResolversParentTypes['Fragrance']> = ResolversObject<{
  accords?: Resolver<ResolversTypes['FragranceAccordConnection'], ParentType, ContextType, Partial<FragranceAccordsArgs>>;
  audit?: Resolver<ResolversTypes['Audit'], ParentType, ContextType>;
  brand?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fillerAccords?: Resolver<ResolversTypes['FragranceAccordConnection'], ParentType, ContextType, Partial<FragranceFillerAccordsArgs>>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  images?: Resolver<ResolversTypes['FragranceImageConnection'], ParentType, ContextType, Partial<FragranceImagesArgs>>;
  myReview?: Resolver<Maybe<ResolversTypes['FragranceReview']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  notes?: Resolver<ResolversTypes['FragranceNotes'], ParentType, ContextType>;
  rating?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  reviewDistribution?: Resolver<ResolversTypes['FragranceReviewDistribution'], ParentType, ContextType>;
  reviews?: Resolver<ResolversTypes['FragranceReviewConnection'], ParentType, ContextType, Partial<FragranceReviewsArgs>>;
  reviewsCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  traits?: Resolver<Array<ResolversTypes['FragranceTrait']>, ParentType, ContextType>;
  votes?: Resolver<ResolversTypes['VoteSummary'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceAccordResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['FragranceAccord'] = ResolversParentTypes['FragranceAccord']> = ResolversObject<{
  accordId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  audit?: Resolver<ResolversTypes['Audit'], ParentType, ContextType>;
  color?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  votes?: Resolver<ResolversTypes['VoteSummary'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceAccordConnectionResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['FragranceAccordConnection'] = ResolversParentTypes['FragranceAccordConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['FragranceAccordEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceAccordEdgeResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['FragranceAccordEdge'] = ResolversParentTypes['FragranceAccordEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['FragranceAccord'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceCollectionResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['FragranceCollection'] = ResolversParentTypes['FragranceCollection']> = ResolversObject<{
  audit?: Resolver<ResolversTypes['Audit'], ParentType, ContextType>;
  hasFragrance?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, Partial<FragranceCollectionHasFragranceArgs>>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  items?: Resolver<ResolversTypes['FragranceCollectionItemConnection'], ParentType, ContextType, Partial<FragranceCollectionItemsArgs>>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceCollectionConnectionResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['FragranceCollectionConnection'] = ResolversParentTypes['FragranceCollectionConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['FragranceCollectionEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceCollectionEdgeResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['FragranceCollectionEdge'] = ResolversParentTypes['FragranceCollectionEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['FragranceCollection'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceCollectionItemResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['FragranceCollectionItem'] = ResolversParentTypes['FragranceCollectionItem']> = ResolversObject<{
  audit?: Resolver<ResolversTypes['Audit'], ParentType, ContextType>;
  fragrance?: Resolver<ResolversTypes['Fragrance'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  rank?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceCollectionItemConnectionResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['FragranceCollectionItemConnection'] = ResolversParentTypes['FragranceCollectionItemConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['FragranceCollectionItemEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceCollectionItemEdgeResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['FragranceCollectionItemEdge'] = ResolversParentTypes['FragranceCollectionItemEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['FragranceCollectionItem'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceConnectionResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['FragranceConnection'] = ResolversParentTypes['FragranceConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['FragranceEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceEdgeResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['FragranceEdge'] = ResolversParentTypes['FragranceEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Fragrance'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceImageResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['FragranceImage'] = ResolversParentTypes['FragranceImage']> = ResolversObject<{
  alt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  audit?: Resolver<ResolversTypes['Audit'], ParentType, ContextType>;
  bg?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  height?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  src?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  width?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceImageConnectionResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['FragranceImageConnection'] = ResolversParentTypes['FragranceImageConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['FragranceImageEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceImageEdgeResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['FragranceImageEdge'] = ResolversParentTypes['FragranceImageEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['FragranceImage'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceNoteResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['FragranceNote'] = ResolversParentTypes['FragranceNote']> = ResolversObject<{
  audit?: Resolver<ResolversTypes['Audit'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  layer?: Resolver<ResolversTypes['NoteLayer'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  noteId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  thumbnail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  votes?: Resolver<ResolversTypes['VoteSummary'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceNoteConnectionResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['FragranceNoteConnection'] = ResolversParentTypes['FragranceNoteConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['FragranceNoteEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceNoteEdgeResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['FragranceNoteEdge'] = ResolversParentTypes['FragranceNoteEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['FragranceNote'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceNotesResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['FragranceNotes'] = ResolversParentTypes['FragranceNotes']> = ResolversObject<{
  base?: Resolver<ResolversTypes['FragranceNoteConnection'], ParentType, ContextType, Partial<FragranceNotesBaseArgs>>;
  fillerBase?: Resolver<ResolversTypes['FragranceNoteConnection'], ParentType, ContextType, Partial<FragranceNotesFillerBaseArgs>>;
  fillerMiddle?: Resolver<ResolversTypes['FragranceNoteConnection'], ParentType, ContextType, Partial<FragranceNotesFillerMiddleArgs>>;
  fillerTop?: Resolver<ResolversTypes['FragranceNoteConnection'], ParentType, ContextType, Partial<FragranceNotesFillerTopArgs>>;
  middle?: Resolver<ResolversTypes['FragranceNoteConnection'], ParentType, ContextType, Partial<FragranceNotesMiddleArgs>>;
  top?: Resolver<ResolversTypes['FragranceNoteConnection'], ParentType, ContextType, Partial<FragranceNotesTopArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceReportResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['FragranceReport'] = ResolversParentTypes['FragranceReport']> = ResolversObject<{
  fragrance?: Resolver<ResolversTypes['Fragrance'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  report?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceReviewResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['FragranceReview'] = ResolversParentTypes['FragranceReview']> = ResolversObject<{
  audit?: Resolver<ResolversTypes['Audit'], ParentType, ContextType>;
  fragrance?: Resolver<ResolversTypes['Fragrance'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  rating?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  votes?: Resolver<ResolversTypes['VoteSummary'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceReviewConnectionResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['FragranceReviewConnection'] = ResolversParentTypes['FragranceReviewConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['FragranceReviewEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceReviewDistributionResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['FragranceReviewDistribution'] = ResolversParentTypes['FragranceReviewDistribution']> = ResolversObject<{
  five?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  four?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  one?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  three?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  two?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceReviewEdgeResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['FragranceReviewEdge'] = ResolversParentTypes['FragranceReviewEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['FragranceReview'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceTraitResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['FragranceTrait'] = ResolversParentTypes['FragranceTrait']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  myVote?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['FragranceTraitType'], ParentType, ContextType>;
  voteScore?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceVoteResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['FragranceVote'] = ResolversParentTypes['FragranceVote']> = ResolversObject<{
  audit?: Resolver<ResolversTypes['Audit'], ParentType, ContextType>;
  fragrance?: Resolver<ResolversTypes['Fragrance'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  vote?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceVoteConnectionResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['FragranceVoteConnection'] = ResolversParentTypes['FragranceVoteConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['FragranceVoteEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceVoteEdgeResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['FragranceVoteEdge'] = ResolversParentTypes['FragranceVoteEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['FragranceVote'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GenericAuthResultResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['GenericAuthResult'] = ResolversParentTypes['GenericAuthResult']> = ResolversObject<{
  complete?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type MutationResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  confirmForgotPassword?: Resolver<ResolversTypes['GenericAuthResult'], ParentType, ContextType, RequireFields<MutationConfirmForgotPasswordArgs, 'confirmationCode' | 'email' | 'newPassword'>>;
  confirmFragranceImage?: Resolver<ResolversTypes['FragranceImage'], ParentType, ContextType, RequireFields<MutationConfirmFragranceImageArgs, 'input'>>;
  confirmSignUp?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationConfirmSignUpArgs, 'confirmationCode' | 'email'>>;
  createFragranceCollection?: Resolver<ResolversTypes['FragranceCollection'], ParentType, ContextType, RequireFields<MutationCreateFragranceCollectionArgs, 'input'>>;
  createFragranceCollectionItem?: Resolver<ResolversTypes['FragranceCollectionItem'], ParentType, ContextType, RequireFields<MutationCreateFragranceCollectionItemArgs, 'input'>>;
  createFragranceImage?: Resolver<ResolversTypes['AssetUploadPayload'], ParentType, ContextType, RequireFields<MutationCreateFragranceImageArgs, 'input'>>;
  createFragranceReport?: Resolver<ResolversTypes['FragranceReport'], ParentType, ContextType, RequireFields<MutationCreateFragranceReportArgs, 'input'>>;
  createReviewReport?: Resolver<ResolversTypes['ReviewReport'], ParentType, ContextType, RequireFields<MutationCreateReviewReportArgs, 'input'>>;
  deleteFragranceCollectionItem?: Resolver<Array<ResolversTypes['FragranceCollectionItem']>, ParentType, ContextType, RequireFields<MutationDeleteFragranceCollectionItemArgs, 'input'>>;
  deleteFragranceReview?: Resolver<ResolversTypes['FragranceReview'], ParentType, ContextType, RequireFields<MutationDeleteFragranceReviewArgs, 'input'>>;
  forgotPassword?: Resolver<ResolversTypes['DeliveryResult'], ParentType, ContextType, RequireFields<MutationForgotPasswordArgs, 'email'>>;
  logFragranceView?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationLogFragranceViewArgs, 'input'>>;
  logIn?: Resolver<ResolversTypes['AuthPayload'], ParentType, ContextType, RequireFields<MutationLogInArgs, 'email' | 'password'>>;
  logOut?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  moveFragranceCollectionItem?: Resolver<Array<ResolversTypes['FragranceCollectionItem']>, ParentType, ContextType, RequireFields<MutationMoveFragranceCollectionItemArgs, 'input'>>;
  refresh?: Resolver<Maybe<ResolversTypes['AuthPayload']>, ParentType, ContextType>;
  resendSignUpConfirmationCode?: Resolver<ResolversTypes['DeliveryResult'], ParentType, ContextType, RequireFields<MutationResendSignUpConfirmationCodeArgs, 'email'>>;
  signUp?: Resolver<ResolversTypes['DeliveryResult'], ParentType, ContextType, RequireFields<MutationSignUpArgs, 'email' | 'password'>>;
  upsertFragranceReview?: Resolver<ResolversTypes['FragranceReview'], ParentType, ContextType, RequireFields<MutationUpsertFragranceReviewArgs, 'input'>>;
  voteOnAccord?: Resolver<ResolversTypes['FragranceAccord'], ParentType, ContextType, RequireFields<MutationVoteOnAccordArgs, 'input'>>;
  voteOnFragrance?: Resolver<ResolversTypes['FragranceVote'], ParentType, ContextType, RequireFields<MutationVoteOnFragranceArgs, 'input'>>;
  voteOnNote?: Resolver<ResolversTypes['FragranceNote'], ParentType, ContextType, RequireFields<MutationVoteOnNoteArgs, 'input'>>;
  voteOnReview?: Resolver<ResolversTypes['FragranceReview'], ParentType, ContextType, RequireFields<MutationVoteOnReviewArgs, 'input'>>;
  voteOnTrait?: Resolver<ResolversTypes['FragranceTrait'], ParentType, ContextType, RequireFields<MutationVoteOnTraitArgs, 'input'>>;
}>;

export type NoteResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['Note'] = ResolversParentTypes['Note']> = ResolversObject<{
  audit?: Resolver<ResolversTypes['Audit'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  thumbnail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type NoteConnectionResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['NoteConnection'] = ResolversParentTypes['NoteConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['NoteEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type NoteEdgeResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['NoteEdge'] = ResolversParentTypes['NoteEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Note'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PageInfoResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = ResolversObject<{
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  startCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  accords?: Resolver<ResolversTypes['AccordConnection'], ParentType, ContextType, Partial<QueryAccordsArgs>>;
  collection?: Resolver<ResolversTypes['FragranceCollection'], ParentType, ContextType, RequireFields<QueryCollectionArgs, 'id'>>;
  fragrance?: Resolver<Maybe<ResolversTypes['Fragrance']>, ParentType, ContextType, RequireFields<QueryFragranceArgs, 'id'>>;
  fragrances?: Resolver<ResolversTypes['FragranceConnection'], ParentType, ContextType, Partial<QueryFragrancesArgs>>;
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  notes?: Resolver<ResolversTypes['NoteConnection'], ParentType, ContextType, Partial<QueryNotesArgs>>;
  searchFillerFragranceNotes?: Resolver<ResolversTypes['FragranceNoteConnection'], ParentType, ContextType, Partial<QuerySearchFillerFragranceNotesArgs>>;
  searchFragranceAccords?: Resolver<ResolversTypes['FragranceAccordConnection'], ParentType, ContextType, Partial<QuerySearchFragranceAccordsArgs>>;
  searchFragranceNotes?: Resolver<ResolversTypes['FragranceNoteConnection'], ParentType, ContextType, Partial<QuerySearchFragranceNotesArgs>>;
  searchFragrances?: Resolver<ResolversTypes['FragranceConnection'], ParentType, ContextType, Partial<QuerySearchFragrancesArgs>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
}>;

export type ReviewReportResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['ReviewReport'] = ResolversParentTypes['ReviewReport']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  report?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  review?: Resolver<ResolversTypes['FragranceReview'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  audit?: Resolver<ResolversTypes['Audit'], ParentType, ContextType>;
  collections?: Resolver<ResolversTypes['FragranceCollectionConnection'], ParentType, ContextType, Partial<UserCollectionsArgs>>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  followerCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  followingCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  likes?: Resolver<ResolversTypes['FragranceVoteConnection'], ParentType, ContextType, Partial<UserLikesArgs>>;
  reviews?: Resolver<ResolversTypes['FragranceReviewConnection'], ParentType, ContextType, Partial<UserReviewsArgs>>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VoteSummaryResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['VoteSummary'] = ResolversParentTypes['VoteSummary']> = ResolversObject<{
  dislikesCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  likesCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  myVote?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  voteScore?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = ApiContext> = ResolversObject<{
  Accord?: AccordResolvers<ContextType>;
  AccordConnection?: AccordConnectionResolvers<ContextType>;
  AccordEdge?: AccordEdgeResolvers<ContextType>;
  Asset?: AssetResolvers<ContextType>;
  AssetUploadPayload?: AssetUploadPayloadResolvers<ContextType>;
  Audit?: AuditResolvers<ContextType>;
  AuthPayload?: AuthPayloadResolvers<ContextType>;
  CodeDeliveryDetails?: CodeDeliveryDetailsResolvers<ContextType>;
  Date?: GraphQLScalarType;
  DeliveryResult?: DeliveryResultResolvers<ContextType>;
  Fragrance?: FragranceResolvers<ContextType>;
  FragranceAccord?: FragranceAccordResolvers<ContextType>;
  FragranceAccordConnection?: FragranceAccordConnectionResolvers<ContextType>;
  FragranceAccordEdge?: FragranceAccordEdgeResolvers<ContextType>;
  FragranceCollection?: FragranceCollectionResolvers<ContextType>;
  FragranceCollectionConnection?: FragranceCollectionConnectionResolvers<ContextType>;
  FragranceCollectionEdge?: FragranceCollectionEdgeResolvers<ContextType>;
  FragranceCollectionItem?: FragranceCollectionItemResolvers<ContextType>;
  FragranceCollectionItemConnection?: FragranceCollectionItemConnectionResolvers<ContextType>;
  FragranceCollectionItemEdge?: FragranceCollectionItemEdgeResolvers<ContextType>;
  FragranceConnection?: FragranceConnectionResolvers<ContextType>;
  FragranceEdge?: FragranceEdgeResolvers<ContextType>;
  FragranceImage?: FragranceImageResolvers<ContextType>;
  FragranceImageConnection?: FragranceImageConnectionResolvers<ContextType>;
  FragranceImageEdge?: FragranceImageEdgeResolvers<ContextType>;
  FragranceNote?: FragranceNoteResolvers<ContextType>;
  FragranceNoteConnection?: FragranceNoteConnectionResolvers<ContextType>;
  FragranceNoteEdge?: FragranceNoteEdgeResolvers<ContextType>;
  FragranceNotes?: FragranceNotesResolvers<ContextType>;
  FragranceReport?: FragranceReportResolvers<ContextType>;
  FragranceReview?: FragranceReviewResolvers<ContextType>;
  FragranceReviewConnection?: FragranceReviewConnectionResolvers<ContextType>;
  FragranceReviewDistribution?: FragranceReviewDistributionResolvers<ContextType>;
  FragranceReviewEdge?: FragranceReviewEdgeResolvers<ContextType>;
  FragranceTrait?: FragranceTraitResolvers<ContextType>;
  FragranceVote?: FragranceVoteResolvers<ContextType>;
  FragranceVoteConnection?: FragranceVoteConnectionResolvers<ContextType>;
  FragranceVoteEdge?: FragranceVoteEdgeResolvers<ContextType>;
  GenericAuthResult?: GenericAuthResultResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Note?: NoteResolvers<ContextType>;
  NoteConnection?: NoteConnectionResolvers<ContextType>;
  NoteEdge?: NoteEdgeResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  ReviewReport?: ReviewReportResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  VoteSummary?: VoteSummaryResolvers<ContextType>;
}>;

