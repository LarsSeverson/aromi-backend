import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { IAssetResult } from '../features/assets/types.js';
import { IUserSummary } from '../features/users/types.js';
import { IFragranceSummary, IFragranceEditSummary, IFragranceRequestSummary } from '../features/fragrances/types.js';
import { IBrandSummary, IBrandEditSummary, IBrandRequestSummary } from '../features/brands/types.js';
import { IAccordEditSummary, IAccordRequestSummary } from '../features/accords/types.js';
import { INoteSummary, INoteEditSummary, INoteRequestSummary } from '../features/notes/types.js';
import { ServerContext } from '@src/context/index.js';
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

export type AccordEdit = {
  __typename?: 'AccordEdit';
  accord: Accord;
  id: Scalars['ID']['output'];
  proposedColor?: Maybe<Scalars['String']['output']>;
  proposedDescription?: Maybe<Scalars['String']['output']>;
  proposedName?: Maybe<Scalars['String']['output']>;
  reason?: Maybe<Scalars['String']['output']>;
  reviewer?: Maybe<User>;
  status: EditStatus;
  user: User;
};

export type AccordEditConnection = {
  __typename?: 'AccordEditConnection';
  edges: Array<AccordEditEdge>;
  pageInfo: PageInfo;
};

export type AccordEditEdge = {
  __typename?: 'AccordEditEdge';
  cursor: Scalars['String']['output'];
  node: AccordEdit;
};

export type AccordEditPaginationInput = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<AccordEditSortInput>;
};

export const AccordEditSortBy = {
  Recent: 'RECENT'
} as const;

export type AccordEditSortBy = typeof AccordEditSortBy[keyof typeof AccordEditSortBy];
export type AccordEditSortInput = {
  by?: InputMaybe<AccordEditSortBy>;
  direction?: InputMaybe<SortDirection>;
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
  name?: Maybe<Scalars['String']['output']>;
  requestStatus: RequestStatus;
  thumbnail?: Maybe<Asset>;
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
  contentSize: Scalars['Int']['output'];
  contentType: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  s3Key: Scalars['String']['output'];
  url?: Maybe<Scalars['String']['output']>;
};

export const AssetKey = {
  AccordImages: 'ACCORD_IMAGES',
  BrandImages: 'BRAND_IMAGES',
  FragranceImages: 'FRAGRANCE_IMAGES',
  NoteImages: 'NOTE_IMAGES',
  UserImages: 'USER_IMAGES'
} as const;

export type AssetKey = typeof AssetKey[keyof typeof AssetKey];
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
  avatar?: Maybe<Asset>;
  description?: Maybe<Scalars['String']['output']>;
  fragrances: FragranceConnection;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  votes: VoteInfo;
  website?: Maybe<Scalars['String']['output']>;
};


export type BrandFragrancesArgs = {
  input?: InputMaybe<FragrancePaginationInput>;
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

export type BrandEdit = {
  __typename?: 'BrandEdit';
  brand: Brand;
  id: Scalars['ID']['output'];
  proposedAvatar?: Maybe<Asset>;
  proposedDescription?: Maybe<Scalars['String']['output']>;
  proposedName?: Maybe<Scalars['String']['output']>;
  proposedWebsite?: Maybe<Scalars['String']['output']>;
  reason?: Maybe<Scalars['String']['output']>;
  reviewer?: Maybe<User>;
  status: EditStatus;
  user: User;
};

export type BrandEditConnection = {
  __typename?: 'BrandEditConnection';
  edges: Array<BrandEditEdge>;
  pageInfo: PageInfo;
};

export type BrandEditEdge = {
  __typename?: 'BrandEditEdge';
  cursor: Scalars['String']['output'];
  node: BrandEdit;
};

export type BrandEditPaginationInput = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<BrandEditSortInput>;
};

export const BrandEditSortBy = {
  Recent: 'RECENT'
} as const;

export type BrandEditSortBy = typeof BrandEditSortBy[keyof typeof BrandEditSortBy];
export type BrandEditSortInput = {
  by?: InputMaybe<BrandEditSortBy>;
  direction?: InputMaybe<SortDirection>;
};

export type BrandPaginationInput = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<BrandSortInput>;
};

export type BrandRequest = {
  __typename?: 'BrandRequest';
  avatar?: Maybe<Asset>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
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

export type CreateAccordEditInput = {
  accordId: Scalars['ID']['input'];
  proposedColor?: InputMaybe<Scalars['String']['input']>;
  proposedDescription?: InputMaybe<Scalars['String']['input']>;
  proposedName?: InputMaybe<Scalars['String']['input']>;
  reason?: InputMaybe<Scalars['String']['input']>;
};

export type CreateAccordRequestInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type CreateBrandEditInput = {
  brandId: Scalars['ID']['input'];
  proposedAvatarId?: InputMaybe<Scalars['ID']['input']>;
  proposedDescription?: InputMaybe<Scalars['String']['input']>;
  proposedName?: InputMaybe<Scalars['String']['input']>;
  proposedWebsite?: InputMaybe<Scalars['String']['input']>;
  reason?: InputMaybe<Scalars['String']['input']>;
};

export type CreateBrandRequestInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export type CreateFragranceEditInput = {
  fragranceId: Scalars['ID']['input'];
  proposedBrandId?: InputMaybe<Scalars['ID']['input']>;
  proposedConcentration?: InputMaybe<Concentration>;
  proposedDescription?: InputMaybe<Scalars['String']['input']>;
  proposedImageId?: InputMaybe<Scalars['ID']['input']>;
  proposedName?: InputMaybe<Scalars['String']['input']>;
  proposedReleaseYear?: InputMaybe<Scalars['Int']['input']>;
  proposedStatus?: InputMaybe<FragranceStatus>;
  reason?: InputMaybe<Scalars['String']['input']>;
};

export type CreateFragranceRequestInput = {
  assetId?: InputMaybe<Scalars['ID']['input']>;
  concentration?: InputMaybe<Concentration>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  releaseYear?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<FragranceStatus>;
};

export type CreateNoteEditInput = {
  noteId: Scalars['ID']['input'];
  proposedDescription?: InputMaybe<Scalars['String']['input']>;
  proposedName?: InputMaybe<Scalars['String']['input']>;
  proposedThumbnailId?: InputMaybe<Scalars['String']['input']>;
  reason?: InputMaybe<Scalars['String']['input']>;
};

export type CreateNoteRequestInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type DeleteAccordRequestInput = {
  id: Scalars['ID']['input'];
};

export type DeleteAssetInput = {
  id: Scalars['ID']['input'];
};

export type DeleteBrandRequestInput = {
  id: Scalars['ID']['input'];
};

export type DeleteFragranceRequestInput = {
  id: Scalars['ID']['input'];
};

export type DeleteNoteRequestInput = {
  id: Scalars['ID']['input'];
};

export type EditJob = {
  __typename?: 'EditJob';
  error?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  status: EditJobStatus;
};

export const EditJobStatus = {
  Failed: 'FAILED',
  Processing: 'PROCESSING',
  Queued: 'QUEUED',
  Success: 'SUCCESS'
} as const;

export type EditJobStatus = typeof EditJobStatus[keyof typeof EditJobStatus];
export const EditStatus = {
  Approved: 'APPROVED',
  Pending: 'PENDING',
  Rejected: 'REJECTED'
} as const;

export type EditStatus = typeof EditStatus[keyof typeof EditStatus];
export type ForgotPasswordInput = {
  email: Scalars['String']['input'];
};

export type Fragrance = {
  __typename?: 'Fragrance';
  accords: FragranceAccordConnection;
  brand: Brand;
  concentration: Concentration;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  images: Array<FragranceImage>;
  name: Scalars['String']['output'];
  notes: FragranceNoteConnection;
  releaseYear: Scalars['Int']['output'];
  status: FragranceStatus;
  thumbnail?: Maybe<FragranceImage>;
  traits: Array<FragranceTrait>;
  votes: VoteInfo;
};


export type FragranceAccordsArgs = {
  input?: InputMaybe<FragranceAccordPaginationInput>;
};


export type FragranceNotesArgs = {
  input?: InputMaybe<FragranceNotePaginationInput>;
};

export type FragranceAccord = {
  __typename?: 'FragranceAccord';
  accord: Accord;
  id: Scalars['ID']['output'];
  votes: VoteInfo;
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

export type FragranceAccordPaginationInput = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<FragranceAccordSortInput>;
};

export const FragranceAccordSortBy = {
  Votes: 'VOTES'
} as const;

export type FragranceAccordSortBy = typeof FragranceAccordSortBy[keyof typeof FragranceAccordSortBy];
export type FragranceAccordSortInput = {
  by?: InputMaybe<FragranceAccordSortBy>;
  direction?: InputMaybe<SortDirection>;
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

export type FragranceEdit = {
  __typename?: 'FragranceEdit';
  fragrance: Fragrance;
  id: Scalars['ID']['output'];
  proposedBrand?: Maybe<Brand>;
  proposedConcentration?: Maybe<Concentration>;
  proposedDescription?: Maybe<Scalars['String']['output']>;
  proposedImage?: Maybe<Asset>;
  proposedName?: Maybe<Scalars['String']['output']>;
  proposedReleaseYear?: Maybe<Scalars['Int']['output']>;
  proposedStatus?: Maybe<FragranceStatus>;
  reason?: Maybe<Scalars['String']['output']>;
  reviewer?: Maybe<User>;
  status: EditStatus;
  user: User;
};

export type FragranceEditConnection = {
  __typename?: 'FragranceEditConnection';
  edges: Array<FragranceEditEdge>;
  pageInfo: PageInfo;
};

export type FragranceEditEdge = {
  __typename?: 'FragranceEditEdge';
  cursor: Scalars['String']['output'];
  node: FragranceEdit;
};

export type FragranceEditPaginationInput = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<FragranceEditSortInput>;
};

export const FragranceEditSortBy = {
  Recent: 'RECENT'
} as const;

export type FragranceEditSortBy = typeof FragranceEditSortBy[keyof typeof FragranceEditSortBy];
export type FragranceEditSortInput = {
  by?: InputMaybe<FragranceEditSortBy>;
  direction?: InputMaybe<SortDirection>;
};

export type FragranceImage = {
  __typename?: 'FragranceImage';
  height: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  primaryColor?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
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
  id: Scalars['ID']['output'];
  layer: NoteLayer;
  note: Note;
  votes: VoteInfo;
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

export type FragranceNotePaginationInput = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  layer?: InputMaybe<NoteLayer>;
  sort?: InputMaybe<FragranceNoteSortInput>;
};

export const FragranceNoteSortBy = {
  Votes: 'VOTES'
} as const;

export type FragranceNoteSortBy = typeof FragranceNoteSortBy[keyof typeof FragranceNoteSortBy];
export type FragranceNoteSortInput = {
  by?: InputMaybe<FragranceNoteSortBy>;
  direction?: InputMaybe<SortDirection>;
};

export type FragrancePaginationInput = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<FragranceSortInput>;
};

export type FragranceRequest = {
  __typename?: 'FragranceRequest';
  accords: Array<Accord>;
  brand?: Maybe<Brand>;
  concentration?: Maybe<Concentration>;
  description?: Maybe<Scalars['String']['output']>;
  fragranceStatus?: Maybe<FragranceStatus>;
  id: Scalars['ID']['output'];
  image?: Maybe<Asset>;
  name?: Maybe<Scalars['String']['output']>;
  notes: Array<FragranceRequestNote>;
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

export type FragranceRequestNote = {
  __typename?: 'FragranceRequestNote';
  id: Scalars['ID']['output'];
  layer: NoteLayer;
  note: Note;
};

export type FragranceRequestTrait = {
  __typename?: 'FragranceRequestTrait';
  selectedOption: TraitOption;
  traitType: TraitTypeEnum;
};

export const FragranceSortBy = {
  Recent: 'RECENT'
} as const;

export type FragranceSortBy = typeof FragranceSortBy[keyof typeof FragranceSortBy];
export type FragranceSortInput = {
  by?: InputMaybe<FragranceSortBy>;
  direction?: InputMaybe<SortDirection>;
};

export const FragranceStatus = {
  Current: 'CURRENT',
  Discontinued: 'DISCONTINUED',
  Reformulated: 'REFORMULATED'
} as const;

export type FragranceStatus = typeof FragranceStatus[keyof typeof FragranceStatus];
export type FragranceTrait = {
  __typename?: 'FragranceTrait';
  id: Scalars['ID']['output'];
  myVote?: Maybe<TraitVote>;
  name: Scalars['String']['output'];
  options: Array<TraitOption>;
  stats?: Maybe<TraitStats>;
  type: TraitTypeEnum;
};

export type FragranceTraitInput = {
  type: TraitTypeEnum;
};

export type LogInInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  confirmForgotPassword: Scalars['Boolean']['output'];
  confirmSignUp: Scalars['Boolean']['output'];
  createAccordEdit: AccordEdit;
  createAccordRequest: AccordRequest;
  createBrandEdit: BrandEdit;
  createBrandRequest: BrandRequest;
  createFragranceEdit: FragranceEdit;
  createFragranceRequest: FragranceRequest;
  createNoteEdit: NoteEdit;
  createNoteRequest: NoteRequest;
  deleteAccordRequest: AccordRequest;
  deleteAsset: Scalars['Boolean']['output'];
  deleteBrandRequest: BrandRequest;
  deleteFragranceRequest: FragranceRequest;
  deleteNoteRequest: NoteRequest;
  forgotPassword: AuthDeliveryResult;
  logIn: AuthTokenPayload;
  logOut: Scalars['Boolean']['output'];
  refresh?: Maybe<AuthTokenPayload>;
  resendSignUpCode: AuthDeliveryResult;
  reviewAccordEdit: AccordEdit;
  reviewBrandEdit: BrandEdit;
  reviewFragranceEdit: FragranceEdit;
  reviewNoteEdit: NoteEdit;
  setFragranceRequestAccords: FragranceRequest;
  setFragranceRequestBrand: FragranceRequest;
  setFragranceRequestNotes: FragranceRequest;
  setFragranceRequestTrait: FragranceRequest;
  setMyAvatar: User;
  signUp: AuthDeliveryResult;
  stageAsset: PresignedUpload;
  submitAccordRequest: AccordRequest;
  submitBrandRequest: BrandRequest;
  submitFragranceRequest: FragranceRequest;
  submitNoteRequest: NoteRequest;
  updateAccordRequest: AccordRequest;
  updateBrandRequest: BrandRequest;
  updateFragranceRequest: FragranceRequest;
  updateMe: User;
  updateNoteRequest: NoteRequest;
  voteOnAccordRequest: AccordRequest;
  voteOnBrand: Brand;
  voteOnBrandRequest: BrandRequest;
  voteOnFragrance: Fragrance;
  voteOnFragranceAccord: Accord;
  voteOnFragranceNote: Note;
  voteOnFragranceRequest: FragranceRequest;
  voteOnFragranceTrait?: Maybe<TraitVote>;
  voteOnNoteRequest: NoteRequest;
};


export type MutationConfirmForgotPasswordArgs = {
  input: ConfirmForgotPasswordInput;
};


export type MutationConfirmSignUpArgs = {
  input: ConfirmSignUpInput;
};


export type MutationCreateAccordEditArgs = {
  input: CreateAccordEditInput;
};


export type MutationCreateAccordRequestArgs = {
  input?: InputMaybe<CreateAccordRequestInput>;
};


export type MutationCreateBrandEditArgs = {
  input: CreateBrandEditInput;
};


export type MutationCreateBrandRequestArgs = {
  input?: InputMaybe<CreateBrandRequestInput>;
};


export type MutationCreateFragranceEditArgs = {
  input: CreateFragranceEditInput;
};


export type MutationCreateFragranceRequestArgs = {
  input?: InputMaybe<CreateFragranceRequestInput>;
};


export type MutationCreateNoteEditArgs = {
  input: CreateNoteEditInput;
};


export type MutationCreateNoteRequestArgs = {
  input?: InputMaybe<CreateNoteRequestInput>;
};


export type MutationDeleteAccordRequestArgs = {
  input: DeleteAccordRequestInput;
};


export type MutationDeleteAssetArgs = {
  input: DeleteAssetInput;
};


export type MutationDeleteBrandRequestArgs = {
  input: DeleteBrandRequestInput;
};


export type MutationDeleteFragranceRequestArgs = {
  input: DeleteFragranceRequestInput;
};


export type MutationDeleteNoteRequestArgs = {
  input: DeleteNoteRequestInput;
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


export type MutationReviewAccordEditArgs = {
  input: ReviewAccordEditInput;
};


export type MutationReviewBrandEditArgs = {
  input: ReviewBrandEditInput;
};


export type MutationReviewFragranceEditArgs = {
  input: ReviewFragranceEditInput;
};


export type MutationReviewNoteEditArgs = {
  input: ReviewNoteEditInput;
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


export type MutationSetMyAvatarArgs = {
  input: SetMyAvatarInput;
};


export type MutationSignUpArgs = {
  input: SignUpInput;
};


export type MutationStageAssetArgs = {
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


export type MutationUpdateMeArgs = {
  input: UpdateMeInput;
};


export type MutationUpdateNoteRequestArgs = {
  input: UpdateNoteRequestInput;
};


export type MutationVoteOnAccordRequestArgs = {
  input: VoteOnAccordRequestInput;
};


export type MutationVoteOnBrandArgs = {
  input: VoteOnBrandInput;
};


export type MutationVoteOnBrandRequestArgs = {
  input: VoteOnBrandRequestInput;
};


export type MutationVoteOnFragranceArgs = {
  input: VoteOnFragranceInput;
};


export type MutationVoteOnFragranceAccordArgs = {
  input: VoteOnFragranceAccordInput;
};


export type MutationVoteOnFragranceNoteArgs = {
  input: VoteOnFragranceNoteInput;
};


export type MutationVoteOnFragranceRequestArgs = {
  input: VoteOnFragranceRequestInput;
};


export type MutationVoteOnFragranceTraitArgs = {
  input: VoteOnFragranceTraitInput;
};


export type MutationVoteOnNoteRequestArgs = {
  input: VoteOnNoteRequestInput;
};

export type Note = {
  __typename?: 'Note';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  thumbnail?: Maybe<Asset>;
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

export type NoteEdit = {
  __typename?: 'NoteEdit';
  id: Scalars['ID']['output'];
  note: Note;
  proposedDescription?: Maybe<Scalars['String']['output']>;
  proposedName?: Maybe<Scalars['String']['output']>;
  proposedThumbnail?: Maybe<Asset>;
  reason?: Maybe<Scalars['String']['output']>;
  reviewer?: Maybe<User>;
  status: EditStatus;
  user: User;
};

export type NoteEditConnection = {
  __typename?: 'NoteEditConnection';
  edges: Array<NoteEditEdge>;
  pageInfo: PageInfo;
};

export type NoteEditEdge = {
  __typename?: 'NoteEditEdge';
  cursor: Scalars['String']['output'];
  node: NoteEdit;
};

export type NoteEditPaginationInput = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<NoteEditSortInput>;
};

export const NoteEditSortBy = {
  Recent: 'RECENT'
} as const;

export type NoteEditSortBy = typeof NoteEditSortBy[keyof typeof NoteEditSortBy];
export type NoteEditSortInput = {
  by?: InputMaybe<NoteEditSortBy>;
  direction?: InputMaybe<SortDirection>;
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
  name?: Maybe<Scalars['String']['output']>;
  requestStatus: RequestStatus;
  thumbnail?: Maybe<Asset>;
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
  assetId: Scalars['ID']['output'];
  fields: Scalars['JSON']['output'];
  url: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  accord: Accord;
  accordEdit: AccordEdit;
  accordEdits: AccordEditConnection;
  accordRequest: AccordRequest;
  accordRequests: AccordRequestConnection;
  accords: AccordConnection;
  brand?: Maybe<Brand>;
  brandEdit: BrandEdit;
  brandEdits: BrandEditConnection;
  brandRequest: BrandRequest;
  brandRequests: BrandRequestConnection;
  brands: BrandConnection;
  fragrance: Fragrance;
  fragranceEdit: FragranceEdit;
  fragranceEdits: FragranceEditConnection;
  fragranceRequest: FragranceRequest;
  fragranceRequests: FragranceRequestConnection;
  fragrances: FragranceConnection;
  me: User;
  note: Note;
  noteEdit: NoteEdit;
  noteEdits: NoteEditConnection;
  noteRequest: NoteRequest;
  noteRequests: NoteRequestConnection;
  notes: NoteConnection;
  searchAccords: SearchAccordConnection;
  searchBrands: SearchBrandConnection;
  searchFragrances: SearchFragranceConnection;
  searchNotes: SearchNoteConnection;
  user: User;
};


export type QueryAccordArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAccordEditArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAccordEditsArgs = {
  input?: InputMaybe<AccordEditPaginationInput>;
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


export type QueryBrandArgs = {
  id: Scalars['ID']['input'];
};


export type QueryBrandEditArgs = {
  id: Scalars['ID']['input'];
};


export type QueryBrandEditsArgs = {
  input?: InputMaybe<BrandEditPaginationInput>;
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


export type QueryFragranceArgs = {
  id: Scalars['ID']['input'];
};


export type QueryFragranceEditArgs = {
  id: Scalars['ID']['input'];
};


export type QueryFragranceEditsArgs = {
  input?: InputMaybe<FragranceEditPaginationInput>;
};


export type QueryFragranceRequestArgs = {
  id: Scalars['ID']['input'];
};


export type QueryFragranceRequestsArgs = {
  input?: InputMaybe<RequestPaginationInput>;
};


export type QueryFragrancesArgs = {
  input?: InputMaybe<FragrancePaginationInput>;
};


export type QueryNoteArgs = {
  id: Scalars['ID']['input'];
};


export type QueryNoteEditArgs = {
  id: Scalars['ID']['input'];
};


export type QueryNoteEditsArgs = {
  input?: InputMaybe<NoteEditPaginationInput>;
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
  input?: InputMaybe<SearchInput>;
};


export type QuerySearchBrandsArgs = {
  input?: InputMaybe<SearchInput>;
};


export type QuerySearchFragrancesArgs = {
  input?: InputMaybe<SearchInput>;
};


export type QuerySearchNotesArgs = {
  input?: InputMaybe<SearchInput>;
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export type RequestPaginationInput = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<RequestSortInput>;
  status?: InputMaybe<RequestStatus>;
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

export type ReviewAccordEditInput = {
  editId: Scalars['ID']['input'];
  feedback?: InputMaybe<Scalars['String']['input']>;
  status: EditStatus;
};

export type ReviewBrandEditInput = {
  editId: Scalars['ID']['input'];
  feedback?: InputMaybe<Scalars['String']['input']>;
  status: EditStatus;
};

export type ReviewFragranceEditInput = {
  editId: Scalars['ID']['input'];
  feedback?: InputMaybe<Scalars['String']['input']>;
  status: EditStatus;
};

export type ReviewNoteEditInput = {
  editId: Scalars['ID']['input'];
  feedback?: InputMaybe<Scalars['String']['input']>;
  status: EditStatus;
};

export type SearchAccordConnection = {
  __typename?: 'SearchAccordConnection';
  edges: Array<SearchAccordEdge>;
  pageInfo: SearchPageInfo;
};

export type SearchAccordEdge = {
  __typename?: 'SearchAccordEdge';
  node: Accord;
  offset: Scalars['Int']['output'];
};

export type SearchBrandConnection = {
  __typename?: 'SearchBrandConnection';
  edges: Array<SearchBrandEdge>;
  pageInfo: SearchPageInfo;
};

export type SearchBrandEdge = {
  __typename?: 'SearchBrandEdge';
  node: Brand;
  offset: Scalars['Int']['output'];
};

export type SearchFragranceConnection = {
  __typename?: 'SearchFragranceConnection';
  edges: Array<SearchFragranceEdge>;
  pageInfo: SearchPageInfo;
};

export type SearchFragranceEdge = {
  __typename?: 'SearchFragranceEdge';
  node: Fragrance;
  offset: Scalars['Int']['output'];
};

export type SearchInput = {
  pagination?: InputMaybe<SearchPaginationInput>;
  term?: InputMaybe<Scalars['String']['input']>;
};

export type SearchNoteConnection = {
  __typename?: 'SearchNoteConnection';
  edges: Array<SearchNoteEdge>;
  pageInfo: SearchPageInfo;
};

export type SearchNoteEdge = {
  __typename?: 'SearchNoteEdge';
  node: Note;
  offset: Scalars['Int']['output'];
};

export type SearchPageInfo = {
  __typename?: 'SearchPageInfo';
  endOffset: Scalars['Int']['output'];
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  pageSize: Scalars['Int']['output'];
  startOffset: Scalars['Int']['output'];
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
};

export type SetFragranceRequestBrandInput = {
  brandId?: InputMaybe<Scalars['ID']['input']>;
  requestId: Scalars['ID']['input'];
};

export type SetFragranceRequestNotesInput = {
  layer: NoteLayer;
  noteIds: Array<Scalars['ID']['input']>;
  requestId: Scalars['ID']['input'];
};

export type SetFragranceRequestTraitInput = {
  requestId: Scalars['ID']['input'];
  score: Scalars['Int']['input'];
  traitType: TraitTypeEnum;
};

export type SetMyAvatarInput = {
  assetId: Scalars['ID']['input'];
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
  key: AssetKey;
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
  assetId?: InputMaybe<Scalars['ID']['input']>;
  color?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateBrandRequestInput = {
  assetId?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateFragranceRequestInput = {
  assetId?: InputMaybe<Scalars['ID']['input']>;
  concentration?: InputMaybe<Concentration>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  releaseYear?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<FragranceStatus>;
};

export type UpdateMeInput = {
  username?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateNoteRequestInput = {
  assetId?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  accordRequests: AccordRequestConnection;
  avatar?: Maybe<Asset>;
  brandRequests: BrandRequestConnection;
  email: Scalars['String']['output'];
  fragranceRequests: FragranceRequestConnection;
  id: Scalars['ID']['output'];
  noteRequests: NoteRequestConnection;
  username: Scalars['String']['output'];
};


export type UserAccordRequestsArgs = {
  input?: InputMaybe<RequestPaginationInput>;
};


export type UserBrandRequestsArgs = {
  input?: InputMaybe<RequestPaginationInput>;
};


export type UserFragranceRequestsArgs = {
  input?: InputMaybe<RequestPaginationInput>;
};


export type UserNoteRequestsArgs = {
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

export type VoteOnBrandInput = {
  brandId: Scalars['ID']['input'];
  vote: Scalars['Int']['input'];
};

export type VoteOnBrandRequestInput = {
  requestId: Scalars['ID']['input'];
  vote: Scalars['Int']['input'];
};

export type VoteOnFragranceAccordInput = {
  accordId: Scalars['ID']['input'];
  fragranceId: Scalars['ID']['input'];
  vote: Scalars['Int']['input'];
};

export type VoteOnFragranceInput = {
  fragranceId: Scalars['ID']['input'];
  vote: Scalars['Int']['input'];
};

export type VoteOnFragranceNoteInput = {
  fragranceId: Scalars['ID']['input'];
  layer: NoteLayer;
  noteId: Scalars['ID']['input'];
  vote: Scalars['Int']['input'];
};

export type VoteOnFragranceRequestInput = {
  requestId: Scalars['ID']['input'];
  vote: Scalars['Int']['input'];
};

export type VoteOnFragranceTraitInput = {
  fragranceId: Scalars['ID']['input'];
  traitOptionId: Scalars['ID']['input'];
  traitTypeId: Scalars['ID']['input'];
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
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

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

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
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
  AccordEdit: ResolverTypeWrapper<IAccordEditSummary>;
  AccordEditConnection: ResolverTypeWrapper<Partial<Omit<AccordEditConnection, 'edges'> & { edges: Array<ResolversTypes['AccordEditEdge']> }>>;
  AccordEditEdge: ResolverTypeWrapper<Partial<Omit<AccordEditEdge, 'node'> & { node: ResolversTypes['AccordEdit'] }>>;
  AccordEditPaginationInput: ResolverTypeWrapper<Partial<AccordEditPaginationInput>>;
  AccordEditSortBy: ResolverTypeWrapper<Partial<AccordEditSortBy>>;
  AccordEditSortInput: ResolverTypeWrapper<Partial<AccordEditSortInput>>;
  AccordPaginationInput: ResolverTypeWrapper<Partial<AccordPaginationInput>>;
  AccordRequest: ResolverTypeWrapper<IAccordRequestSummary>;
  AccordRequestConnection: ResolverTypeWrapper<Partial<Omit<AccordRequestConnection, 'edges'> & { edges: Array<ResolversTypes['AccordRequestEdge']> }>>;
  AccordRequestEdge: ResolverTypeWrapper<Partial<Omit<AccordRequestEdge, 'node'> & { node: ResolversTypes['AccordRequest'] }>>;
  AccordSortBy: ResolverTypeWrapper<Partial<AccordSortBy>>;
  AccordSortInput: ResolverTypeWrapper<Partial<AccordSortInput>>;
  Asset: ResolverTypeWrapper<IAssetResult>;
  AssetKey: ResolverTypeWrapper<Partial<AssetKey>>;
  AuthCodeDeliveryDetails: ResolverTypeWrapper<Partial<AuthCodeDeliveryDetails>>;
  AuthDeliveryResult: ResolverTypeWrapper<Partial<AuthDeliveryResult>>;
  AuthTokenPayload: ResolverTypeWrapper<Partial<AuthTokenPayload>>;
  AvatarStatus: ResolverTypeWrapper<Partial<AvatarStatus>>;
  Boolean: ResolverTypeWrapper<Partial<Scalars['Boolean']['output']>>;
  Brand: ResolverTypeWrapper<IBrandSummary>;
  BrandConnection: ResolverTypeWrapper<Partial<Omit<BrandConnection, 'edges'> & { edges: Array<ResolversTypes['BrandEdge']> }>>;
  BrandEdge: ResolverTypeWrapper<Partial<Omit<BrandEdge, 'node'> & { node: ResolversTypes['Brand'] }>>;
  BrandEdit: ResolverTypeWrapper<IBrandEditSummary>;
  BrandEditConnection: ResolverTypeWrapper<Partial<Omit<BrandEditConnection, 'edges'> & { edges: Array<ResolversTypes['BrandEditEdge']> }>>;
  BrandEditEdge: ResolverTypeWrapper<Partial<Omit<BrandEditEdge, 'node'> & { node: ResolversTypes['BrandEdit'] }>>;
  BrandEditPaginationInput: ResolverTypeWrapper<Partial<BrandEditPaginationInput>>;
  BrandEditSortBy: ResolverTypeWrapper<Partial<BrandEditSortBy>>;
  BrandEditSortInput: ResolverTypeWrapper<Partial<BrandEditSortInput>>;
  BrandPaginationInput: ResolverTypeWrapper<Partial<BrandPaginationInput>>;
  BrandRequest: ResolverTypeWrapper<IBrandRequestSummary>;
  BrandRequestConnection: ResolverTypeWrapper<Partial<Omit<BrandRequestConnection, 'edges'> & { edges: Array<ResolversTypes['BrandRequestEdge']> }>>;
  BrandRequestEdge: ResolverTypeWrapper<Partial<Omit<BrandRequestEdge, 'node'> & { node: ResolversTypes['BrandRequest'] }>>;
  BrandSortBy: ResolverTypeWrapper<Partial<BrandSortBy>>;
  BrandSortInput: ResolverTypeWrapper<Partial<BrandSortInput>>;
  Concentration: ResolverTypeWrapper<Partial<Concentration>>;
  ConfirmForgotPasswordInput: ResolverTypeWrapper<Partial<ConfirmForgotPasswordInput>>;
  ConfirmSignUpInput: ResolverTypeWrapper<Partial<ConfirmSignUpInput>>;
  CreateAccordEditInput: ResolverTypeWrapper<Partial<CreateAccordEditInput>>;
  CreateAccordRequestInput: ResolverTypeWrapper<Partial<CreateAccordRequestInput>>;
  CreateBrandEditInput: ResolverTypeWrapper<Partial<CreateBrandEditInput>>;
  CreateBrandRequestInput: ResolverTypeWrapper<Partial<CreateBrandRequestInput>>;
  CreateFragranceEditInput: ResolverTypeWrapper<Partial<CreateFragranceEditInput>>;
  CreateFragranceRequestInput: ResolverTypeWrapper<Partial<CreateFragranceRequestInput>>;
  CreateNoteEditInput: ResolverTypeWrapper<Partial<CreateNoteEditInput>>;
  CreateNoteRequestInput: ResolverTypeWrapper<Partial<CreateNoteRequestInput>>;
  Date: ResolverTypeWrapper<Partial<Scalars['Date']['output']>>;
  DeleteAccordRequestInput: ResolverTypeWrapper<Partial<DeleteAccordRequestInput>>;
  DeleteAssetInput: ResolverTypeWrapper<Partial<DeleteAssetInput>>;
  DeleteBrandRequestInput: ResolverTypeWrapper<Partial<DeleteBrandRequestInput>>;
  DeleteFragranceRequestInput: ResolverTypeWrapper<Partial<DeleteFragranceRequestInput>>;
  DeleteNoteRequestInput: ResolverTypeWrapper<Partial<DeleteNoteRequestInput>>;
  EditJob: ResolverTypeWrapper<Partial<EditJob>>;
  EditJobStatus: ResolverTypeWrapper<Partial<EditJobStatus>>;
  EditStatus: ResolverTypeWrapper<Partial<EditStatus>>;
  Float: ResolverTypeWrapper<Partial<Scalars['Float']['output']>>;
  ForgotPasswordInput: ResolverTypeWrapper<Partial<ForgotPasswordInput>>;
  Fragrance: ResolverTypeWrapper<IFragranceSummary>;
  FragranceAccord: ResolverTypeWrapper<Partial<FragranceAccord>>;
  FragranceAccordConnection: ResolverTypeWrapper<Partial<FragranceAccordConnection>>;
  FragranceAccordEdge: ResolverTypeWrapper<Partial<FragranceAccordEdge>>;
  FragranceAccordPaginationInput: ResolverTypeWrapper<Partial<FragranceAccordPaginationInput>>;
  FragranceAccordSortBy: ResolverTypeWrapper<Partial<FragranceAccordSortBy>>;
  FragranceAccordSortInput: ResolverTypeWrapper<Partial<FragranceAccordSortInput>>;
  FragranceConnection: ResolverTypeWrapper<Partial<Omit<FragranceConnection, 'edges'> & { edges: Array<ResolversTypes['FragranceEdge']> }>>;
  FragranceEdge: ResolverTypeWrapper<Partial<Omit<FragranceEdge, 'node'> & { node: ResolversTypes['Fragrance'] }>>;
  FragranceEdit: ResolverTypeWrapper<IFragranceEditSummary>;
  FragranceEditConnection: ResolverTypeWrapper<Partial<Omit<FragranceEditConnection, 'edges'> & { edges: Array<ResolversTypes['FragranceEditEdge']> }>>;
  FragranceEditEdge: ResolverTypeWrapper<Partial<Omit<FragranceEditEdge, 'node'> & { node: ResolversTypes['FragranceEdit'] }>>;
  FragranceEditPaginationInput: ResolverTypeWrapper<Partial<FragranceEditPaginationInput>>;
  FragranceEditSortBy: ResolverTypeWrapper<Partial<FragranceEditSortBy>>;
  FragranceEditSortInput: ResolverTypeWrapper<Partial<FragranceEditSortInput>>;
  FragranceImage: ResolverTypeWrapper<Partial<FragranceImage>>;
  FragranceImageConnection: ResolverTypeWrapper<Partial<FragranceImageConnection>>;
  FragranceImageEdge: ResolverTypeWrapper<Partial<FragranceImageEdge>>;
  FragranceNote: ResolverTypeWrapper<Partial<Omit<FragranceNote, 'note'> & { note: ResolversTypes['Note'] }>>;
  FragranceNoteConnection: ResolverTypeWrapper<Partial<Omit<FragranceNoteConnection, 'edges'> & { edges: Array<ResolversTypes['FragranceNoteEdge']> }>>;
  FragranceNoteEdge: ResolverTypeWrapper<Partial<Omit<FragranceNoteEdge, 'node'> & { node: ResolversTypes['FragranceNote'] }>>;
  FragranceNotePaginationInput: ResolverTypeWrapper<Partial<FragranceNotePaginationInput>>;
  FragranceNoteSortBy: ResolverTypeWrapper<Partial<FragranceNoteSortBy>>;
  FragranceNoteSortInput: ResolverTypeWrapper<Partial<FragranceNoteSortInput>>;
  FragrancePaginationInput: ResolverTypeWrapper<Partial<FragrancePaginationInput>>;
  FragranceRequest: ResolverTypeWrapper<IFragranceRequestSummary>;
  FragranceRequestConnection: ResolverTypeWrapper<Partial<Omit<FragranceRequestConnection, 'edges'> & { edges: Array<ResolversTypes['FragranceRequestEdge']> }>>;
  FragranceRequestEdge: ResolverTypeWrapper<Partial<Omit<FragranceRequestEdge, 'node'> & { node: ResolversTypes['FragranceRequest'] }>>;
  FragranceRequestNote: ResolverTypeWrapper<Partial<Omit<FragranceRequestNote, 'note'> & { note: ResolversTypes['Note'] }>>;
  FragranceRequestTrait: ResolverTypeWrapper<Partial<FragranceRequestTrait>>;
  FragranceSortBy: ResolverTypeWrapper<Partial<FragranceSortBy>>;
  FragranceSortInput: ResolverTypeWrapper<Partial<FragranceSortInput>>;
  FragranceStatus: ResolverTypeWrapper<Partial<FragranceStatus>>;
  FragranceTrait: ResolverTypeWrapper<Partial<FragranceTrait>>;
  FragranceTraitInput: ResolverTypeWrapper<Partial<FragranceTraitInput>>;
  ID: ResolverTypeWrapper<Partial<Scalars['ID']['output']>>;
  Int: ResolverTypeWrapper<Partial<Scalars['Int']['output']>>;
  JSON: ResolverTypeWrapper<Partial<Scalars['JSON']['output']>>;
  LogInInput: ResolverTypeWrapper<Partial<LogInInput>>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Note: ResolverTypeWrapper<INoteSummary>;
  NoteConnection: ResolverTypeWrapper<Partial<Omit<NoteConnection, 'edges'> & { edges: Array<ResolversTypes['NoteEdge']> }>>;
  NoteEdge: ResolverTypeWrapper<Partial<Omit<NoteEdge, 'node'> & { node: ResolversTypes['Note'] }>>;
  NoteEdit: ResolverTypeWrapper<INoteEditSummary>;
  NoteEditConnection: ResolverTypeWrapper<Partial<Omit<NoteEditConnection, 'edges'> & { edges: Array<ResolversTypes['NoteEditEdge']> }>>;
  NoteEditEdge: ResolverTypeWrapper<Partial<Omit<NoteEditEdge, 'node'> & { node: ResolversTypes['NoteEdit'] }>>;
  NoteEditPaginationInput: ResolverTypeWrapper<Partial<NoteEditPaginationInput>>;
  NoteEditSortBy: ResolverTypeWrapper<Partial<NoteEditSortBy>>;
  NoteEditSortInput: ResolverTypeWrapper<Partial<NoteEditSortInput>>;
  NoteLayer: ResolverTypeWrapper<Partial<NoteLayer>>;
  NotePaginationInput: ResolverTypeWrapper<Partial<NotePaginationInput>>;
  NoteRequest: ResolverTypeWrapper<INoteRequestSummary>;
  NoteRequestConnection: ResolverTypeWrapper<Partial<Omit<NoteRequestConnection, 'edges'> & { edges: Array<ResolversTypes['NoteRequestEdge']> }>>;
  NoteRequestEdge: ResolverTypeWrapper<Partial<Omit<NoteRequestEdge, 'node'> & { node: ResolversTypes['NoteRequest'] }>>;
  NoteSortBy: ResolverTypeWrapper<Partial<NoteSortBy>>;
  NoteSortInput: ResolverTypeWrapper<Partial<NoteSortInput>>;
  PageInfo: ResolverTypeWrapper<Partial<PageInfo>>;
  PresignedUpload: ResolverTypeWrapper<Partial<PresignedUpload>>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  RequestPaginationInput: ResolverTypeWrapper<Partial<RequestPaginationInput>>;
  RequestSortBy: ResolverTypeWrapper<Partial<RequestSortBy>>;
  RequestSortInput: ResolverTypeWrapper<Partial<RequestSortInput>>;
  RequestStatus: ResolverTypeWrapper<Partial<RequestStatus>>;
  ResendSignUpCodeInput: ResolverTypeWrapper<Partial<ResendSignUpCodeInput>>;
  ReviewAccordEditInput: ResolverTypeWrapper<Partial<ReviewAccordEditInput>>;
  ReviewBrandEditInput: ResolverTypeWrapper<Partial<ReviewBrandEditInput>>;
  ReviewFragranceEditInput: ResolverTypeWrapper<Partial<ReviewFragranceEditInput>>;
  ReviewNoteEditInput: ResolverTypeWrapper<Partial<ReviewNoteEditInput>>;
  SearchAccordConnection: ResolverTypeWrapper<Partial<SearchAccordConnection>>;
  SearchAccordEdge: ResolverTypeWrapper<Partial<SearchAccordEdge>>;
  SearchBrandConnection: ResolverTypeWrapper<Partial<Omit<SearchBrandConnection, 'edges'> & { edges: Array<ResolversTypes['SearchBrandEdge']> }>>;
  SearchBrandEdge: ResolverTypeWrapper<Partial<Omit<SearchBrandEdge, 'node'> & { node: ResolversTypes['Brand'] }>>;
  SearchFragranceConnection: ResolverTypeWrapper<Partial<Omit<SearchFragranceConnection, 'edges'> & { edges: Array<ResolversTypes['SearchFragranceEdge']> }>>;
  SearchFragranceEdge: ResolverTypeWrapper<Partial<Omit<SearchFragranceEdge, 'node'> & { node: ResolversTypes['Fragrance'] }>>;
  SearchInput: ResolverTypeWrapper<Partial<SearchInput>>;
  SearchNoteConnection: ResolverTypeWrapper<Partial<Omit<SearchNoteConnection, 'edges'> & { edges: Array<ResolversTypes['SearchNoteEdge']> }>>;
  SearchNoteEdge: ResolverTypeWrapper<Partial<Omit<SearchNoteEdge, 'node'> & { node: ResolversTypes['Note'] }>>;
  SearchPageInfo: ResolverTypeWrapper<Partial<SearchPageInfo>>;
  SearchPaginationInput: ResolverTypeWrapper<Partial<SearchPaginationInput>>;
  SearchSortBy: ResolverTypeWrapper<Partial<SearchSortBy>>;
  SearchSortInput: ResolverTypeWrapper<Partial<SearchSortInput>>;
  SetFragranceRequestAccordsInput: ResolverTypeWrapper<Partial<SetFragranceRequestAccordsInput>>;
  SetFragranceRequestBrandInput: ResolverTypeWrapper<Partial<SetFragranceRequestBrandInput>>;
  SetFragranceRequestNotesInput: ResolverTypeWrapper<Partial<SetFragranceRequestNotesInput>>;
  SetFragranceRequestTraitInput: ResolverTypeWrapper<Partial<SetFragranceRequestTraitInput>>;
  SetMyAvatarInput: ResolverTypeWrapper<Partial<SetMyAvatarInput>>;
  SignUpInput: ResolverTypeWrapper<Partial<SignUpInput>>;
  SortDirection: ResolverTypeWrapper<Partial<SortDirection>>;
  StageAssetInput: ResolverTypeWrapper<Partial<StageAssetInput>>;
  String: ResolverTypeWrapper<Partial<Scalars['String']['output']>>;
  SubmitAccordRequestInput: ResolverTypeWrapper<Partial<SubmitAccordRequestInput>>;
  SubmitBrandRequestInput: ResolverTypeWrapper<Partial<SubmitBrandRequestInput>>;
  SubmitFragranceRequestInput: ResolverTypeWrapper<Partial<SubmitFragranceRequestInput>>;
  SubmitNoteRequestInput: ResolverTypeWrapper<Partial<SubmitNoteRequestInput>>;
  TraitOption: ResolverTypeWrapper<Partial<TraitOption>>;
  TraitStats: ResolverTypeWrapper<Partial<TraitStats>>;
  TraitTypeEnum: ResolverTypeWrapper<Partial<TraitTypeEnum>>;
  TraitVote: ResolverTypeWrapper<Partial<TraitVote>>;
  TraitVoteDistribution: ResolverTypeWrapper<Partial<TraitVoteDistribution>>;
  UpdateAccordRequestInput: ResolverTypeWrapper<Partial<UpdateAccordRequestInput>>;
  UpdateBrandRequestInput: ResolverTypeWrapper<Partial<UpdateBrandRequestInput>>;
  UpdateFragranceRequestInput: ResolverTypeWrapper<Partial<UpdateFragranceRequestInput>>;
  UpdateMeInput: ResolverTypeWrapper<Partial<UpdateMeInput>>;
  UpdateNoteRequestInput: ResolverTypeWrapper<Partial<UpdateNoteRequestInput>>;
  User: ResolverTypeWrapper<IUserSummary>;
  VoteInfo: ResolverTypeWrapper<Partial<VoteInfo>>;
  VoteOnAccordRequestInput: ResolverTypeWrapper<Partial<VoteOnAccordRequestInput>>;
  VoteOnBrandInput: ResolverTypeWrapper<Partial<VoteOnBrandInput>>;
  VoteOnBrandRequestInput: ResolverTypeWrapper<Partial<VoteOnBrandRequestInput>>;
  VoteOnFragranceAccordInput: ResolverTypeWrapper<Partial<VoteOnFragranceAccordInput>>;
  VoteOnFragranceInput: ResolverTypeWrapper<Partial<VoteOnFragranceInput>>;
  VoteOnFragranceNoteInput: ResolverTypeWrapper<Partial<VoteOnFragranceNoteInput>>;
  VoteOnFragranceRequestInput: ResolverTypeWrapper<Partial<VoteOnFragranceRequestInput>>;
  VoteOnFragranceTraitInput: ResolverTypeWrapper<Partial<VoteOnFragranceTraitInput>>;
  VoteOnNoteRequestInput: ResolverTypeWrapper<Partial<VoteOnNoteRequestInput>>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Accord: Partial<Accord>;
  AccordConnection: Partial<AccordConnection>;
  AccordEdge: Partial<AccordEdge>;
  AccordEdit: IAccordEditSummary;
  AccordEditConnection: Partial<Omit<AccordEditConnection, 'edges'> & { edges: Array<ResolversParentTypes['AccordEditEdge']> }>;
  AccordEditEdge: Partial<Omit<AccordEditEdge, 'node'> & { node: ResolversParentTypes['AccordEdit'] }>;
  AccordEditPaginationInput: Partial<AccordEditPaginationInput>;
  AccordEditSortInput: Partial<AccordEditSortInput>;
  AccordPaginationInput: Partial<AccordPaginationInput>;
  AccordRequest: IAccordRequestSummary;
  AccordRequestConnection: Partial<Omit<AccordRequestConnection, 'edges'> & { edges: Array<ResolversParentTypes['AccordRequestEdge']> }>;
  AccordRequestEdge: Partial<Omit<AccordRequestEdge, 'node'> & { node: ResolversParentTypes['AccordRequest'] }>;
  AccordSortInput: Partial<AccordSortInput>;
  Asset: IAssetResult;
  AuthCodeDeliveryDetails: Partial<AuthCodeDeliveryDetails>;
  AuthDeliveryResult: Partial<AuthDeliveryResult>;
  AuthTokenPayload: Partial<AuthTokenPayload>;
  Boolean: Partial<Scalars['Boolean']['output']>;
  Brand: IBrandSummary;
  BrandConnection: Partial<Omit<BrandConnection, 'edges'> & { edges: Array<ResolversParentTypes['BrandEdge']> }>;
  BrandEdge: Partial<Omit<BrandEdge, 'node'> & { node: ResolversParentTypes['Brand'] }>;
  BrandEdit: IBrandEditSummary;
  BrandEditConnection: Partial<Omit<BrandEditConnection, 'edges'> & { edges: Array<ResolversParentTypes['BrandEditEdge']> }>;
  BrandEditEdge: Partial<Omit<BrandEditEdge, 'node'> & { node: ResolversParentTypes['BrandEdit'] }>;
  BrandEditPaginationInput: Partial<BrandEditPaginationInput>;
  BrandEditSortInput: Partial<BrandEditSortInput>;
  BrandPaginationInput: Partial<BrandPaginationInput>;
  BrandRequest: IBrandRequestSummary;
  BrandRequestConnection: Partial<Omit<BrandRequestConnection, 'edges'> & { edges: Array<ResolversParentTypes['BrandRequestEdge']> }>;
  BrandRequestEdge: Partial<Omit<BrandRequestEdge, 'node'> & { node: ResolversParentTypes['BrandRequest'] }>;
  BrandSortInput: Partial<BrandSortInput>;
  ConfirmForgotPasswordInput: Partial<ConfirmForgotPasswordInput>;
  ConfirmSignUpInput: Partial<ConfirmSignUpInput>;
  CreateAccordEditInput: Partial<CreateAccordEditInput>;
  CreateAccordRequestInput: Partial<CreateAccordRequestInput>;
  CreateBrandEditInput: Partial<CreateBrandEditInput>;
  CreateBrandRequestInput: Partial<CreateBrandRequestInput>;
  CreateFragranceEditInput: Partial<CreateFragranceEditInput>;
  CreateFragranceRequestInput: Partial<CreateFragranceRequestInput>;
  CreateNoteEditInput: Partial<CreateNoteEditInput>;
  CreateNoteRequestInput: Partial<CreateNoteRequestInput>;
  Date: Partial<Scalars['Date']['output']>;
  DeleteAccordRequestInput: Partial<DeleteAccordRequestInput>;
  DeleteAssetInput: Partial<DeleteAssetInput>;
  DeleteBrandRequestInput: Partial<DeleteBrandRequestInput>;
  DeleteFragranceRequestInput: Partial<DeleteFragranceRequestInput>;
  DeleteNoteRequestInput: Partial<DeleteNoteRequestInput>;
  EditJob: Partial<EditJob>;
  Float: Partial<Scalars['Float']['output']>;
  ForgotPasswordInput: Partial<ForgotPasswordInput>;
  Fragrance: IFragranceSummary;
  FragranceAccord: Partial<FragranceAccord>;
  FragranceAccordConnection: Partial<FragranceAccordConnection>;
  FragranceAccordEdge: Partial<FragranceAccordEdge>;
  FragranceAccordPaginationInput: Partial<FragranceAccordPaginationInput>;
  FragranceAccordSortInput: Partial<FragranceAccordSortInput>;
  FragranceConnection: Partial<Omit<FragranceConnection, 'edges'> & { edges: Array<ResolversParentTypes['FragranceEdge']> }>;
  FragranceEdge: Partial<Omit<FragranceEdge, 'node'> & { node: ResolversParentTypes['Fragrance'] }>;
  FragranceEdit: IFragranceEditSummary;
  FragranceEditConnection: Partial<Omit<FragranceEditConnection, 'edges'> & { edges: Array<ResolversParentTypes['FragranceEditEdge']> }>;
  FragranceEditEdge: Partial<Omit<FragranceEditEdge, 'node'> & { node: ResolversParentTypes['FragranceEdit'] }>;
  FragranceEditPaginationInput: Partial<FragranceEditPaginationInput>;
  FragranceEditSortInput: Partial<FragranceEditSortInput>;
  FragranceImage: Partial<FragranceImage>;
  FragranceImageConnection: Partial<FragranceImageConnection>;
  FragranceImageEdge: Partial<FragranceImageEdge>;
  FragranceNote: Partial<Omit<FragranceNote, 'note'> & { note: ResolversParentTypes['Note'] }>;
  FragranceNoteConnection: Partial<Omit<FragranceNoteConnection, 'edges'> & { edges: Array<ResolversParentTypes['FragranceNoteEdge']> }>;
  FragranceNoteEdge: Partial<Omit<FragranceNoteEdge, 'node'> & { node: ResolversParentTypes['FragranceNote'] }>;
  FragranceNotePaginationInput: Partial<FragranceNotePaginationInput>;
  FragranceNoteSortInput: Partial<FragranceNoteSortInput>;
  FragrancePaginationInput: Partial<FragrancePaginationInput>;
  FragranceRequest: IFragranceRequestSummary;
  FragranceRequestConnection: Partial<Omit<FragranceRequestConnection, 'edges'> & { edges: Array<ResolversParentTypes['FragranceRequestEdge']> }>;
  FragranceRequestEdge: Partial<Omit<FragranceRequestEdge, 'node'> & { node: ResolversParentTypes['FragranceRequest'] }>;
  FragranceRequestNote: Partial<Omit<FragranceRequestNote, 'note'> & { note: ResolversParentTypes['Note'] }>;
  FragranceRequestTrait: Partial<FragranceRequestTrait>;
  FragranceSortInput: Partial<FragranceSortInput>;
  FragranceTrait: Partial<FragranceTrait>;
  FragranceTraitInput: Partial<FragranceTraitInput>;
  ID: Partial<Scalars['ID']['output']>;
  Int: Partial<Scalars['Int']['output']>;
  JSON: Partial<Scalars['JSON']['output']>;
  LogInInput: Partial<LogInInput>;
  Mutation: Record<PropertyKey, never>;
  Note: INoteSummary;
  NoteConnection: Partial<Omit<NoteConnection, 'edges'> & { edges: Array<ResolversParentTypes['NoteEdge']> }>;
  NoteEdge: Partial<Omit<NoteEdge, 'node'> & { node: ResolversParentTypes['Note'] }>;
  NoteEdit: INoteEditSummary;
  NoteEditConnection: Partial<Omit<NoteEditConnection, 'edges'> & { edges: Array<ResolversParentTypes['NoteEditEdge']> }>;
  NoteEditEdge: Partial<Omit<NoteEditEdge, 'node'> & { node: ResolversParentTypes['NoteEdit'] }>;
  NoteEditPaginationInput: Partial<NoteEditPaginationInput>;
  NoteEditSortInput: Partial<NoteEditSortInput>;
  NotePaginationInput: Partial<NotePaginationInput>;
  NoteRequest: INoteRequestSummary;
  NoteRequestConnection: Partial<Omit<NoteRequestConnection, 'edges'> & { edges: Array<ResolversParentTypes['NoteRequestEdge']> }>;
  NoteRequestEdge: Partial<Omit<NoteRequestEdge, 'node'> & { node: ResolversParentTypes['NoteRequest'] }>;
  NoteSortInput: Partial<NoteSortInput>;
  PageInfo: Partial<PageInfo>;
  PresignedUpload: Partial<PresignedUpload>;
  Query: Record<PropertyKey, never>;
  RequestPaginationInput: Partial<RequestPaginationInput>;
  RequestSortInput: Partial<RequestSortInput>;
  ResendSignUpCodeInput: Partial<ResendSignUpCodeInput>;
  ReviewAccordEditInput: Partial<ReviewAccordEditInput>;
  ReviewBrandEditInput: Partial<ReviewBrandEditInput>;
  ReviewFragranceEditInput: Partial<ReviewFragranceEditInput>;
  ReviewNoteEditInput: Partial<ReviewNoteEditInput>;
  SearchAccordConnection: Partial<SearchAccordConnection>;
  SearchAccordEdge: Partial<SearchAccordEdge>;
  SearchBrandConnection: Partial<Omit<SearchBrandConnection, 'edges'> & { edges: Array<ResolversParentTypes['SearchBrandEdge']> }>;
  SearchBrandEdge: Partial<Omit<SearchBrandEdge, 'node'> & { node: ResolversParentTypes['Brand'] }>;
  SearchFragranceConnection: Partial<Omit<SearchFragranceConnection, 'edges'> & { edges: Array<ResolversParentTypes['SearchFragranceEdge']> }>;
  SearchFragranceEdge: Partial<Omit<SearchFragranceEdge, 'node'> & { node: ResolversParentTypes['Fragrance'] }>;
  SearchInput: Partial<SearchInput>;
  SearchNoteConnection: Partial<Omit<SearchNoteConnection, 'edges'> & { edges: Array<ResolversParentTypes['SearchNoteEdge']> }>;
  SearchNoteEdge: Partial<Omit<SearchNoteEdge, 'node'> & { node: ResolversParentTypes['Note'] }>;
  SearchPageInfo: Partial<SearchPageInfo>;
  SearchPaginationInput: Partial<SearchPaginationInput>;
  SearchSortInput: Partial<SearchSortInput>;
  SetFragranceRequestAccordsInput: Partial<SetFragranceRequestAccordsInput>;
  SetFragranceRequestBrandInput: Partial<SetFragranceRequestBrandInput>;
  SetFragranceRequestNotesInput: Partial<SetFragranceRequestNotesInput>;
  SetFragranceRequestTraitInput: Partial<SetFragranceRequestTraitInput>;
  SetMyAvatarInput: Partial<SetMyAvatarInput>;
  SignUpInput: Partial<SignUpInput>;
  StageAssetInput: Partial<StageAssetInput>;
  String: Partial<Scalars['String']['output']>;
  SubmitAccordRequestInput: Partial<SubmitAccordRequestInput>;
  SubmitBrandRequestInput: Partial<SubmitBrandRequestInput>;
  SubmitFragranceRequestInput: Partial<SubmitFragranceRequestInput>;
  SubmitNoteRequestInput: Partial<SubmitNoteRequestInput>;
  TraitOption: Partial<TraitOption>;
  TraitStats: Partial<TraitStats>;
  TraitVote: Partial<TraitVote>;
  TraitVoteDistribution: Partial<TraitVoteDistribution>;
  UpdateAccordRequestInput: Partial<UpdateAccordRequestInput>;
  UpdateBrandRequestInput: Partial<UpdateBrandRequestInput>;
  UpdateFragranceRequestInput: Partial<UpdateFragranceRequestInput>;
  UpdateMeInput: Partial<UpdateMeInput>;
  UpdateNoteRequestInput: Partial<UpdateNoteRequestInput>;
  User: IUserSummary;
  VoteInfo: Partial<VoteInfo>;
  VoteOnAccordRequestInput: Partial<VoteOnAccordRequestInput>;
  VoteOnBrandInput: Partial<VoteOnBrandInput>;
  VoteOnBrandRequestInput: Partial<VoteOnBrandRequestInput>;
  VoteOnFragranceAccordInput: Partial<VoteOnFragranceAccordInput>;
  VoteOnFragranceInput: Partial<VoteOnFragranceInput>;
  VoteOnFragranceNoteInput: Partial<VoteOnFragranceNoteInput>;
  VoteOnFragranceRequestInput: Partial<VoteOnFragranceRequestInput>;
  VoteOnFragranceTraitInput: Partial<VoteOnFragranceTraitInput>;
  VoteOnNoteRequestInput: Partial<VoteOnNoteRequestInput>;
}>;

export type AccordResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['Accord'] = ResolversParentTypes['Accord']> = ResolversObject<{
  color?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type AccordConnectionResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['AccordConnection'] = ResolversParentTypes['AccordConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['AccordEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
}>;

export type AccordEdgeResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['AccordEdge'] = ResolversParentTypes['AccordEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Accord'], ParentType, ContextType>;
}>;

export type AccordEditResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['AccordEdit'] = ResolversParentTypes['AccordEdit']> = ResolversObject<{
  accord?: Resolver<ResolversTypes['Accord'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  proposedColor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  proposedDescription?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  proposedName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  reviewer?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['EditStatus'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
}>;

export type AccordEditConnectionResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['AccordEditConnection'] = ResolversParentTypes['AccordEditConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['AccordEditEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
}>;

export type AccordEditEdgeResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['AccordEditEdge'] = ResolversParentTypes['AccordEditEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['AccordEdit'], ParentType, ContextType>;
}>;

export type AccordRequestResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['AccordRequest'] = ResolversParentTypes['AccordRequest']> = ResolversObject<{
  color?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  requestStatus?: Resolver<ResolversTypes['RequestStatus'], ParentType, ContextType>;
  thumbnail?: Resolver<Maybe<ResolversTypes['Asset']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  version?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  votes?: Resolver<ResolversTypes['VoteInfo'], ParentType, ContextType>;
}>;

export type AccordRequestConnectionResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['AccordRequestConnection'] = ResolversParentTypes['AccordRequestConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['AccordRequestEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
}>;

export type AccordRequestEdgeResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['AccordRequestEdge'] = ResolversParentTypes['AccordRequestEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['AccordRequest'], ParentType, ContextType>;
}>;

export type AssetResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['Asset'] = ResolversParentTypes['Asset']> = ResolversObject<{
  contentSize?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  contentType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  s3Key?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
}>;

export type AuthCodeDeliveryDetailsResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['AuthCodeDeliveryDetails'] = ResolversParentTypes['AuthCodeDeliveryDetails']> = ResolversObject<{
  attribute?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  destination?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  method?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
}>;

export type AuthDeliveryResultResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['AuthDeliveryResult'] = ResolversParentTypes['AuthDeliveryResult']> = ResolversObject<{
  delivery?: Resolver<Maybe<ResolversTypes['AuthCodeDeliveryDetails']>, ParentType, ContextType>;
  isComplete?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
}>;

export type AuthTokenPayloadResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['AuthTokenPayload'] = ResolversParentTypes['AuthTokenPayload']> = ResolversObject<{
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  expiresIn?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  idToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type BrandResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['Brand'] = ResolversParentTypes['Brand']> = ResolversObject<{
  avatar?: Resolver<Maybe<ResolversTypes['Asset']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  fragrances?: Resolver<ResolversTypes['FragranceConnection'], ParentType, ContextType, Partial<BrandFragrancesArgs>>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  votes?: Resolver<ResolversTypes['VoteInfo'], ParentType, ContextType>;
  website?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
}>;

export type BrandConnectionResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['BrandConnection'] = ResolversParentTypes['BrandConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['BrandEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
}>;

export type BrandEdgeResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['BrandEdge'] = ResolversParentTypes['BrandEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Brand'], ParentType, ContextType>;
}>;

export type BrandEditResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['BrandEdit'] = ResolversParentTypes['BrandEdit']> = ResolversObject<{
  brand?: Resolver<ResolversTypes['Brand'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  proposedAvatar?: Resolver<Maybe<ResolversTypes['Asset']>, ParentType, ContextType>;
  proposedDescription?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  proposedName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  proposedWebsite?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  reviewer?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['EditStatus'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
}>;

export type BrandEditConnectionResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['BrandEditConnection'] = ResolversParentTypes['BrandEditConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['BrandEditEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
}>;

export type BrandEditEdgeResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['BrandEditEdge'] = ResolversParentTypes['BrandEditEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['BrandEdit'], ParentType, ContextType>;
}>;

export type BrandRequestResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['BrandRequest'] = ResolversParentTypes['BrandRequest']> = ResolversObject<{
  avatar?: Resolver<Maybe<ResolversTypes['Asset']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  requestStatus?: Resolver<ResolversTypes['RequestStatus'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  version?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  votes?: Resolver<ResolversTypes['VoteInfo'], ParentType, ContextType>;
  website?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
}>;

export type BrandRequestConnectionResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['BrandRequestConnection'] = ResolversParentTypes['BrandRequestConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['BrandRequestEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
}>;

export type BrandRequestEdgeResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['BrandRequestEdge'] = ResolversParentTypes['BrandRequestEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['BrandRequest'], ParentType, ContextType>;
}>;

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type EditJobResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['EditJob'] = ResolversParentTypes['EditJob']> = ResolversObject<{
  error?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['EditJobStatus'], ParentType, ContextType>;
}>;

export type FragranceResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['Fragrance'] = ResolversParentTypes['Fragrance']> = ResolversObject<{
  accords?: Resolver<ResolversTypes['FragranceAccordConnection'], ParentType, ContextType, Partial<FragranceAccordsArgs>>;
  brand?: Resolver<ResolversTypes['Brand'], ParentType, ContextType>;
  concentration?: Resolver<ResolversTypes['Concentration'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  images?: Resolver<Array<ResolversTypes['FragranceImage']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  notes?: Resolver<ResolversTypes['FragranceNoteConnection'], ParentType, ContextType, Partial<FragranceNotesArgs>>;
  releaseYear?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['FragranceStatus'], ParentType, ContextType>;
  thumbnail?: Resolver<Maybe<ResolversTypes['FragranceImage']>, ParentType, ContextType>;
  traits?: Resolver<Array<ResolversTypes['FragranceTrait']>, ParentType, ContextType>;
  votes?: Resolver<ResolversTypes['VoteInfo'], ParentType, ContextType>;
}>;

export type FragranceAccordResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['FragranceAccord'] = ResolversParentTypes['FragranceAccord']> = ResolversObject<{
  accord?: Resolver<ResolversTypes['Accord'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  votes?: Resolver<ResolversTypes['VoteInfo'], ParentType, ContextType>;
}>;

export type FragranceAccordConnectionResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['FragranceAccordConnection'] = ResolversParentTypes['FragranceAccordConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['FragranceAccordEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
}>;

export type FragranceAccordEdgeResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['FragranceAccordEdge'] = ResolversParentTypes['FragranceAccordEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['FragranceAccord'], ParentType, ContextType>;
}>;

export type FragranceConnectionResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['FragranceConnection'] = ResolversParentTypes['FragranceConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['FragranceEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
}>;

export type FragranceEdgeResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['FragranceEdge'] = ResolversParentTypes['FragranceEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Fragrance'], ParentType, ContextType>;
}>;

export type FragranceEditResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['FragranceEdit'] = ResolversParentTypes['FragranceEdit']> = ResolversObject<{
  fragrance?: Resolver<ResolversTypes['Fragrance'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  proposedBrand?: Resolver<Maybe<ResolversTypes['Brand']>, ParentType, ContextType>;
  proposedConcentration?: Resolver<Maybe<ResolversTypes['Concentration']>, ParentType, ContextType>;
  proposedDescription?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  proposedImage?: Resolver<Maybe<ResolversTypes['Asset']>, ParentType, ContextType>;
  proposedName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  proposedReleaseYear?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  proposedStatus?: Resolver<Maybe<ResolversTypes['FragranceStatus']>, ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  reviewer?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['EditStatus'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
}>;

export type FragranceEditConnectionResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['FragranceEditConnection'] = ResolversParentTypes['FragranceEditConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['FragranceEditEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
}>;

export type FragranceEditEdgeResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['FragranceEditEdge'] = ResolversParentTypes['FragranceEditEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['FragranceEdit'], ParentType, ContextType>;
}>;

export type FragranceImageResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['FragranceImage'] = ResolversParentTypes['FragranceImage']> = ResolversObject<{
  height?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  primaryColor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  width?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type FragranceImageConnectionResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['FragranceImageConnection'] = ResolversParentTypes['FragranceImageConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['FragranceImageEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
}>;

export type FragranceImageEdgeResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['FragranceImageEdge'] = ResolversParentTypes['FragranceImageEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['FragranceImage'], ParentType, ContextType>;
}>;

export type FragranceNoteResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['FragranceNote'] = ResolversParentTypes['FragranceNote']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  layer?: Resolver<ResolversTypes['NoteLayer'], ParentType, ContextType>;
  note?: Resolver<ResolversTypes['Note'], ParentType, ContextType>;
  votes?: Resolver<ResolversTypes['VoteInfo'], ParentType, ContextType>;
}>;

export type FragranceNoteConnectionResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['FragranceNoteConnection'] = ResolversParentTypes['FragranceNoteConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['FragranceNoteEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
}>;

export type FragranceNoteEdgeResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['FragranceNoteEdge'] = ResolversParentTypes['FragranceNoteEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['FragranceNote'], ParentType, ContextType>;
}>;

export type FragranceRequestResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['FragranceRequest'] = ResolversParentTypes['FragranceRequest']> = ResolversObject<{
  accords?: Resolver<Array<ResolversTypes['Accord']>, ParentType, ContextType>;
  brand?: Resolver<Maybe<ResolversTypes['Brand']>, ParentType, ContextType>;
  concentration?: Resolver<Maybe<ResolversTypes['Concentration']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  fragranceStatus?: Resolver<Maybe<ResolversTypes['FragranceStatus']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['Asset']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  notes?: Resolver<Array<ResolversTypes['FragranceRequestNote']>, ParentType, ContextType, RequireFields<FragranceRequestNotesArgs, 'layer'>>;
  releaseYear?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  requestStatus?: Resolver<ResolversTypes['RequestStatus'], ParentType, ContextType>;
  trait?: Resolver<ResolversTypes['FragranceRequestTrait'], ParentType, ContextType, RequireFields<FragranceRequestTraitArgs, 'type'>>;
  traits?: Resolver<Array<ResolversTypes['FragranceRequestTrait']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  version?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  votes?: Resolver<ResolversTypes['VoteInfo'], ParentType, ContextType>;
}>;

export type FragranceRequestConnectionResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['FragranceRequestConnection'] = ResolversParentTypes['FragranceRequestConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['FragranceRequestEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
}>;

export type FragranceRequestEdgeResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['FragranceRequestEdge'] = ResolversParentTypes['FragranceRequestEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['FragranceRequest'], ParentType, ContextType>;
}>;

export type FragranceRequestNoteResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['FragranceRequestNote'] = ResolversParentTypes['FragranceRequestNote']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  layer?: Resolver<ResolversTypes['NoteLayer'], ParentType, ContextType>;
  note?: Resolver<ResolversTypes['Note'], ParentType, ContextType>;
}>;

export type FragranceRequestTraitResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['FragranceRequestTrait'] = ResolversParentTypes['FragranceRequestTrait']> = ResolversObject<{
  selectedOption?: Resolver<ResolversTypes['TraitOption'], ParentType, ContextType>;
  traitType?: Resolver<ResolversTypes['TraitTypeEnum'], ParentType, ContextType>;
}>;

export type FragranceTraitResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['FragranceTrait'] = ResolversParentTypes['FragranceTrait']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  myVote?: Resolver<Maybe<ResolversTypes['TraitVote']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  options?: Resolver<Array<ResolversTypes['TraitOption']>, ParentType, ContextType>;
  stats?: Resolver<Maybe<ResolversTypes['TraitStats']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['TraitTypeEnum'], ParentType, ContextType>;
}>;

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type MutationResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  confirmForgotPassword?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationConfirmForgotPasswordArgs, 'input'>>;
  confirmSignUp?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationConfirmSignUpArgs, 'input'>>;
  createAccordEdit?: Resolver<ResolversTypes['AccordEdit'], ParentType, ContextType, RequireFields<MutationCreateAccordEditArgs, 'input'>>;
  createAccordRequest?: Resolver<ResolversTypes['AccordRequest'], ParentType, ContextType, Partial<MutationCreateAccordRequestArgs>>;
  createBrandEdit?: Resolver<ResolversTypes['BrandEdit'], ParentType, ContextType, RequireFields<MutationCreateBrandEditArgs, 'input'>>;
  createBrandRequest?: Resolver<ResolversTypes['BrandRequest'], ParentType, ContextType, Partial<MutationCreateBrandRequestArgs>>;
  createFragranceEdit?: Resolver<ResolversTypes['FragranceEdit'], ParentType, ContextType, RequireFields<MutationCreateFragranceEditArgs, 'input'>>;
  createFragranceRequest?: Resolver<ResolversTypes['FragranceRequest'], ParentType, ContextType, Partial<MutationCreateFragranceRequestArgs>>;
  createNoteEdit?: Resolver<ResolversTypes['NoteEdit'], ParentType, ContextType, RequireFields<MutationCreateNoteEditArgs, 'input'>>;
  createNoteRequest?: Resolver<ResolversTypes['NoteRequest'], ParentType, ContextType, Partial<MutationCreateNoteRequestArgs>>;
  deleteAccordRequest?: Resolver<ResolversTypes['AccordRequest'], ParentType, ContextType, RequireFields<MutationDeleteAccordRequestArgs, 'input'>>;
  deleteAsset?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteAssetArgs, 'input'>>;
  deleteBrandRequest?: Resolver<ResolversTypes['BrandRequest'], ParentType, ContextType, RequireFields<MutationDeleteBrandRequestArgs, 'input'>>;
  deleteFragranceRequest?: Resolver<ResolversTypes['FragranceRequest'], ParentType, ContextType, RequireFields<MutationDeleteFragranceRequestArgs, 'input'>>;
  deleteNoteRequest?: Resolver<ResolversTypes['NoteRequest'], ParentType, ContextType, RequireFields<MutationDeleteNoteRequestArgs, 'input'>>;
  forgotPassword?: Resolver<ResolversTypes['AuthDeliveryResult'], ParentType, ContextType, RequireFields<MutationForgotPasswordArgs, 'input'>>;
  logIn?: Resolver<ResolversTypes['AuthTokenPayload'], ParentType, ContextType, RequireFields<MutationLogInArgs, 'input'>>;
  logOut?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  refresh?: Resolver<Maybe<ResolversTypes['AuthTokenPayload']>, ParentType, ContextType>;
  resendSignUpCode?: Resolver<ResolversTypes['AuthDeliveryResult'], ParentType, ContextType, RequireFields<MutationResendSignUpCodeArgs, 'input'>>;
  reviewAccordEdit?: Resolver<ResolversTypes['AccordEdit'], ParentType, ContextType, RequireFields<MutationReviewAccordEditArgs, 'input'>>;
  reviewBrandEdit?: Resolver<ResolversTypes['BrandEdit'], ParentType, ContextType, RequireFields<MutationReviewBrandEditArgs, 'input'>>;
  reviewFragranceEdit?: Resolver<ResolversTypes['FragranceEdit'], ParentType, ContextType, RequireFields<MutationReviewFragranceEditArgs, 'input'>>;
  reviewNoteEdit?: Resolver<ResolversTypes['NoteEdit'], ParentType, ContextType, RequireFields<MutationReviewNoteEditArgs, 'input'>>;
  setFragranceRequestAccords?: Resolver<ResolversTypes['FragranceRequest'], ParentType, ContextType, RequireFields<MutationSetFragranceRequestAccordsArgs, 'input'>>;
  setFragranceRequestBrand?: Resolver<ResolversTypes['FragranceRequest'], ParentType, ContextType, RequireFields<MutationSetFragranceRequestBrandArgs, 'input'>>;
  setFragranceRequestNotes?: Resolver<ResolversTypes['FragranceRequest'], ParentType, ContextType, RequireFields<MutationSetFragranceRequestNotesArgs, 'input'>>;
  setFragranceRequestTrait?: Resolver<ResolversTypes['FragranceRequest'], ParentType, ContextType, RequireFields<MutationSetFragranceRequestTraitArgs, 'input'>>;
  setMyAvatar?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationSetMyAvatarArgs, 'input'>>;
  signUp?: Resolver<ResolversTypes['AuthDeliveryResult'], ParentType, ContextType, RequireFields<MutationSignUpArgs, 'input'>>;
  stageAsset?: Resolver<ResolversTypes['PresignedUpload'], ParentType, ContextType, RequireFields<MutationStageAssetArgs, 'input'>>;
  submitAccordRequest?: Resolver<ResolversTypes['AccordRequest'], ParentType, ContextType, RequireFields<MutationSubmitAccordRequestArgs, 'input'>>;
  submitBrandRequest?: Resolver<ResolversTypes['BrandRequest'], ParentType, ContextType, RequireFields<MutationSubmitBrandRequestArgs, 'input'>>;
  submitFragranceRequest?: Resolver<ResolversTypes['FragranceRequest'], ParentType, ContextType, RequireFields<MutationSubmitFragranceRequestArgs, 'input'>>;
  submitNoteRequest?: Resolver<ResolversTypes['NoteRequest'], ParentType, ContextType, RequireFields<MutationSubmitNoteRequestArgs, 'input'>>;
  updateAccordRequest?: Resolver<ResolversTypes['AccordRequest'], ParentType, ContextType, RequireFields<MutationUpdateAccordRequestArgs, 'input'>>;
  updateBrandRequest?: Resolver<ResolversTypes['BrandRequest'], ParentType, ContextType, RequireFields<MutationUpdateBrandRequestArgs, 'input'>>;
  updateFragranceRequest?: Resolver<ResolversTypes['FragranceRequest'], ParentType, ContextType, RequireFields<MutationUpdateFragranceRequestArgs, 'input'>>;
  updateMe?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateMeArgs, 'input'>>;
  updateNoteRequest?: Resolver<ResolversTypes['NoteRequest'], ParentType, ContextType, RequireFields<MutationUpdateNoteRequestArgs, 'input'>>;
  voteOnAccordRequest?: Resolver<ResolversTypes['AccordRequest'], ParentType, ContextType, RequireFields<MutationVoteOnAccordRequestArgs, 'input'>>;
  voteOnBrand?: Resolver<ResolversTypes['Brand'], ParentType, ContextType, RequireFields<MutationVoteOnBrandArgs, 'input'>>;
  voteOnBrandRequest?: Resolver<ResolversTypes['BrandRequest'], ParentType, ContextType, RequireFields<MutationVoteOnBrandRequestArgs, 'input'>>;
  voteOnFragrance?: Resolver<ResolversTypes['Fragrance'], ParentType, ContextType, RequireFields<MutationVoteOnFragranceArgs, 'input'>>;
  voteOnFragranceAccord?: Resolver<ResolversTypes['Accord'], ParentType, ContextType, RequireFields<MutationVoteOnFragranceAccordArgs, 'input'>>;
  voteOnFragranceNote?: Resolver<ResolversTypes['Note'], ParentType, ContextType, RequireFields<MutationVoteOnFragranceNoteArgs, 'input'>>;
  voteOnFragranceRequest?: Resolver<ResolversTypes['FragranceRequest'], ParentType, ContextType, RequireFields<MutationVoteOnFragranceRequestArgs, 'input'>>;
  voteOnFragranceTrait?: Resolver<Maybe<ResolversTypes['TraitVote']>, ParentType, ContextType, RequireFields<MutationVoteOnFragranceTraitArgs, 'input'>>;
  voteOnNoteRequest?: Resolver<ResolversTypes['NoteRequest'], ParentType, ContextType, RequireFields<MutationVoteOnNoteRequestArgs, 'input'>>;
}>;

export type NoteResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['Note'] = ResolversParentTypes['Note']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  thumbnail?: Resolver<Maybe<ResolversTypes['Asset']>, ParentType, ContextType>;
}>;

export type NoteConnectionResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['NoteConnection'] = ResolversParentTypes['NoteConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['NoteEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
}>;

export type NoteEdgeResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['NoteEdge'] = ResolversParentTypes['NoteEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Note'], ParentType, ContextType>;
}>;

export type NoteEditResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['NoteEdit'] = ResolversParentTypes['NoteEdit']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  note?: Resolver<ResolversTypes['Note'], ParentType, ContextType>;
  proposedDescription?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  proposedName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  proposedThumbnail?: Resolver<Maybe<ResolversTypes['Asset']>, ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  reviewer?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['EditStatus'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
}>;

export type NoteEditConnectionResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['NoteEditConnection'] = ResolversParentTypes['NoteEditConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['NoteEditEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
}>;

export type NoteEditEdgeResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['NoteEditEdge'] = ResolversParentTypes['NoteEditEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['NoteEdit'], ParentType, ContextType>;
}>;

export type NoteRequestResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['NoteRequest'] = ResolversParentTypes['NoteRequest']> = ResolversObject<{
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  requestStatus?: Resolver<ResolversTypes['RequestStatus'], ParentType, ContextType>;
  thumbnail?: Resolver<Maybe<ResolversTypes['Asset']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  version?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  votes?: Resolver<ResolversTypes['VoteInfo'], ParentType, ContextType>;
}>;

export type NoteRequestConnectionResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['NoteRequestConnection'] = ResolversParentTypes['NoteRequestConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['NoteRequestEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
}>;

export type NoteRequestEdgeResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['NoteRequestEdge'] = ResolversParentTypes['NoteRequestEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['NoteRequest'], ParentType, ContextType>;
}>;

export type PageInfoResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = ResolversObject<{
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  startCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
}>;

export type PresignedUploadResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['PresignedUpload'] = ResolversParentTypes['PresignedUpload']> = ResolversObject<{
  assetId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  fields?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  accord?: Resolver<ResolversTypes['Accord'], ParentType, ContextType, RequireFields<QueryAccordArgs, 'id'>>;
  accordEdit?: Resolver<ResolversTypes['AccordEdit'], ParentType, ContextType, RequireFields<QueryAccordEditArgs, 'id'>>;
  accordEdits?: Resolver<ResolversTypes['AccordEditConnection'], ParentType, ContextType, Partial<QueryAccordEditsArgs>>;
  accordRequest?: Resolver<ResolversTypes['AccordRequest'], ParentType, ContextType, RequireFields<QueryAccordRequestArgs, 'id'>>;
  accordRequests?: Resolver<ResolversTypes['AccordRequestConnection'], ParentType, ContextType, Partial<QueryAccordRequestsArgs>>;
  accords?: Resolver<ResolversTypes['AccordConnection'], ParentType, ContextType, Partial<QueryAccordsArgs>>;
  brand?: Resolver<Maybe<ResolversTypes['Brand']>, ParentType, ContextType, RequireFields<QueryBrandArgs, 'id'>>;
  brandEdit?: Resolver<ResolversTypes['BrandEdit'], ParentType, ContextType, RequireFields<QueryBrandEditArgs, 'id'>>;
  brandEdits?: Resolver<ResolversTypes['BrandEditConnection'], ParentType, ContextType, Partial<QueryBrandEditsArgs>>;
  brandRequest?: Resolver<ResolversTypes['BrandRequest'], ParentType, ContextType, RequireFields<QueryBrandRequestArgs, 'id'>>;
  brandRequests?: Resolver<ResolversTypes['BrandRequestConnection'], ParentType, ContextType, Partial<QueryBrandRequestsArgs>>;
  brands?: Resolver<ResolversTypes['BrandConnection'], ParentType, ContextType, Partial<QueryBrandsArgs>>;
  fragrance?: Resolver<ResolversTypes['Fragrance'], ParentType, ContextType, RequireFields<QueryFragranceArgs, 'id'>>;
  fragranceEdit?: Resolver<ResolversTypes['FragranceEdit'], ParentType, ContextType, RequireFields<QueryFragranceEditArgs, 'id'>>;
  fragranceEdits?: Resolver<ResolversTypes['FragranceEditConnection'], ParentType, ContextType, Partial<QueryFragranceEditsArgs>>;
  fragranceRequest?: Resolver<ResolversTypes['FragranceRequest'], ParentType, ContextType, RequireFields<QueryFragranceRequestArgs, 'id'>>;
  fragranceRequests?: Resolver<ResolversTypes['FragranceRequestConnection'], ParentType, ContextType, Partial<QueryFragranceRequestsArgs>>;
  fragrances?: Resolver<ResolversTypes['FragranceConnection'], ParentType, ContextType, Partial<QueryFragrancesArgs>>;
  me?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  note?: Resolver<ResolversTypes['Note'], ParentType, ContextType, RequireFields<QueryNoteArgs, 'id'>>;
  noteEdit?: Resolver<ResolversTypes['NoteEdit'], ParentType, ContextType, RequireFields<QueryNoteEditArgs, 'id'>>;
  noteEdits?: Resolver<ResolversTypes['NoteEditConnection'], ParentType, ContextType, Partial<QueryNoteEditsArgs>>;
  noteRequest?: Resolver<ResolversTypes['NoteRequest'], ParentType, ContextType, RequireFields<QueryNoteRequestArgs, 'id'>>;
  noteRequests?: Resolver<ResolversTypes['NoteRequestConnection'], ParentType, ContextType, Partial<QueryNoteRequestsArgs>>;
  notes?: Resolver<ResolversTypes['NoteConnection'], ParentType, ContextType, Partial<QueryNotesArgs>>;
  searchAccords?: Resolver<ResolversTypes['SearchAccordConnection'], ParentType, ContextType, Partial<QuerySearchAccordsArgs>>;
  searchBrands?: Resolver<ResolversTypes['SearchBrandConnection'], ParentType, ContextType, Partial<QuerySearchBrandsArgs>>;
  searchFragrances?: Resolver<ResolversTypes['SearchFragranceConnection'], ParentType, ContextType, Partial<QuerySearchFragrancesArgs>>;
  searchNotes?: Resolver<ResolversTypes['SearchNoteConnection'], ParentType, ContextType, Partial<QuerySearchNotesArgs>>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
}>;

export type SearchAccordConnectionResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['SearchAccordConnection'] = ResolversParentTypes['SearchAccordConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['SearchAccordEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['SearchPageInfo'], ParentType, ContextType>;
}>;

export type SearchAccordEdgeResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['SearchAccordEdge'] = ResolversParentTypes['SearchAccordEdge']> = ResolversObject<{
  node?: Resolver<ResolversTypes['Accord'], ParentType, ContextType>;
  offset?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type SearchBrandConnectionResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['SearchBrandConnection'] = ResolversParentTypes['SearchBrandConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['SearchBrandEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['SearchPageInfo'], ParentType, ContextType>;
}>;

export type SearchBrandEdgeResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['SearchBrandEdge'] = ResolversParentTypes['SearchBrandEdge']> = ResolversObject<{
  node?: Resolver<ResolversTypes['Brand'], ParentType, ContextType>;
  offset?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type SearchFragranceConnectionResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['SearchFragranceConnection'] = ResolversParentTypes['SearchFragranceConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['SearchFragranceEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['SearchPageInfo'], ParentType, ContextType>;
}>;

export type SearchFragranceEdgeResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['SearchFragranceEdge'] = ResolversParentTypes['SearchFragranceEdge']> = ResolversObject<{
  node?: Resolver<ResolversTypes['Fragrance'], ParentType, ContextType>;
  offset?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type SearchNoteConnectionResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['SearchNoteConnection'] = ResolversParentTypes['SearchNoteConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['SearchNoteEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['SearchPageInfo'], ParentType, ContextType>;
}>;

export type SearchNoteEdgeResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['SearchNoteEdge'] = ResolversParentTypes['SearchNoteEdge']> = ResolversObject<{
  node?: Resolver<ResolversTypes['Note'], ParentType, ContextType>;
  offset?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type SearchPageInfoResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['SearchPageInfo'] = ResolversParentTypes['SearchPageInfo']> = ResolversObject<{
  endOffset?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  pageSize?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  startOffset?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type TraitOptionResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['TraitOption'] = ResolversParentTypes['TraitOption']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  score?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type TraitStatsResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['TraitStats'] = ResolversParentTypes['TraitStats']> = ResolversObject<{
  averageScore?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  distribution?: Resolver<Array<ResolversTypes['TraitVoteDistribution']>, ParentType, ContextType>;
  totalVotes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type TraitVoteResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['TraitVote'] = ResolversParentTypes['TraitVote']> = ResolversObject<{
  option?: Resolver<ResolversTypes['TraitOption'], ParentType, ContextType>;
}>;

export type TraitVoteDistributionResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['TraitVoteDistribution'] = ResolversParentTypes['TraitVoteDistribution']> = ResolversObject<{
  option?: Resolver<ResolversTypes['TraitOption'], ParentType, ContextType>;
  votes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  accordRequests?: Resolver<ResolversTypes['AccordRequestConnection'], ParentType, ContextType, Partial<UserAccordRequestsArgs>>;
  avatar?: Resolver<Maybe<ResolversTypes['Asset']>, ParentType, ContextType>;
  brandRequests?: Resolver<ResolversTypes['BrandRequestConnection'], ParentType, ContextType, Partial<UserBrandRequestsArgs>>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fragranceRequests?: Resolver<ResolversTypes['FragranceRequestConnection'], ParentType, ContextType, Partial<UserFragranceRequestsArgs>>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  noteRequests?: Resolver<ResolversTypes['NoteRequestConnection'], ParentType, ContextType, Partial<UserNoteRequestsArgs>>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type VoteInfoResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['VoteInfo'] = ResolversParentTypes['VoteInfo']> = ResolversObject<{
  downvotes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  myVote?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  score?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  upvotes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type Resolvers<ContextType = ServerContext> = ResolversObject<{
  Accord?: AccordResolvers<ContextType>;
  AccordConnection?: AccordConnectionResolvers<ContextType>;
  AccordEdge?: AccordEdgeResolvers<ContextType>;
  AccordEdit?: AccordEditResolvers<ContextType>;
  AccordEditConnection?: AccordEditConnectionResolvers<ContextType>;
  AccordEditEdge?: AccordEditEdgeResolvers<ContextType>;
  AccordRequest?: AccordRequestResolvers<ContextType>;
  AccordRequestConnection?: AccordRequestConnectionResolvers<ContextType>;
  AccordRequestEdge?: AccordRequestEdgeResolvers<ContextType>;
  Asset?: AssetResolvers<ContextType>;
  AuthCodeDeliveryDetails?: AuthCodeDeliveryDetailsResolvers<ContextType>;
  AuthDeliveryResult?: AuthDeliveryResultResolvers<ContextType>;
  AuthTokenPayload?: AuthTokenPayloadResolvers<ContextType>;
  Brand?: BrandResolvers<ContextType>;
  BrandConnection?: BrandConnectionResolvers<ContextType>;
  BrandEdge?: BrandEdgeResolvers<ContextType>;
  BrandEdit?: BrandEditResolvers<ContextType>;
  BrandEditConnection?: BrandEditConnectionResolvers<ContextType>;
  BrandEditEdge?: BrandEditEdgeResolvers<ContextType>;
  BrandRequest?: BrandRequestResolvers<ContextType>;
  BrandRequestConnection?: BrandRequestConnectionResolvers<ContextType>;
  BrandRequestEdge?: BrandRequestEdgeResolvers<ContextType>;
  Date?: GraphQLScalarType;
  EditJob?: EditJobResolvers<ContextType>;
  Fragrance?: FragranceResolvers<ContextType>;
  FragranceAccord?: FragranceAccordResolvers<ContextType>;
  FragranceAccordConnection?: FragranceAccordConnectionResolvers<ContextType>;
  FragranceAccordEdge?: FragranceAccordEdgeResolvers<ContextType>;
  FragranceConnection?: FragranceConnectionResolvers<ContextType>;
  FragranceEdge?: FragranceEdgeResolvers<ContextType>;
  FragranceEdit?: FragranceEditResolvers<ContextType>;
  FragranceEditConnection?: FragranceEditConnectionResolvers<ContextType>;
  FragranceEditEdge?: FragranceEditEdgeResolvers<ContextType>;
  FragranceImage?: FragranceImageResolvers<ContextType>;
  FragranceImageConnection?: FragranceImageConnectionResolvers<ContextType>;
  FragranceImageEdge?: FragranceImageEdgeResolvers<ContextType>;
  FragranceNote?: FragranceNoteResolvers<ContextType>;
  FragranceNoteConnection?: FragranceNoteConnectionResolvers<ContextType>;
  FragranceNoteEdge?: FragranceNoteEdgeResolvers<ContextType>;
  FragranceRequest?: FragranceRequestResolvers<ContextType>;
  FragranceRequestConnection?: FragranceRequestConnectionResolvers<ContextType>;
  FragranceRequestEdge?: FragranceRequestEdgeResolvers<ContextType>;
  FragranceRequestNote?: FragranceRequestNoteResolvers<ContextType>;
  FragranceRequestTrait?: FragranceRequestTraitResolvers<ContextType>;
  FragranceTrait?: FragranceTraitResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Note?: NoteResolvers<ContextType>;
  NoteConnection?: NoteConnectionResolvers<ContextType>;
  NoteEdge?: NoteEdgeResolvers<ContextType>;
  NoteEdit?: NoteEditResolvers<ContextType>;
  NoteEditConnection?: NoteEditConnectionResolvers<ContextType>;
  NoteEditEdge?: NoteEditEdgeResolvers<ContextType>;
  NoteRequest?: NoteRequestResolvers<ContextType>;
  NoteRequestConnection?: NoteRequestConnectionResolvers<ContextType>;
  NoteRequestEdge?: NoteRequestEdgeResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  PresignedUpload?: PresignedUploadResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  SearchAccordConnection?: SearchAccordConnectionResolvers<ContextType>;
  SearchAccordEdge?: SearchAccordEdgeResolvers<ContextType>;
  SearchBrandConnection?: SearchBrandConnectionResolvers<ContextType>;
  SearchBrandEdge?: SearchBrandEdgeResolvers<ContextType>;
  SearchFragranceConnection?: SearchFragranceConnectionResolvers<ContextType>;
  SearchFragranceEdge?: SearchFragranceEdgeResolvers<ContextType>;
  SearchNoteConnection?: SearchNoteConnectionResolvers<ContextType>;
  SearchNoteEdge?: SearchNoteEdgeResolvers<ContextType>;
  SearchPageInfo?: SearchPageInfoResolvers<ContextType>;
  TraitOption?: TraitOptionResolvers<ContextType>;
  TraitStats?: TraitStatsResolvers<ContextType>;
  TraitVote?: TraitVoteResolvers<ContextType>;
  TraitVoteDistribution?: TraitVoteDistributionResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  VoteInfo?: VoteInfoResolvers<ContextType>;
}>;

