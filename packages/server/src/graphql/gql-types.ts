import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { IUserSummary } from '../features/users/types';
import { IBrandSummary } from '../features/brands/types';
import { IFragranceRequestSummary } from '../features/fragranceRequests/types';
import { IBrandRequestSummary } from '../features/brandRequests/types';
import { IAccordRequestSummary } from '../features/accordRequests/types';
import { INoteRequestSummary } from '../features/noteRequests/types';
import { ServerContext } from '@src/context';
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
  color: Scalars['String']['output'];
  id: Scalars['ID']['output'];
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

export type AccordPaginationInput = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<AccordSortInput>;
};

export type AccordRequest = {
  __typename?: 'AccordRequest';
  color?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  image?: Maybe<AccordRequestImage>;
  name?: Maybe<Scalars['String']['output']>;
  requestStatus: RequestStatus;
  user: User;
  version: Scalars['Int']['output'];
  votes: VoteInfo;
};

export type AccordRequestConnection = {
  __typename?: 'AccordRequestConnection';
  edges: Array<AccordRequestEdge>;
  pageInfo: PageInfo;
};

export type AccordRequestEdge = {
  __typename?: 'AccordRequestEdge';
  cursor: Scalars['String']['output'];
  node: AccordRequest;
};

export type AccordRequestImage = {
  __typename?: 'AccordRequestImage';
  id: Scalars['ID']['output'];
  type: Scalars['String']['output'];
  url?: Maybe<Scalars['String']['output']>;
};

export type AccordRequestImageConnection = {
  __typename?: 'AccordRequestImageConnection';
  edges: Array<AccordRequestImageEdge>;
  pageInfo: PageInfo;
};

export type AccordRequestImageEdge = {
  __typename?: 'AccordRequestImageEdge';
  cursor: Scalars['String']['output'];
  node: AccordRequestImage;
};

export const AccordSortBy = {
  Recent: 'RECENT'
} as const;

export type AccordSortBy = typeof AccordSortBy[keyof typeof AccordSortBy];
export type AccordSortInput = {
  by?: InputMaybe<AccordSortBy>;
  direction?: InputMaybe<SortDirection>;
};

export type Asset = {
  __typename?: 'Asset';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  size: Scalars['Int']['output'];
  type: Scalars['String']['output'];
  url?: Maybe<Scalars['String']['output']>;
};

export type AuthCodeDeliveryDetails = {
  __typename?: 'AuthCodeDeliveryDetails';
  attribute?: Maybe<Scalars['String']['output']>;
  destination?: Maybe<Scalars['String']['output']>;
  method?: Maybe<Scalars['String']['output']>;
};

export type AuthDeliveryResult = {
  __typename?: 'AuthDeliveryResult';
  delivery?: Maybe<AuthCodeDeliveryDetails>;
  isComplete: Scalars['Boolean']['output'];
};

export type AuthTokenPayload = {
  __typename?: 'AuthTokenPayload';
  accessToken: Scalars['String']['output'];
  expiresIn: Scalars['Int']['output'];
  idToken: Scalars['String']['output'];
};

export const AvatarStatus = {
  Failed: 'FAILED',
  Pending: 'PENDING',
  Processing: 'PROCESSING',
  Ready: 'READY'
} as const;

export type AvatarStatus = typeof AvatarStatus[keyof typeof AvatarStatus];
export type Brand = {
  __typename?: 'Brand';
  id: Scalars['ID']['output'];
  image: Asset;
  name: Scalars['String']['output'];
};

export type BrandConnection = {
  __typename?: 'BrandConnection';
  edges: Array<BrandEdge>;
  pageInfo: PageInfo;
};

export type BrandEdge = {
  __typename?: 'BrandEdge';
  cursor: Scalars['String']['output'];
  node: Brand;
};

export type BrandPaginationInput = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<BrandSortInput>;
};

export type BrandRequest = {
  __typename?: 'BrandRequest';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  image?: Maybe<BrandRequestImage>;
  name?: Maybe<Scalars['String']['output']>;
  requestStatus: RequestStatus;
  user: User;
  version: Scalars['Int']['output'];
  votes: VoteInfo;
  website?: Maybe<Scalars['String']['output']>;
};

export type BrandRequestConnection = {
  __typename?: 'BrandRequestConnection';
  edges: Array<BrandRequestEdge>;
  pageInfo: PageInfo;
};

export type BrandRequestEdge = {
  __typename?: 'BrandRequestEdge';
  cursor: Scalars['String']['output'];
  node: BrandRequest;
};

export type BrandRequestImage = {
  __typename?: 'BrandRequestImage';
  id: Scalars['ID']['output'];
  type: Scalars['String']['output'];
  url?: Maybe<Scalars['String']['output']>;
};

export type BrandRequestImageConnection = {
  __typename?: 'BrandRequestImageConnection';
  edges: Array<BrandRequestImageEdge>;
  pageInfo: PageInfo;
};

export type BrandRequestImageEdge = {
  __typename?: 'BrandRequestImageEdge';
  cursor: Scalars['String']['output'];
  node: BrandRequestImage;
};

export const BrandSortBy = {
  Recent: 'RECENT'
} as const;

export type BrandSortBy = typeof BrandSortBy[keyof typeof BrandSortBy];
export type BrandSortInput = {
  by?: InputMaybe<BrandSortBy>;
  direction?: InputMaybe<SortDirection>;
};

export const Concentration = {
  BodyMist: 'BODY_MIST',
  EauFraiche: 'EAU_FRAICHE',
  Edc: 'EDC',
  Edp: 'EDP',
  Edt: 'EDT',
  Oil: 'OIL',
  Other: 'OTHER',
  Parfum: 'PARFUM'
} as const;

export type Concentration = typeof Concentration[keyof typeof Concentration];
export type ConfirmForgotPasswordInput = {
  code: Scalars['String']['input'];
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type ConfirmSignUpInput = {
  code: Scalars['String']['input'];
  email: Scalars['String']['input'];
};

export type CreateAccordRequestInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type CreateBrandRequestInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export type CreateFragranceRequestInput = {
  concentration?: InputMaybe<Concentration>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  releaseYear?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<FragranceStatus>;
};

export type CreateNoteRequestInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type DeleteAccordRequestImageInput = {
  assetId: Scalars['ID']['input'];
  requestId: Scalars['ID']['input'];
  version: Scalars['Int']['input'];
};

export type DeleteAccordRequestInput = {
  id: Scalars['ID']['input'];
};

export type DeleteBrandRequestImageInput = {
  assetId: Scalars['ID']['input'];
  requestId: Scalars['ID']['input'];
  version: Scalars['Int']['input'];
};

export type DeleteBrandRequestInput = {
  id: Scalars['ID']['input'];
};

export type DeleteFragranceRequestImageInput = {
  assetId: Scalars['ID']['input'];
  requestId: Scalars['ID']['input'];
  version: Scalars['Int']['input'];
};

export type DeleteFragranceRequestInput = {
  id: Scalars['ID']['input'];
};

export type DeleteNoteRequestImageInput = {
  assetId: Scalars['ID']['input'];
  requestId: Scalars['ID']['input'];
  version: Scalars['Int']['input'];
};

export type DeleteNoteRequestInput = {
  id: Scalars['ID']['input'];
};

export type FinalizeAccordRequestImageInput = {
  assetId: Scalars['ID']['input'];
  requestId: Scalars['ID']['input'];
  version: Scalars['Int']['input'];
};

export type FinalizeBrandRequestImageInput = {
  assetId: Scalars['ID']['input'];
  requestId: Scalars['ID']['input'];
  version: Scalars['Int']['input'];
};

export type FinalizeFragranceRequestImageInput = {
  assetId: Scalars['ID']['input'];
  requestId: Scalars['ID']['input'];
  version: Scalars['Int']['input'];
};

export type FinalizeNoteRequestImageInput = {
  assetId: Scalars['ID']['input'];
  requestId: Scalars['ID']['input'];
  version: Scalars['Int']['input'];
};

export type ForgotPasswordInput = {
  email: Scalars['String']['input'];
};

export type Fragrance = {
  __typename?: 'Fragrance';
  brand: Scalars['String']['output'];
  concentration: Concentration;
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  images: FragranceImageConnection;
  name: Scalars['String']['output'];
  releaseYear: Scalars['Int']['output'];
  status: FragranceStatus;
  traits: Array<Trait>;
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
  bg?: Maybe<Scalars['String']['output']>;
  height: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  url: Scalars['String']['output'];
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

export type FragranceRequest = {
  __typename?: 'FragranceRequest';
  accords: Array<Accord>;
  brand?: Maybe<Brand>;
  concentration?: Maybe<Concentration>;
  description?: Maybe<Scalars['String']['output']>;
  fragranceStatus?: Maybe<FragranceStatus>;
  id: Scalars['ID']['output'];
  image?: Maybe<FragranceRequestImage>;
  name?: Maybe<Scalars['String']['output']>;
  notes: Array<Note>;
  releaseYear?: Maybe<Scalars['Int']['output']>;
  requestStatus: RequestStatus;
  trait: FragranceRequestTrait;
  traits: Array<FragranceRequestTrait>;
  user: User;
  version: Scalars['Int']['output'];
  votes: VoteInfo;
};


export type FragranceRequestNotesArgs = {
  layer: NoteLayer;
};


export type FragranceRequestTraitArgs = {
  type: TraitTypeEnum;
};

export type FragranceRequestConnection = {
  __typename?: 'FragranceRequestConnection';
  edges: Array<FragranceRequestEdge>;
  pageInfo: PageInfo;
};

export type FragranceRequestEdge = {
  __typename?: 'FragranceRequestEdge';
  cursor: Scalars['String']['output'];
  node: FragranceRequest;
};

export type FragranceRequestImage = {
  __typename?: 'FragranceRequestImage';
  id: Scalars['ID']['output'];
  type: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type FragranceRequestImageConnection = {
  __typename?: 'FragranceRequestImageConnection';
  edges: Array<FragranceRequestImageEdge>;
  pageInfo: PageInfo;
};

export type FragranceRequestImageEdge = {
  __typename?: 'FragranceRequestImageEdge';
  cursor: Scalars['String']['output'];
  node: FragranceRequestImage;
};

export type FragranceRequestTrait = {
  __typename?: 'FragranceRequestTrait';
  selectedOption: TraitOption;
  traitType: TraitTypeEnum;
};

export const FragranceStatus = {
  Current: 'CURRENT',
  Discontinued: 'DISCONTINUED',
  Reformulated: 'REFORMULATED'
} as const;

export type FragranceStatus = typeof FragranceStatus[keyof typeof FragranceStatus];
export type LogInInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  confirmForgotPassword: Scalars['Boolean']['output'];
  confirmSignUp: Scalars['Boolean']['output'];
  createAccordRequest: AccordRequest;
  createBrandRequest: BrandRequest;
  createFragranceRequest: FragranceRequest;
  createNoteRequest: NoteRequest;
  deleteAccordRequest: AccordRequest;
  deleteAccordRequestImage: AccordRequest;
  deleteBrandRequest: BrandRequest;
  deleteBrandRequestImage: BrandRequest;
  deleteFragranceRequest: FragranceRequest;
  deleteFragranceRequestImage: FragranceRequest;
  deleteNoteRequest: NoteRequest;
  deleteNoteRequestImage: NoteRequest;
  finalizeAccordRequestImage: AccordRequest;
  finalizeBrandRequestImage: BrandRequest;
  finalizeFragranceRequestImage: FragranceRequest;
  finalizeNoteRequestImage: NoteRequest;
  forgotPassword: AuthDeliveryResult;
  logIn: AuthTokenPayload;
  logOut: Scalars['Boolean']['output'];
  refresh?: Maybe<AuthTokenPayload>;
  resendSignUpCode: AuthDeliveryResult;
  setFragranceRequestAccords: FragranceRequest;
  setFragranceRequestBrand: FragranceRequest;
  setFragranceRequestNotes: FragranceRequest;
  setFragranceRequestTrait: FragranceRequest;
  signUp: AuthDeliveryResult;
  stageAccordRequestImage: PresignedUpload;
  stageBrandRequestImage: PresignedUpload;
  stageFragranceRequestImage: PresignedUpload;
  stageNoteRequestImage: PresignedUpload;
  submitAccordRequest: AccordRequest;
  submitBrandRequest: BrandRequest;
  submitFragranceRequest: FragranceRequest;
  submitNoteRequest: NoteRequest;
  updateAccordRequest: AccordRequest;
  updateBrandRequest: BrandRequest;
  updateFragranceRequest: FragranceRequest;
  updateNoteRequest: NoteRequest;
  updateUser: User;
  updateUserAvatar: PresignedUpload;
  voteOnAccordRequest: AccordRequest;
  voteOnBrandRequest: BrandRequest;
  voteOnFragranceRequest: FragranceRequest;
  voteOnNoteRequest: NoteRequest;
};


export type MutationConfirmForgotPasswordArgs = {
  input: ConfirmForgotPasswordInput;
};


export type MutationConfirmSignUpArgs = {
  input: ConfirmSignUpInput;
};


export type MutationCreateAccordRequestArgs = {
  input: CreateAccordRequestInput;
};


export type MutationCreateBrandRequestArgs = {
  input: CreateBrandRequestInput;
};


export type MutationCreateFragranceRequestArgs = {
  input: CreateFragranceRequestInput;
};


export type MutationCreateNoteRequestArgs = {
  input: CreateNoteRequestInput;
};


export type MutationDeleteAccordRequestArgs = {
  input: DeleteAccordRequestInput;
};


export type MutationDeleteAccordRequestImageArgs = {
  input: DeleteAccordRequestImageInput;
};


export type MutationDeleteBrandRequestArgs = {
  input: DeleteBrandRequestInput;
};


export type MutationDeleteBrandRequestImageArgs = {
  input: DeleteBrandRequestImageInput;
};


export type MutationDeleteFragranceRequestArgs = {
  input: DeleteFragranceRequestInput;
};


export type MutationDeleteFragranceRequestImageArgs = {
  input: DeleteFragranceRequestImageInput;
};


export type MutationDeleteNoteRequestArgs = {
  input: DeleteNoteRequestInput;
};


export type MutationDeleteNoteRequestImageArgs = {
  input: DeleteNoteRequestImageInput;
};


export type MutationFinalizeAccordRequestImageArgs = {
  input: FinalizeAccordRequestImageInput;
};


export type MutationFinalizeBrandRequestImageArgs = {
  input: FinalizeBrandRequestImageInput;
};


export type MutationFinalizeFragranceRequestImageArgs = {
  input: FinalizeFragranceRequestImageInput;
};


export type MutationFinalizeNoteRequestImageArgs = {
  input: FinalizeNoteRequestImageInput;
};


export type MutationForgotPasswordArgs = {
  input: ForgotPasswordInput;
};


export type MutationLogInArgs = {
  input: LogInInput;
};


export type MutationResendSignUpCodeArgs = {
  input: ResendSignUpCodeInput;
};


export type MutationSetFragranceRequestAccordsArgs = {
  input: SetFragranceRequestAccordsInput;
};


export type MutationSetFragranceRequestBrandArgs = {
  input: SetFragranceRequestBrandInput;
};


export type MutationSetFragranceRequestNotesArgs = {
  input: SetFragranceRequestNotesInput;
};


export type MutationSetFragranceRequestTraitArgs = {
  input: SetFragranceRequestTraitInput;
};


export type MutationSignUpArgs = {
  input: SignUpInput;
};


export type MutationStageAccordRequestImageArgs = {
  input: StageAssetInput;
};


export type MutationStageBrandRequestImageArgs = {
  input: StageAssetInput;
};


export type MutationStageFragranceRequestImageArgs = {
  input: StageAssetInput;
};


export type MutationStageNoteRequestImageArgs = {
  input: StageAssetInput;
};


export type MutationSubmitAccordRequestArgs = {
  input: SubmitAccordRequestInput;
};


export type MutationSubmitBrandRequestArgs = {
  input: SubmitBrandRequestInput;
};


export type MutationSubmitFragranceRequestArgs = {
  input: SubmitFragranceRequestInput;
};


export type MutationSubmitNoteRequestArgs = {
  input: SubmitNoteRequestInput;
};


export type MutationUpdateAccordRequestArgs = {
  input: UpdateAccordRequestInput;
};


export type MutationUpdateBrandRequestArgs = {
  input: UpdateBrandRequestInput;
};


export type MutationUpdateFragranceRequestArgs = {
  input: UpdateFragranceRequestInput;
};


export type MutationUpdateNoteRequestArgs = {
  input: UpdateNoteRequestInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};


export type MutationUpdateUserAvatarArgs = {
  input: StageAssetInput;
};


export type MutationVoteOnAccordRequestArgs = {
  input: VoteOnAccordRequestInput;
};


export type MutationVoteOnBrandRequestArgs = {
  input: VoteOnBrandRequestInput;
};


export type MutationVoteOnFragranceRequestArgs = {
  input: VoteOnFragranceRequestInput;
};


export type MutationVoteOnNoteRequestArgs = {
  input: VoteOnNoteRequestInput;
};

export type Note = {
  __typename?: 'Note';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
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
export type NotePaginationInput = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<NoteSortInput>;
};

export type NoteRequest = {
  __typename?: 'NoteRequest';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  image?: Maybe<NoteRequestImage>;
  name?: Maybe<Scalars['String']['output']>;
  requestStatus: RequestStatus;
  user: User;
  version: Scalars['Int']['output'];
  votes: VoteInfo;
};

export type NoteRequestConnection = {
  __typename?: 'NoteRequestConnection';
  edges: Array<NoteRequestEdge>;
  pageInfo: PageInfo;
};

export type NoteRequestEdge = {
  __typename?: 'NoteRequestEdge';
  cursor: Scalars['String']['output'];
  node: NoteRequest;
};

export type NoteRequestImage = {
  __typename?: 'NoteRequestImage';
  id: Scalars['ID']['output'];
  type: Scalars['String']['output'];
  url?: Maybe<Scalars['String']['output']>;
};

export type NoteRequestImageConnection = {
  __typename?: 'NoteRequestImageConnection';
  edges: Array<NoteRequestImageEdge>;
  pageInfo: PageInfo;
};

export type NoteRequestImageEdge = {
  __typename?: 'NoteRequestImageEdge';
  cursor: Scalars['String']['output'];
  node: NoteRequestImage;
};

export const NoteSortBy = {
  Recent: 'RECENT'
} as const;

export type NoteSortBy = typeof NoteSortBy[keyof typeof NoteSortBy];
export type NoteSortInput = {
  by?: InputMaybe<NoteSortBy>;
  direction?: InputMaybe<SortDirection>;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type PresignedUpload = {
  __typename?: 'PresignedUpload';
  fields: Scalars['JSON']['output'];
  id: Scalars['ID']['output'];
  url: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  accordRequest: AccordRequest;
  accordRequests: AccordRequestConnection;
  accords: AccordConnection;
  brandRequest: BrandRequest;
  brandRequests: BrandRequestConnection;
  brands: BrandConnection;
  fragranceRequest: FragranceRequest;
  fragranceRequests: FragranceRequestConnection;
  me: User;
  noteRequest: NoteRequest;
  noteRequests: NoteRequestConnection;
  notes: NoteConnection;
  searchAccords: Array<Accord>;
  searchBrands: Array<Brand>;
  searchNotes: Array<Note>;
  user: User;
};


export type QueryAccordRequestArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAccordRequestsArgs = {
  input?: InputMaybe<RequestPaginationInput>;
};


export type QueryAccordsArgs = {
  input?: InputMaybe<AccordPaginationInput>;
};


export type QueryBrandRequestArgs = {
  id: Scalars['ID']['input'];
};


export type QueryBrandRequestsArgs = {
  input?: InputMaybe<RequestPaginationInput>;
};


export type QueryBrandsArgs = {
  input?: InputMaybe<BrandPaginationInput>;
};


export type QueryFragranceRequestArgs = {
  id: Scalars['ID']['input'];
};


export type QueryFragranceRequestsArgs = {
  input?: InputMaybe<RequestPaginationInput>;
};


export type QueryNoteRequestArgs = {
  id: Scalars['ID']['input'];
};


export type QueryNoteRequestsArgs = {
  input?: InputMaybe<RequestPaginationInput>;
};


export type QueryNotesArgs = {
  input?: InputMaybe<NotePaginationInput>;
};


export type QuerySearchAccordsArgs = {
  input?: InputMaybe<SearchAccordsInput>;
};


export type QuerySearchBrandsArgs = {
  input?: InputMaybe<SearchBrandsInput>;
};


export type QuerySearchNotesArgs = {
  input?: InputMaybe<SearchNotesInput>;
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export type RequestPaginationInput = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<RequestSortInput>;
};

export const RequestSortBy = {
  Recent: 'RECENT'
} as const;

export type RequestSortBy = typeof RequestSortBy[keyof typeof RequestSortBy];
export type RequestSortInput = {
  by?: InputMaybe<RequestSortBy>;
  direction?: InputMaybe<SortDirection>;
};

export const RequestStatus = {
  Accepted: 'ACCEPTED',
  Draft: 'DRAFT',
  Pending: 'PENDING',
  Rejected: 'REJECTED'
} as const;

export type RequestStatus = typeof RequestStatus[keyof typeof RequestStatus];
export type ResendSignUpCodeInput = {
  email: Scalars['String']['input'];
};

export type SearchAccordsInput = {
  pagination?: InputMaybe<SearchPaginationInput>;
  term?: InputMaybe<Scalars['String']['input']>;
};

export type SearchBrandsInput = {
  pagination?: InputMaybe<SearchPaginationInput>;
  term?: InputMaybe<Scalars['String']['input']>;
};

export type SearchNotesInput = {
  pagination?: InputMaybe<SearchPaginationInput>;
  term?: InputMaybe<Scalars['String']['input']>;
};

export type SearchPaginationInput = {
  first?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SearchSortInput>;
};

export const SearchSortBy = {
  Relevance: 'RELEVANCE'
} as const;

export type SearchSortBy = typeof SearchSortBy[keyof typeof SearchSortBy];
export type SearchSortInput = {
  by?: InputMaybe<SearchSortBy>;
  direction?: InputMaybe<SortDirection>;
};

export type SetFragranceRequestAccordsInput = {
  accordIds: Array<Scalars['ID']['input']>;
  requestId: Scalars['ID']['input'];
  version: Scalars['Int']['input'];
};

export type SetFragranceRequestBrandInput = {
  brandId?: InputMaybe<Scalars['ID']['input']>;
  requestId: Scalars['ID']['input'];
  version: Scalars['Int']['input'];
};

export type SetFragranceRequestNotesInput = {
  layer: NoteLayer;
  noteIds: Array<Scalars['ID']['input']>;
  requestId: Scalars['ID']['input'];
  version: Scalars['Int']['input'];
};

export type SetFragranceRequestTraitInput = {
  requestId: Scalars['ID']['input'];
  score: Scalars['Int']['input'];
  traitType: TraitTypeEnum;
  version: Scalars['Int']['input'];
};

export type SignUpInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export const SortDirection = {
  Ascending: 'ASCENDING',
  Descending: 'DESCENDING'
} as const;

export type SortDirection = typeof SortDirection[keyof typeof SortDirection];
export type StageAssetInput = {
  contentSize: Scalars['Int']['input'];
  contentType: Scalars['String']['input'];
  fileName: Scalars['String']['input'];
  id: Scalars['ID']['input'];
};

export type SubmitAccordRequestInput = {
  id: Scalars['ID']['input'];
};

export type SubmitBrandRequestInput = {
  id: Scalars['ID']['input'];
};

export type SubmitFragranceRequestInput = {
  id: Scalars['ID']['input'];
};

export type SubmitNoteRequestInput = {
  id: Scalars['ID']['input'];
};

export type Trait = {
  __typename?: 'Trait';
  myVote?: Maybe<TraitVote>;
  options: Array<TraitOption>;
  stats?: Maybe<TraitStats>;
  traitType: TraitTypeEnum;
};

export type TraitOption = {
  __typename?: 'TraitOption';
  id: Scalars['ID']['output'];
  label: Scalars['String']['output'];
  score: Scalars['Int']['output'];
};

export type TraitStats = {
  __typename?: 'TraitStats';
  averageScore: Scalars['Float']['output'];
  distribution: Array<TraitVoteDistribution>;
  totalVotes: Scalars['Int']['output'];
};

export const TraitTypeEnum = {
  Appeal: 'APPEAL',
  Balance: 'BALANCE',
  Complexity: 'COMPLEXITY',
  Gender: 'GENDER',
  Longevity: 'LONGEVITY',
  Projection: 'PROJECTION'
} as const;

export type TraitTypeEnum = typeof TraitTypeEnum[keyof typeof TraitTypeEnum];
export type TraitVote = {
  __typename?: 'TraitVote';
  option: TraitOption;
};

export type TraitVoteDistribution = {
  __typename?: 'TraitVoteDistribution';
  option: TraitOption;
  votes: Scalars['Int']['output'];
};

export type UpdateAccordRequestInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  version: Scalars['Int']['input'];
};

export type UpdateBrandRequestInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  version: Scalars['Int']['input'];
  website?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateFragranceRequestInput = {
  concentration?: InputMaybe<Concentration>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  releaseYear?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<FragranceStatus>;
  version: Scalars['Int']['input'];
};

export type UpdateNoteRequestInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  version: Scalars['Int']['input'];
};

export type UpdateUserInput = {
  id: Scalars['ID']['input'];
  username?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  avatarSrc?: Maybe<Scalars['String']['output']>;
  avatarStatus: AvatarStatus;
  brandRequests: BrandRequestConnection;
  email: Scalars['String']['output'];
  fragranceRequests: FragranceRequestConnection;
  id: Scalars['ID']['output'];
  username: Scalars['String']['output'];
};


export type UserBrandRequestsArgs = {
  input?: InputMaybe<RequestPaginationInput>;
};


export type UserFragranceRequestsArgs = {
  input?: InputMaybe<RequestPaginationInput>;
};

export type VoteInfo = {
  __typename?: 'VoteInfo';
  downvotes: Scalars['Int']['output'];
  myVote?: Maybe<Scalars['Int']['output']>;
  score: Scalars['Int']['output'];
  upvotes: Scalars['Int']['output'];
};

export type VoteOnAccordRequestInput = {
  requestId: Scalars['ID']['input'];
  vote: Scalars['Int']['input'];
};

export type VoteOnBrandRequestInput = {
  requestId: Scalars['ID']['input'];
  vote: Scalars['Int']['input'];
};

export type VoteOnFragranceRequestInput = {
  requestId: Scalars['ID']['input'];
  vote: Scalars['Int']['input'];
};

export type VoteOnNoteRequestInput = {
  requestId: Scalars['ID']['input'];
  vote: Scalars['Int']['input'];
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
  AccordPaginationInput: ResolverTypeWrapper<Partial<AccordPaginationInput>>;
  AccordRequest: ResolverTypeWrapper<IAccordRequestSummary>;
  AccordRequestConnection: ResolverTypeWrapper<Partial<Omit<AccordRequestConnection, 'edges'> & { edges: Array<ResolversTypes['AccordRequestEdge']> }>>;
  AccordRequestEdge: ResolverTypeWrapper<Partial<Omit<AccordRequestEdge, 'node'> & { node: ResolversTypes['AccordRequest'] }>>;
  AccordRequestImage: ResolverTypeWrapper<Partial<AccordRequestImage>>;
  AccordRequestImageConnection: ResolverTypeWrapper<Partial<AccordRequestImageConnection>>;
  AccordRequestImageEdge: ResolverTypeWrapper<Partial<AccordRequestImageEdge>>;
  AccordSortBy: ResolverTypeWrapper<Partial<AccordSortBy>>;
  AccordSortInput: ResolverTypeWrapper<Partial<AccordSortInput>>;
  Asset: ResolverTypeWrapper<Partial<Asset>>;
  AuthCodeDeliveryDetails: ResolverTypeWrapper<Partial<AuthCodeDeliveryDetails>>;
  AuthDeliveryResult: ResolverTypeWrapper<Partial<AuthDeliveryResult>>;
  AuthTokenPayload: ResolverTypeWrapper<Partial<AuthTokenPayload>>;
  AvatarStatus: ResolverTypeWrapper<Partial<AvatarStatus>>;
  Boolean: ResolverTypeWrapper<Partial<Scalars['Boolean']['output']>>;
  Brand: ResolverTypeWrapper<IBrandSummary>;
  BrandConnection: ResolverTypeWrapper<Partial<Omit<BrandConnection, 'edges'> & { edges: Array<ResolversTypes['BrandEdge']> }>>;
  BrandEdge: ResolverTypeWrapper<Partial<Omit<BrandEdge, 'node'> & { node: ResolversTypes['Brand'] }>>;
  BrandPaginationInput: ResolverTypeWrapper<Partial<BrandPaginationInput>>;
  BrandRequest: ResolverTypeWrapper<IBrandRequestSummary>;
  BrandRequestConnection: ResolverTypeWrapper<Partial<Omit<BrandRequestConnection, 'edges'> & { edges: Array<ResolversTypes['BrandRequestEdge']> }>>;
  BrandRequestEdge: ResolverTypeWrapper<Partial<Omit<BrandRequestEdge, 'node'> & { node: ResolversTypes['BrandRequest'] }>>;
  BrandRequestImage: ResolverTypeWrapper<Partial<BrandRequestImage>>;
  BrandRequestImageConnection: ResolverTypeWrapper<Partial<BrandRequestImageConnection>>;
  BrandRequestImageEdge: ResolverTypeWrapper<Partial<BrandRequestImageEdge>>;
  BrandSortBy: ResolverTypeWrapper<Partial<BrandSortBy>>;
  BrandSortInput: ResolverTypeWrapper<Partial<BrandSortInput>>;
  Concentration: ResolverTypeWrapper<Partial<Concentration>>;
  ConfirmForgotPasswordInput: ResolverTypeWrapper<Partial<ConfirmForgotPasswordInput>>;
  ConfirmSignUpInput: ResolverTypeWrapper<Partial<ConfirmSignUpInput>>;
  CreateAccordRequestInput: ResolverTypeWrapper<Partial<CreateAccordRequestInput>>;
  CreateBrandRequestInput: ResolverTypeWrapper<Partial<CreateBrandRequestInput>>;
  CreateFragranceRequestInput: ResolverTypeWrapper<Partial<CreateFragranceRequestInput>>;
  CreateNoteRequestInput: ResolverTypeWrapper<Partial<CreateNoteRequestInput>>;
  Date: ResolverTypeWrapper<Partial<Scalars['Date']['output']>>;
  DeleteAccordRequestImageInput: ResolverTypeWrapper<Partial<DeleteAccordRequestImageInput>>;
  DeleteAccordRequestInput: ResolverTypeWrapper<Partial<DeleteAccordRequestInput>>;
  DeleteBrandRequestImageInput: ResolverTypeWrapper<Partial<DeleteBrandRequestImageInput>>;
  DeleteBrandRequestInput: ResolverTypeWrapper<Partial<DeleteBrandRequestInput>>;
  DeleteFragranceRequestImageInput: ResolverTypeWrapper<Partial<DeleteFragranceRequestImageInput>>;
  DeleteFragranceRequestInput: ResolverTypeWrapper<Partial<DeleteFragranceRequestInput>>;
  DeleteNoteRequestImageInput: ResolverTypeWrapper<Partial<DeleteNoteRequestImageInput>>;
  DeleteNoteRequestInput: ResolverTypeWrapper<Partial<DeleteNoteRequestInput>>;
  FinalizeAccordRequestImageInput: ResolverTypeWrapper<Partial<FinalizeAccordRequestImageInput>>;
  FinalizeBrandRequestImageInput: ResolverTypeWrapper<Partial<FinalizeBrandRequestImageInput>>;
  FinalizeFragranceRequestImageInput: ResolverTypeWrapper<Partial<FinalizeFragranceRequestImageInput>>;
  FinalizeNoteRequestImageInput: ResolverTypeWrapper<Partial<FinalizeNoteRequestImageInput>>;
  Float: ResolverTypeWrapper<Partial<Scalars['Float']['output']>>;
  ForgotPasswordInput: ResolverTypeWrapper<Partial<ForgotPasswordInput>>;
  Fragrance: ResolverTypeWrapper<Partial<Fragrance>>;
  FragranceConnection: ResolverTypeWrapper<Partial<FragranceConnection>>;
  FragranceEdge: ResolverTypeWrapper<Partial<FragranceEdge>>;
  FragranceImage: ResolverTypeWrapper<Partial<FragranceImage>>;
  FragranceImageConnection: ResolverTypeWrapper<Partial<FragranceImageConnection>>;
  FragranceImageEdge: ResolverTypeWrapper<Partial<FragranceImageEdge>>;
  FragranceRequest: ResolverTypeWrapper<IFragranceRequestSummary>;
  FragranceRequestConnection: ResolverTypeWrapper<Partial<Omit<FragranceRequestConnection, 'edges'> & { edges: Array<ResolversTypes['FragranceRequestEdge']> }>>;
  FragranceRequestEdge: ResolverTypeWrapper<Partial<Omit<FragranceRequestEdge, 'node'> & { node: ResolversTypes['FragranceRequest'] }>>;
  FragranceRequestImage: ResolverTypeWrapper<Partial<FragranceRequestImage>>;
  FragranceRequestImageConnection: ResolverTypeWrapper<Partial<FragranceRequestImageConnection>>;
  FragranceRequestImageEdge: ResolverTypeWrapper<Partial<FragranceRequestImageEdge>>;
  FragranceRequestTrait: ResolverTypeWrapper<Partial<FragranceRequestTrait>>;
  FragranceStatus: ResolverTypeWrapper<Partial<FragranceStatus>>;
  ID: ResolverTypeWrapper<Partial<Scalars['ID']['output']>>;
  Int: ResolverTypeWrapper<Partial<Scalars['Int']['output']>>;
  JSON: ResolverTypeWrapper<Partial<Scalars['JSON']['output']>>;
  LogInInput: ResolverTypeWrapper<Partial<LogInInput>>;
  Mutation: ResolverTypeWrapper<{}>;
  Note: ResolverTypeWrapper<Partial<Note>>;
  NoteConnection: ResolverTypeWrapper<Partial<NoteConnection>>;
  NoteEdge: ResolverTypeWrapper<Partial<NoteEdge>>;
  NoteLayer: ResolverTypeWrapper<Partial<NoteLayer>>;
  NotePaginationInput: ResolverTypeWrapper<Partial<NotePaginationInput>>;
  NoteRequest: ResolverTypeWrapper<INoteRequestSummary>;
  NoteRequestConnection: ResolverTypeWrapper<Partial<Omit<NoteRequestConnection, 'edges'> & { edges: Array<ResolversTypes['NoteRequestEdge']> }>>;
  NoteRequestEdge: ResolverTypeWrapper<Partial<Omit<NoteRequestEdge, 'node'> & { node: ResolversTypes['NoteRequest'] }>>;
  NoteRequestImage: ResolverTypeWrapper<Partial<NoteRequestImage>>;
  NoteRequestImageConnection: ResolverTypeWrapper<Partial<NoteRequestImageConnection>>;
  NoteRequestImageEdge: ResolverTypeWrapper<Partial<NoteRequestImageEdge>>;
  NoteSortBy: ResolverTypeWrapper<Partial<NoteSortBy>>;
  NoteSortInput: ResolverTypeWrapper<Partial<NoteSortInput>>;
  PageInfo: ResolverTypeWrapper<Partial<PageInfo>>;
  PresignedUpload: ResolverTypeWrapper<Partial<PresignedUpload>>;
  Query: ResolverTypeWrapper<{}>;
  RequestPaginationInput: ResolverTypeWrapper<Partial<RequestPaginationInput>>;
  RequestSortBy: ResolverTypeWrapper<Partial<RequestSortBy>>;
  RequestSortInput: ResolverTypeWrapper<Partial<RequestSortInput>>;
  RequestStatus: ResolverTypeWrapper<Partial<RequestStatus>>;
  ResendSignUpCodeInput: ResolverTypeWrapper<Partial<ResendSignUpCodeInput>>;
  SearchAccordsInput: ResolverTypeWrapper<Partial<SearchAccordsInput>>;
  SearchBrandsInput: ResolverTypeWrapper<Partial<SearchBrandsInput>>;
  SearchNotesInput: ResolverTypeWrapper<Partial<SearchNotesInput>>;
  SearchPaginationInput: ResolverTypeWrapper<Partial<SearchPaginationInput>>;
  SearchSortBy: ResolverTypeWrapper<Partial<SearchSortBy>>;
  SearchSortInput: ResolverTypeWrapper<Partial<SearchSortInput>>;
  SetFragranceRequestAccordsInput: ResolverTypeWrapper<Partial<SetFragranceRequestAccordsInput>>;
  SetFragranceRequestBrandInput: ResolverTypeWrapper<Partial<SetFragranceRequestBrandInput>>;
  SetFragranceRequestNotesInput: ResolverTypeWrapper<Partial<SetFragranceRequestNotesInput>>;
  SetFragranceRequestTraitInput: ResolverTypeWrapper<Partial<SetFragranceRequestTraitInput>>;
  SignUpInput: ResolverTypeWrapper<Partial<SignUpInput>>;
  SortDirection: ResolverTypeWrapper<Partial<SortDirection>>;
  StageAssetInput: ResolverTypeWrapper<Partial<StageAssetInput>>;
  String: ResolverTypeWrapper<Partial<Scalars['String']['output']>>;
  SubmitAccordRequestInput: ResolverTypeWrapper<Partial<SubmitAccordRequestInput>>;
  SubmitBrandRequestInput: ResolverTypeWrapper<Partial<SubmitBrandRequestInput>>;
  SubmitFragranceRequestInput: ResolverTypeWrapper<Partial<SubmitFragranceRequestInput>>;
  SubmitNoteRequestInput: ResolverTypeWrapper<Partial<SubmitNoteRequestInput>>;
  Trait: ResolverTypeWrapper<Partial<Trait>>;
  TraitOption: ResolverTypeWrapper<Partial<TraitOption>>;
  TraitStats: ResolverTypeWrapper<Partial<TraitStats>>;
  TraitTypeEnum: ResolverTypeWrapper<Partial<TraitTypeEnum>>;
  TraitVote: ResolverTypeWrapper<Partial<TraitVote>>;
  TraitVoteDistribution: ResolverTypeWrapper<Partial<TraitVoteDistribution>>;
  UpdateAccordRequestInput: ResolverTypeWrapper<Partial<UpdateAccordRequestInput>>;
  UpdateBrandRequestInput: ResolverTypeWrapper<Partial<UpdateBrandRequestInput>>;
  UpdateFragranceRequestInput: ResolverTypeWrapper<Partial<UpdateFragranceRequestInput>>;
  UpdateNoteRequestInput: ResolverTypeWrapper<Partial<UpdateNoteRequestInput>>;
  UpdateUserInput: ResolverTypeWrapper<Partial<UpdateUserInput>>;
  User: ResolverTypeWrapper<IUserSummary>;
  VoteInfo: ResolverTypeWrapper<Partial<VoteInfo>>;
  VoteOnAccordRequestInput: ResolverTypeWrapper<Partial<VoteOnAccordRequestInput>>;
  VoteOnBrandRequestInput: ResolverTypeWrapper<Partial<VoteOnBrandRequestInput>>;
  VoteOnFragranceRequestInput: ResolverTypeWrapper<Partial<VoteOnFragranceRequestInput>>;
  VoteOnNoteRequestInput: ResolverTypeWrapper<Partial<VoteOnNoteRequestInput>>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Accord: Partial<Accord>;
  AccordConnection: Partial<AccordConnection>;
  AccordEdge: Partial<AccordEdge>;
  AccordPaginationInput: Partial<AccordPaginationInput>;
  AccordRequest: IAccordRequestSummary;
  AccordRequestConnection: Partial<Omit<AccordRequestConnection, 'edges'> & { edges: Array<ResolversParentTypes['AccordRequestEdge']> }>;
  AccordRequestEdge: Partial<Omit<AccordRequestEdge, 'node'> & { node: ResolversParentTypes['AccordRequest'] }>;
  AccordRequestImage: Partial<AccordRequestImage>;
  AccordRequestImageConnection: Partial<AccordRequestImageConnection>;
  AccordRequestImageEdge: Partial<AccordRequestImageEdge>;
  AccordSortInput: Partial<AccordSortInput>;
  Asset: Partial<Asset>;
  AuthCodeDeliveryDetails: Partial<AuthCodeDeliveryDetails>;
  AuthDeliveryResult: Partial<AuthDeliveryResult>;
  AuthTokenPayload: Partial<AuthTokenPayload>;
  Boolean: Partial<Scalars['Boolean']['output']>;
  Brand: IBrandSummary;
  BrandConnection: Partial<Omit<BrandConnection, 'edges'> & { edges: Array<ResolversParentTypes['BrandEdge']> }>;
  BrandEdge: Partial<Omit<BrandEdge, 'node'> & { node: ResolversParentTypes['Brand'] }>;
  BrandPaginationInput: Partial<BrandPaginationInput>;
  BrandRequest: IBrandRequestSummary;
  BrandRequestConnection: Partial<Omit<BrandRequestConnection, 'edges'> & { edges: Array<ResolversParentTypes['BrandRequestEdge']> }>;
  BrandRequestEdge: Partial<Omit<BrandRequestEdge, 'node'> & { node: ResolversParentTypes['BrandRequest'] }>;
  BrandRequestImage: Partial<BrandRequestImage>;
  BrandRequestImageConnection: Partial<BrandRequestImageConnection>;
  BrandRequestImageEdge: Partial<BrandRequestImageEdge>;
  BrandSortInput: Partial<BrandSortInput>;
  ConfirmForgotPasswordInput: Partial<ConfirmForgotPasswordInput>;
  ConfirmSignUpInput: Partial<ConfirmSignUpInput>;
  CreateAccordRequestInput: Partial<CreateAccordRequestInput>;
  CreateBrandRequestInput: Partial<CreateBrandRequestInput>;
  CreateFragranceRequestInput: Partial<CreateFragranceRequestInput>;
  CreateNoteRequestInput: Partial<CreateNoteRequestInput>;
  Date: Partial<Scalars['Date']['output']>;
  DeleteAccordRequestImageInput: Partial<DeleteAccordRequestImageInput>;
  DeleteAccordRequestInput: Partial<DeleteAccordRequestInput>;
  DeleteBrandRequestImageInput: Partial<DeleteBrandRequestImageInput>;
  DeleteBrandRequestInput: Partial<DeleteBrandRequestInput>;
  DeleteFragranceRequestImageInput: Partial<DeleteFragranceRequestImageInput>;
  DeleteFragranceRequestInput: Partial<DeleteFragranceRequestInput>;
  DeleteNoteRequestImageInput: Partial<DeleteNoteRequestImageInput>;
  DeleteNoteRequestInput: Partial<DeleteNoteRequestInput>;
  FinalizeAccordRequestImageInput: Partial<FinalizeAccordRequestImageInput>;
  FinalizeBrandRequestImageInput: Partial<FinalizeBrandRequestImageInput>;
  FinalizeFragranceRequestImageInput: Partial<FinalizeFragranceRequestImageInput>;
  FinalizeNoteRequestImageInput: Partial<FinalizeNoteRequestImageInput>;
  Float: Partial<Scalars['Float']['output']>;
  ForgotPasswordInput: Partial<ForgotPasswordInput>;
  Fragrance: Partial<Fragrance>;
  FragranceConnection: Partial<FragranceConnection>;
  FragranceEdge: Partial<FragranceEdge>;
  FragranceImage: Partial<FragranceImage>;
  FragranceImageConnection: Partial<FragranceImageConnection>;
  FragranceImageEdge: Partial<FragranceImageEdge>;
  FragranceRequest: IFragranceRequestSummary;
  FragranceRequestConnection: Partial<Omit<FragranceRequestConnection, 'edges'> & { edges: Array<ResolversParentTypes['FragranceRequestEdge']> }>;
  FragranceRequestEdge: Partial<Omit<FragranceRequestEdge, 'node'> & { node: ResolversParentTypes['FragranceRequest'] }>;
  FragranceRequestImage: Partial<FragranceRequestImage>;
  FragranceRequestImageConnection: Partial<FragranceRequestImageConnection>;
  FragranceRequestImageEdge: Partial<FragranceRequestImageEdge>;
  FragranceRequestTrait: Partial<FragranceRequestTrait>;
  ID: Partial<Scalars['ID']['output']>;
  Int: Partial<Scalars['Int']['output']>;
  JSON: Partial<Scalars['JSON']['output']>;
  LogInInput: Partial<LogInInput>;
  Mutation: {};
  Note: Partial<Note>;
  NoteConnection: Partial<NoteConnection>;
  NoteEdge: Partial<NoteEdge>;
  NotePaginationInput: Partial<NotePaginationInput>;
  NoteRequest: INoteRequestSummary;
  NoteRequestConnection: Partial<Omit<NoteRequestConnection, 'edges'> & { edges: Array<ResolversParentTypes['NoteRequestEdge']> }>;
  NoteRequestEdge: Partial<Omit<NoteRequestEdge, 'node'> & { node: ResolversParentTypes['NoteRequest'] }>;
  NoteRequestImage: Partial<NoteRequestImage>;
  NoteRequestImageConnection: Partial<NoteRequestImageConnection>;
  NoteRequestImageEdge: Partial<NoteRequestImageEdge>;
  NoteSortInput: Partial<NoteSortInput>;
  PageInfo: Partial<PageInfo>;
  PresignedUpload: Partial<PresignedUpload>;
  Query: {};
  RequestPaginationInput: Partial<RequestPaginationInput>;
  RequestSortInput: Partial<RequestSortInput>;
  ResendSignUpCodeInput: Partial<ResendSignUpCodeInput>;
  SearchAccordsInput: Partial<SearchAccordsInput>;
  SearchBrandsInput: Partial<SearchBrandsInput>;
  SearchNotesInput: Partial<SearchNotesInput>;
  SearchPaginationInput: Partial<SearchPaginationInput>;
  SearchSortInput: Partial<SearchSortInput>;
  SetFragranceRequestAccordsInput: Partial<SetFragranceRequestAccordsInput>;
  SetFragranceRequestBrandInput: Partial<SetFragranceRequestBrandInput>;
  SetFragranceRequestNotesInput: Partial<SetFragranceRequestNotesInput>;
  SetFragranceRequestTraitInput: Partial<SetFragranceRequestTraitInput>;
  SignUpInput: Partial<SignUpInput>;
  StageAssetInput: Partial<StageAssetInput>;
  String: Partial<Scalars['String']['output']>;
  SubmitAccordRequestInput: Partial<SubmitAccordRequestInput>;
  SubmitBrandRequestInput: Partial<SubmitBrandRequestInput>;
  SubmitFragranceRequestInput: Partial<SubmitFragranceRequestInput>;
  SubmitNoteRequestInput: Partial<SubmitNoteRequestInput>;
  Trait: Partial<Trait>;
  TraitOption: Partial<TraitOption>;
  TraitStats: Partial<TraitStats>;
  TraitVote: Partial<TraitVote>;
  TraitVoteDistribution: Partial<TraitVoteDistribution>;
  UpdateAccordRequestInput: Partial<UpdateAccordRequestInput>;
  UpdateBrandRequestInput: Partial<UpdateBrandRequestInput>;
  UpdateFragranceRequestInput: Partial<UpdateFragranceRequestInput>;
  UpdateNoteRequestInput: Partial<UpdateNoteRequestInput>;
  UpdateUserInput: Partial<UpdateUserInput>;
  User: IUserSummary;
  VoteInfo: Partial<VoteInfo>;
  VoteOnAccordRequestInput: Partial<VoteOnAccordRequestInput>;
  VoteOnBrandRequestInput: Partial<VoteOnBrandRequestInput>;
  VoteOnFragranceRequestInput: Partial<VoteOnFragranceRequestInput>;
  VoteOnNoteRequestInput: Partial<VoteOnNoteRequestInput>;
}>;

export type AccordResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['Accord'] = ResolversParentTypes['Accord']> = ResolversObject<{
  color?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AccordConnectionResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['AccordConnection'] = ResolversParentTypes['AccordConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['AccordEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AccordEdgeResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['AccordEdge'] = ResolversParentTypes['AccordEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Accord'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AccordRequestResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['AccordRequest'] = ResolversParentTypes['AccordRequest']> = ResolversObject<{
  color?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['AccordRequestImage']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  requestStatus?: Resolver<ResolversTypes['RequestStatus'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  version?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  votes?: Resolver<ResolversTypes['VoteInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AccordRequestConnectionResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['AccordRequestConnection'] = ResolversParentTypes['AccordRequestConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['AccordRequestEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AccordRequestEdgeResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['AccordRequestEdge'] = ResolversParentTypes['AccordRequestEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['AccordRequest'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AccordRequestImageResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['AccordRequestImage'] = ResolversParentTypes['AccordRequestImage']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AccordRequestImageConnectionResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['AccordRequestImageConnection'] = ResolversParentTypes['AccordRequestImageConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['AccordRequestImageEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AccordRequestImageEdgeResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['AccordRequestImageEdge'] = ResolversParentTypes['AccordRequestImageEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['AccordRequestImage'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AssetResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['Asset'] = ResolversParentTypes['Asset']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  size?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AuthCodeDeliveryDetailsResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['AuthCodeDeliveryDetails'] = ResolversParentTypes['AuthCodeDeliveryDetails']> = ResolversObject<{
  attribute?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  destination?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  method?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AuthDeliveryResultResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['AuthDeliveryResult'] = ResolversParentTypes['AuthDeliveryResult']> = ResolversObject<{
  delivery?: Resolver<Maybe<ResolversTypes['AuthCodeDeliveryDetails']>, ParentType, ContextType>;
  isComplete?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AuthTokenPayloadResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['AuthTokenPayload'] = ResolversParentTypes['AuthTokenPayload']> = ResolversObject<{
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  expiresIn?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  idToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BrandResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['Brand'] = ResolversParentTypes['Brand']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  image?: Resolver<ResolversTypes['Asset'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BrandConnectionResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['BrandConnection'] = ResolversParentTypes['BrandConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['BrandEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BrandEdgeResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['BrandEdge'] = ResolversParentTypes['BrandEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Brand'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BrandRequestResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['BrandRequest'] = ResolversParentTypes['BrandRequest']> = ResolversObject<{
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['BrandRequestImage']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  requestStatus?: Resolver<ResolversTypes['RequestStatus'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  version?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  votes?: Resolver<ResolversTypes['VoteInfo'], ParentType, ContextType>;
  website?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BrandRequestConnectionResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['BrandRequestConnection'] = ResolversParentTypes['BrandRequestConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['BrandRequestEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BrandRequestEdgeResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['BrandRequestEdge'] = ResolversParentTypes['BrandRequestEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['BrandRequest'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BrandRequestImageResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['BrandRequestImage'] = ResolversParentTypes['BrandRequestImage']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BrandRequestImageConnectionResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['BrandRequestImageConnection'] = ResolversParentTypes['BrandRequestImageConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['BrandRequestImageEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BrandRequestImageEdgeResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['BrandRequestImageEdge'] = ResolversParentTypes['BrandRequestImageEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['BrandRequestImage'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type FragranceResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['Fragrance'] = ResolversParentTypes['Fragrance']> = ResolversObject<{
  brand?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  concentration?: Resolver<ResolversTypes['Concentration'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  images?: Resolver<ResolversTypes['FragranceImageConnection'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  releaseYear?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['FragranceStatus'], ParentType, ContextType>;
  traits?: Resolver<Array<ResolversTypes['Trait']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceConnectionResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['FragranceConnection'] = ResolversParentTypes['FragranceConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['FragranceEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceEdgeResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['FragranceEdge'] = ResolversParentTypes['FragranceEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Fragrance'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceImageResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['FragranceImage'] = ResolversParentTypes['FragranceImage']> = ResolversObject<{
  bg?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  height?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  width?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceImageConnectionResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['FragranceImageConnection'] = ResolversParentTypes['FragranceImageConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['FragranceImageEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceImageEdgeResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['FragranceImageEdge'] = ResolversParentTypes['FragranceImageEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['FragranceImage'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceRequestResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['FragranceRequest'] = ResolversParentTypes['FragranceRequest']> = ResolversObject<{
  accords?: Resolver<Array<ResolversTypes['Accord']>, ParentType, ContextType>;
  brand?: Resolver<Maybe<ResolversTypes['Brand']>, ParentType, ContextType>;
  concentration?: Resolver<Maybe<ResolversTypes['Concentration']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  fragranceStatus?: Resolver<Maybe<ResolversTypes['FragranceStatus']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['FragranceRequestImage']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  notes?: Resolver<Array<ResolversTypes['Note']>, ParentType, ContextType, RequireFields<FragranceRequestNotesArgs, 'layer'>>;
  releaseYear?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  requestStatus?: Resolver<ResolversTypes['RequestStatus'], ParentType, ContextType>;
  trait?: Resolver<ResolversTypes['FragranceRequestTrait'], ParentType, ContextType, RequireFields<FragranceRequestTraitArgs, 'type'>>;
  traits?: Resolver<Array<ResolversTypes['FragranceRequestTrait']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  version?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  votes?: Resolver<ResolversTypes['VoteInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceRequestConnectionResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['FragranceRequestConnection'] = ResolversParentTypes['FragranceRequestConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['FragranceRequestEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceRequestEdgeResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['FragranceRequestEdge'] = ResolversParentTypes['FragranceRequestEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['FragranceRequest'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceRequestImageResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['FragranceRequestImage'] = ResolversParentTypes['FragranceRequestImage']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceRequestImageConnectionResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['FragranceRequestImageConnection'] = ResolversParentTypes['FragranceRequestImageConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['FragranceRequestImageEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceRequestImageEdgeResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['FragranceRequestImageEdge'] = ResolversParentTypes['FragranceRequestImageEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['FragranceRequestImage'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceRequestTraitResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['FragranceRequestTrait'] = ResolversParentTypes['FragranceRequestTrait']> = ResolversObject<{
  selectedOption?: Resolver<ResolversTypes['TraitOption'], ParentType, ContextType>;
  traitType?: Resolver<ResolversTypes['TraitTypeEnum'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type MutationResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  confirmForgotPassword?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationConfirmForgotPasswordArgs, 'input'>>;
  confirmSignUp?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationConfirmSignUpArgs, 'input'>>;
  createAccordRequest?: Resolver<ResolversTypes['AccordRequest'], ParentType, ContextType, RequireFields<MutationCreateAccordRequestArgs, 'input'>>;
  createBrandRequest?: Resolver<ResolversTypes['BrandRequest'], ParentType, ContextType, RequireFields<MutationCreateBrandRequestArgs, 'input'>>;
  createFragranceRequest?: Resolver<ResolversTypes['FragranceRequest'], ParentType, ContextType, RequireFields<MutationCreateFragranceRequestArgs, 'input'>>;
  createNoteRequest?: Resolver<ResolversTypes['NoteRequest'], ParentType, ContextType, RequireFields<MutationCreateNoteRequestArgs, 'input'>>;
  deleteAccordRequest?: Resolver<ResolversTypes['AccordRequest'], ParentType, ContextType, RequireFields<MutationDeleteAccordRequestArgs, 'input'>>;
  deleteAccordRequestImage?: Resolver<ResolversTypes['AccordRequest'], ParentType, ContextType, RequireFields<MutationDeleteAccordRequestImageArgs, 'input'>>;
  deleteBrandRequest?: Resolver<ResolversTypes['BrandRequest'], ParentType, ContextType, RequireFields<MutationDeleteBrandRequestArgs, 'input'>>;
  deleteBrandRequestImage?: Resolver<ResolversTypes['BrandRequest'], ParentType, ContextType, RequireFields<MutationDeleteBrandRequestImageArgs, 'input'>>;
  deleteFragranceRequest?: Resolver<ResolversTypes['FragranceRequest'], ParentType, ContextType, RequireFields<MutationDeleteFragranceRequestArgs, 'input'>>;
  deleteFragranceRequestImage?: Resolver<ResolversTypes['FragranceRequest'], ParentType, ContextType, RequireFields<MutationDeleteFragranceRequestImageArgs, 'input'>>;
  deleteNoteRequest?: Resolver<ResolversTypes['NoteRequest'], ParentType, ContextType, RequireFields<MutationDeleteNoteRequestArgs, 'input'>>;
  deleteNoteRequestImage?: Resolver<ResolversTypes['NoteRequest'], ParentType, ContextType, RequireFields<MutationDeleteNoteRequestImageArgs, 'input'>>;
  finalizeAccordRequestImage?: Resolver<ResolversTypes['AccordRequest'], ParentType, ContextType, RequireFields<MutationFinalizeAccordRequestImageArgs, 'input'>>;
  finalizeBrandRequestImage?: Resolver<ResolversTypes['BrandRequest'], ParentType, ContextType, RequireFields<MutationFinalizeBrandRequestImageArgs, 'input'>>;
  finalizeFragranceRequestImage?: Resolver<ResolversTypes['FragranceRequest'], ParentType, ContextType, RequireFields<MutationFinalizeFragranceRequestImageArgs, 'input'>>;
  finalizeNoteRequestImage?: Resolver<ResolversTypes['NoteRequest'], ParentType, ContextType, RequireFields<MutationFinalizeNoteRequestImageArgs, 'input'>>;
  forgotPassword?: Resolver<ResolversTypes['AuthDeliveryResult'], ParentType, ContextType, RequireFields<MutationForgotPasswordArgs, 'input'>>;
  logIn?: Resolver<ResolversTypes['AuthTokenPayload'], ParentType, ContextType, RequireFields<MutationLogInArgs, 'input'>>;
  logOut?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  refresh?: Resolver<Maybe<ResolversTypes['AuthTokenPayload']>, ParentType, ContextType>;
  resendSignUpCode?: Resolver<ResolversTypes['AuthDeliveryResult'], ParentType, ContextType, RequireFields<MutationResendSignUpCodeArgs, 'input'>>;
  setFragranceRequestAccords?: Resolver<ResolversTypes['FragranceRequest'], ParentType, ContextType, RequireFields<MutationSetFragranceRequestAccordsArgs, 'input'>>;
  setFragranceRequestBrand?: Resolver<ResolversTypes['FragranceRequest'], ParentType, ContextType, RequireFields<MutationSetFragranceRequestBrandArgs, 'input'>>;
  setFragranceRequestNotes?: Resolver<ResolversTypes['FragranceRequest'], ParentType, ContextType, RequireFields<MutationSetFragranceRequestNotesArgs, 'input'>>;
  setFragranceRequestTrait?: Resolver<ResolversTypes['FragranceRequest'], ParentType, ContextType, RequireFields<MutationSetFragranceRequestTraitArgs, 'input'>>;
  signUp?: Resolver<ResolversTypes['AuthDeliveryResult'], ParentType, ContextType, RequireFields<MutationSignUpArgs, 'input'>>;
  stageAccordRequestImage?: Resolver<ResolversTypes['PresignedUpload'], ParentType, ContextType, RequireFields<MutationStageAccordRequestImageArgs, 'input'>>;
  stageBrandRequestImage?: Resolver<ResolversTypes['PresignedUpload'], ParentType, ContextType, RequireFields<MutationStageBrandRequestImageArgs, 'input'>>;
  stageFragranceRequestImage?: Resolver<ResolversTypes['PresignedUpload'], ParentType, ContextType, RequireFields<MutationStageFragranceRequestImageArgs, 'input'>>;
  stageNoteRequestImage?: Resolver<ResolversTypes['PresignedUpload'], ParentType, ContextType, RequireFields<MutationStageNoteRequestImageArgs, 'input'>>;
  submitAccordRequest?: Resolver<ResolversTypes['AccordRequest'], ParentType, ContextType, RequireFields<MutationSubmitAccordRequestArgs, 'input'>>;
  submitBrandRequest?: Resolver<ResolversTypes['BrandRequest'], ParentType, ContextType, RequireFields<MutationSubmitBrandRequestArgs, 'input'>>;
  submitFragranceRequest?: Resolver<ResolversTypes['FragranceRequest'], ParentType, ContextType, RequireFields<MutationSubmitFragranceRequestArgs, 'input'>>;
  submitNoteRequest?: Resolver<ResolversTypes['NoteRequest'], ParentType, ContextType, RequireFields<MutationSubmitNoteRequestArgs, 'input'>>;
  updateAccordRequest?: Resolver<ResolversTypes['AccordRequest'], ParentType, ContextType, RequireFields<MutationUpdateAccordRequestArgs, 'input'>>;
  updateBrandRequest?: Resolver<ResolversTypes['BrandRequest'], ParentType, ContextType, RequireFields<MutationUpdateBrandRequestArgs, 'input'>>;
  updateFragranceRequest?: Resolver<ResolversTypes['FragranceRequest'], ParentType, ContextType, RequireFields<MutationUpdateFragranceRequestArgs, 'input'>>;
  updateNoteRequest?: Resolver<ResolversTypes['NoteRequest'], ParentType, ContextType, RequireFields<MutationUpdateNoteRequestArgs, 'input'>>;
  updateUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'input'>>;
  updateUserAvatar?: Resolver<ResolversTypes['PresignedUpload'], ParentType, ContextType, RequireFields<MutationUpdateUserAvatarArgs, 'input'>>;
  voteOnAccordRequest?: Resolver<ResolversTypes['AccordRequest'], ParentType, ContextType, RequireFields<MutationVoteOnAccordRequestArgs, 'input'>>;
  voteOnBrandRequest?: Resolver<ResolversTypes['BrandRequest'], ParentType, ContextType, RequireFields<MutationVoteOnBrandRequestArgs, 'input'>>;
  voteOnFragranceRequest?: Resolver<ResolversTypes['FragranceRequest'], ParentType, ContextType, RequireFields<MutationVoteOnFragranceRequestArgs, 'input'>>;
  voteOnNoteRequest?: Resolver<ResolversTypes['NoteRequest'], ParentType, ContextType, RequireFields<MutationVoteOnNoteRequestArgs, 'input'>>;
}>;

export type NoteResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['Note'] = ResolversParentTypes['Note']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type NoteConnectionResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['NoteConnection'] = ResolversParentTypes['NoteConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['NoteEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type NoteEdgeResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['NoteEdge'] = ResolversParentTypes['NoteEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Note'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type NoteRequestResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['NoteRequest'] = ResolversParentTypes['NoteRequest']> = ResolversObject<{
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['NoteRequestImage']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  requestStatus?: Resolver<ResolversTypes['RequestStatus'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  version?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  votes?: Resolver<ResolversTypes['VoteInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type NoteRequestConnectionResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['NoteRequestConnection'] = ResolversParentTypes['NoteRequestConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['NoteRequestEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type NoteRequestEdgeResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['NoteRequestEdge'] = ResolversParentTypes['NoteRequestEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['NoteRequest'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type NoteRequestImageResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['NoteRequestImage'] = ResolversParentTypes['NoteRequestImage']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type NoteRequestImageConnectionResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['NoteRequestImageConnection'] = ResolversParentTypes['NoteRequestImageConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['NoteRequestImageEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type NoteRequestImageEdgeResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['NoteRequestImageEdge'] = ResolversParentTypes['NoteRequestImageEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['NoteRequestImage'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PageInfoResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = ResolversObject<{
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  startCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PresignedUploadResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['PresignedUpload'] = ResolversParentTypes['PresignedUpload']> = ResolversObject<{
  fields?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  accordRequest?: Resolver<ResolversTypes['AccordRequest'], ParentType, ContextType, RequireFields<QueryAccordRequestArgs, 'id'>>;
  accordRequests?: Resolver<ResolversTypes['AccordRequestConnection'], ParentType, ContextType, Partial<QueryAccordRequestsArgs>>;
  accords?: Resolver<ResolversTypes['AccordConnection'], ParentType, ContextType, Partial<QueryAccordsArgs>>;
  brandRequest?: Resolver<ResolversTypes['BrandRequest'], ParentType, ContextType, RequireFields<QueryBrandRequestArgs, 'id'>>;
  brandRequests?: Resolver<ResolversTypes['BrandRequestConnection'], ParentType, ContextType, Partial<QueryBrandRequestsArgs>>;
  brands?: Resolver<ResolversTypes['BrandConnection'], ParentType, ContextType, Partial<QueryBrandsArgs>>;
  fragranceRequest?: Resolver<ResolversTypes['FragranceRequest'], ParentType, ContextType, RequireFields<QueryFragranceRequestArgs, 'id'>>;
  fragranceRequests?: Resolver<ResolversTypes['FragranceRequestConnection'], ParentType, ContextType, Partial<QueryFragranceRequestsArgs>>;
  me?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  noteRequest?: Resolver<ResolversTypes['NoteRequest'], ParentType, ContextType, RequireFields<QueryNoteRequestArgs, 'id'>>;
  noteRequests?: Resolver<ResolversTypes['NoteRequestConnection'], ParentType, ContextType, Partial<QueryNoteRequestsArgs>>;
  notes?: Resolver<ResolversTypes['NoteConnection'], ParentType, ContextType, Partial<QueryNotesArgs>>;
  searchAccords?: Resolver<Array<ResolversTypes['Accord']>, ParentType, ContextType, Partial<QuerySearchAccordsArgs>>;
  searchBrands?: Resolver<Array<ResolversTypes['Brand']>, ParentType, ContextType, Partial<QuerySearchBrandsArgs>>;
  searchNotes?: Resolver<Array<ResolversTypes['Note']>, ParentType, ContextType, Partial<QuerySearchNotesArgs>>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
}>;

export type TraitResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['Trait'] = ResolversParentTypes['Trait']> = ResolversObject<{
  myVote?: Resolver<Maybe<ResolversTypes['TraitVote']>, ParentType, ContextType>;
  options?: Resolver<Array<ResolversTypes['TraitOption']>, ParentType, ContextType>;
  stats?: Resolver<Maybe<ResolversTypes['TraitStats']>, ParentType, ContextType>;
  traitType?: Resolver<ResolversTypes['TraitTypeEnum'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TraitOptionResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['TraitOption'] = ResolversParentTypes['TraitOption']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  score?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TraitStatsResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['TraitStats'] = ResolversParentTypes['TraitStats']> = ResolversObject<{
  averageScore?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  distribution?: Resolver<Array<ResolversTypes['TraitVoteDistribution']>, ParentType, ContextType>;
  totalVotes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TraitVoteResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['TraitVote'] = ResolversParentTypes['TraitVote']> = ResolversObject<{
  option?: Resolver<ResolversTypes['TraitOption'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TraitVoteDistributionResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['TraitVoteDistribution'] = ResolversParentTypes['TraitVoteDistribution']> = ResolversObject<{
  option?: Resolver<ResolversTypes['TraitOption'], ParentType, ContextType>;
  votes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  avatarSrc?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  avatarStatus?: Resolver<ResolversTypes['AvatarStatus'], ParentType, ContextType>;
  brandRequests?: Resolver<ResolversTypes['BrandRequestConnection'], ParentType, ContextType, Partial<UserBrandRequestsArgs>>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fragranceRequests?: Resolver<ResolversTypes['FragranceRequestConnection'], ParentType, ContextType, Partial<UserFragranceRequestsArgs>>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VoteInfoResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['VoteInfo'] = ResolversParentTypes['VoteInfo']> = ResolversObject<{
  downvotes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  myVote?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  score?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  upvotes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = ServerContext> = ResolversObject<{
  Accord?: AccordResolvers<ContextType>;
  AccordConnection?: AccordConnectionResolvers<ContextType>;
  AccordEdge?: AccordEdgeResolvers<ContextType>;
  AccordRequest?: AccordRequestResolvers<ContextType>;
  AccordRequestConnection?: AccordRequestConnectionResolvers<ContextType>;
  AccordRequestEdge?: AccordRequestEdgeResolvers<ContextType>;
  AccordRequestImage?: AccordRequestImageResolvers<ContextType>;
  AccordRequestImageConnection?: AccordRequestImageConnectionResolvers<ContextType>;
  AccordRequestImageEdge?: AccordRequestImageEdgeResolvers<ContextType>;
  Asset?: AssetResolvers<ContextType>;
  AuthCodeDeliveryDetails?: AuthCodeDeliveryDetailsResolvers<ContextType>;
  AuthDeliveryResult?: AuthDeliveryResultResolvers<ContextType>;
  AuthTokenPayload?: AuthTokenPayloadResolvers<ContextType>;
  Brand?: BrandResolvers<ContextType>;
  BrandConnection?: BrandConnectionResolvers<ContextType>;
  BrandEdge?: BrandEdgeResolvers<ContextType>;
  BrandRequest?: BrandRequestResolvers<ContextType>;
  BrandRequestConnection?: BrandRequestConnectionResolvers<ContextType>;
  BrandRequestEdge?: BrandRequestEdgeResolvers<ContextType>;
  BrandRequestImage?: BrandRequestImageResolvers<ContextType>;
  BrandRequestImageConnection?: BrandRequestImageConnectionResolvers<ContextType>;
  BrandRequestImageEdge?: BrandRequestImageEdgeResolvers<ContextType>;
  Date?: GraphQLScalarType;
  Fragrance?: FragranceResolvers<ContextType>;
  FragranceConnection?: FragranceConnectionResolvers<ContextType>;
  FragranceEdge?: FragranceEdgeResolvers<ContextType>;
  FragranceImage?: FragranceImageResolvers<ContextType>;
  FragranceImageConnection?: FragranceImageConnectionResolvers<ContextType>;
  FragranceImageEdge?: FragranceImageEdgeResolvers<ContextType>;
  FragranceRequest?: FragranceRequestResolvers<ContextType>;
  FragranceRequestConnection?: FragranceRequestConnectionResolvers<ContextType>;
  FragranceRequestEdge?: FragranceRequestEdgeResolvers<ContextType>;
  FragranceRequestImage?: FragranceRequestImageResolvers<ContextType>;
  FragranceRequestImageConnection?: FragranceRequestImageConnectionResolvers<ContextType>;
  FragranceRequestImageEdge?: FragranceRequestImageEdgeResolvers<ContextType>;
  FragranceRequestTrait?: FragranceRequestTraitResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Note?: NoteResolvers<ContextType>;
  NoteConnection?: NoteConnectionResolvers<ContextType>;
  NoteEdge?: NoteEdgeResolvers<ContextType>;
  NoteRequest?: NoteRequestResolvers<ContextType>;
  NoteRequestConnection?: NoteRequestConnectionResolvers<ContextType>;
  NoteRequestEdge?: NoteRequestEdgeResolvers<ContextType>;
  NoteRequestImage?: NoteRequestImageResolvers<ContextType>;
  NoteRequestImageConnection?: NoteRequestImageConnectionResolvers<ContextType>;
  NoteRequestImageEdge?: NoteRequestImageEdgeResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  PresignedUpload?: PresignedUploadResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Trait?: TraitResolvers<ContextType>;
  TraitOption?: TraitOptionResolvers<ContextType>;
  TraitStats?: TraitStatsResolvers<ContextType>;
  TraitVote?: TraitVoteResolvers<ContextType>;
  TraitVoteDistribution?: TraitVoteDistributionResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  VoteInfo?: VoteInfoResolvers<ContextType>;
}>;

