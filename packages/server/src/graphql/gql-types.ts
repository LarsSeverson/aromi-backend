import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { IAssetResult } from '../features/assets/types.js';
import { IUserSummary, IUserFollowSummary } from '../features/users/types.js';
import { IFragranceSummary, IFragranceImageSummary, IFragranceEditSummary, IFragranceRequestSummary, IFragranceCollectionSummary, IFragranceCollectionItemSummary, IFragranceReviewSummary, IFragranceVoteSummary } from '../features/fragrances/types.js';
import { IBrandSummary, IBrandEditSummary, IBrandRequestSummary } from '../features/brands/types.js';
import { IAccordEditSummary, IAccordRequestSummary } from '../features/accords/types.js';
import { INoteSummary, INoteEditSummary, INoteRequestSummary } from '../features/notes/types.js';
import { IPost, IPostAsset, IPostComment, IPostCommentAsset } from '../features/posts/types.js';
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
  JSON: { input: any; output: any; }
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

export type AddFragranceToCollectionsInput = {
  collectionIds: Array<Scalars['ID']['input']>;
  fragranceId: Scalars['ID']['input'];
};

export type Asset = {
  __typename?: 'Asset';
  contentType: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  s3Key: Scalars['String']['output'];
  sizeBytes: Scalars['Int']['output'];
  url?: Maybe<Scalars['String']['output']>;
};

export const AssetKey = {
  AccordImages: 'ACCORD_IMAGES',
  BrandImages: 'BRAND_IMAGES',
  FragranceImages: 'FRAGRANCE_IMAGES',
  NoteImages: 'NOTE_IMAGES',
  PostAssets: 'POST_ASSETS',
  PostCommentAssets: 'POST_COMMENT_ASSETS',
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

export type ChangePasswordInput = {
  newPassword: Scalars['String']['input'];
  oldPassword: Scalars['String']['input'];
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

export type CreateFragranceCollectionInput = {
  name: Scalars['String']['input'];
};

export type CreateFragranceCollectionItemInput = {
  collectionId: Scalars['ID']['input'];
  fragranceId: Scalars['ID']['input'];
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

export type CreateFragranceReportInput = {
  body?: InputMaybe<Scalars['String']['input']>;
  fragranceId: Scalars['ID']['input'];
};

export type CreateFragranceRequestInput = {
  assetId?: InputMaybe<Scalars['ID']['input']>;
  concentration?: InputMaybe<Concentration>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  releaseYear?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<FragranceStatus>;
};

export type CreateFragranceReviewInput = {
  body: Scalars['String']['input'];
  fragranceId: Scalars['ID']['input'];
  rating: Scalars['Float']['input'];
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

export type CreatePostAssetInput = {
  assetId: Scalars['ID']['input'];
  displayOrder: Scalars['Int']['input'];
};

export type CreatePostCommentAssetInput = {
  assetId: Scalars['ID']['input'];
  displayOrder: Scalars['Int']['input'];
};

export type CreatePostCommentInput = {
  assets?: InputMaybe<Array<CreatePostCommentAssetInput>>;
  content?: InputMaybe<Scalars['JSON']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
  postId: Scalars['ID']['input'];
};

export type CreatePostInput = {
  assets?: InputMaybe<Array<CreatePostAssetInput>>;
  content?: InputMaybe<Scalars['JSON']['input']>;
  fragranceId?: InputMaybe<Scalars['ID']['input']>;
  title: Scalars['String']['input'];
  type: PostType;
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

export type DeleteFragranceCollectionInput = {
  collectionId: Scalars['ID']['input'];
};

export type DeleteFragranceCollectionItemInput = {
  collectionId: Scalars['ID']['input'];
  itemId: Scalars['ID']['input'];
};

export type DeleteFragranceRequestInput = {
  id: Scalars['ID']['input'];
};

export type DeleteFragranceReviewInput = {
  reviewId: Scalars['ID']['input'];
};

export type DeleteNoteRequestInput = {
  id: Scalars['ID']['input'];
};

export type DeletePostCommentInput = {
  id: Scalars['ID']['input'];
};

export type DeletePostInput = {
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
export type FollowUserInput = {
  userId: Scalars['ID']['input'];
};

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
  myAccords: Array<Accord>;
  myNotes: Array<Note>;
  myReview?: Maybe<FragranceReview>;
  myTraits: Array<FragranceTraitVote>;
  name: Scalars['String']['output'];
  notes: FragranceNoteConnection;
  releaseYear: Scalars['Int']['output'];
  reviewInfo: FragranceReviewInfo;
  reviews: FragranceReviewConnection;
  status: FragranceStatus;
  thumbnail?: Maybe<FragranceImage>;
  traits: Array<FragranceTrait>;
  votes: VoteInfo;
};


export type FragranceAccordsArgs = {
  input?: InputMaybe<FragranceAccordPaginationInput>;
};


export type FragranceMyNotesArgs = {
  layer: NoteLayer;
};


export type FragranceNotesArgs = {
  input?: InputMaybe<FragranceNotePaginationInput>;
};


export type FragranceReviewsArgs = {
  input?: InputMaybe<FragranceReviewPaginationInput>;
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

export type FragranceCollection = {
  __typename?: 'FragranceCollection';
  hasFragrance: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  info: FragranceCollectionInfo;
  items: FragranceCollectionItemConnection;
  name: Scalars['String']['output'];
  previewItems: Array<FragranceCollectionItem>;
  user: User;
};


export type FragranceCollectionHasFragranceArgs = {
  fragranceId: Scalars['ID']['input'];
};


export type FragranceCollectionItemsArgs = {
  input?: InputMaybe<FragranceCollectionItemPaginationInput>;
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

export type FragranceCollectionInfo = {
  __typename?: 'FragranceCollectionInfo';
  itemCount: Scalars['Int']['output'];
};

export type FragranceCollectionItem = {
  __typename?: 'FragranceCollectionItem';
  collection: FragranceCollection;
  fragrance: Fragrance;
  id: Scalars['ID']['output'];
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

export type FragranceCollectionItemPaginationInput = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<FragranceCollectionItemSortInput>;
};

export const FragranceCollectionItemSortBy = {
  Position: 'POSITION'
} as const;

export type FragranceCollectionItemSortBy = typeof FragranceCollectionItemSortBy[keyof typeof FragranceCollectionItemSortBy];
export type FragranceCollectionItemSortInput = {
  by?: InputMaybe<FragranceCollectionItemSortBy>;
  direction?: InputMaybe<SortDirection>;
};

export type FragranceCollectionPaginationInput = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<FragranceCollectionSortInput>;
};

export const FragranceCollectionSortBy = {
  Position: 'POSITION',
  Recent: 'RECENT'
} as const;

export type FragranceCollectionSortBy = typeof FragranceCollectionSortBy[keyof typeof FragranceCollectionSortBy];
export type FragranceCollectionSortInput = {
  by?: InputMaybe<FragranceCollectionSortBy>;
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

export type FragranceReport = {
  __typename?: 'FragranceReport';
  body?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
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

export type FragranceReview = {
  __typename?: 'FragranceReview';
  author: User;
  body?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  fragrance: Fragrance;
  id: Scalars['ID']['output'];
  rating: Scalars['Float']['output'];
  votes: VoteInfo;
};

export type FragranceReviewConnection = {
  __typename?: 'FragranceReviewConnection';
  edges: Array<FragranceReviewEdge>;
  pageInfo: PageInfo;
};

export type FragranceReviewEdge = {
  __typename?: 'FragranceReviewEdge';
  cursor: Scalars['String']['output'];
  node: FragranceReview;
};

export type FragranceReviewInfo = {
  __typename?: 'FragranceReviewInfo';
  averageRating?: Maybe<Scalars['Float']['output']>;
  count: Scalars['Int']['output'];
  distribution: Array<FragranceReviewInfoDistribution>;
};

export type FragranceReviewInfoDistribution = {
  __typename?: 'FragranceReviewInfoDistribution';
  count: Scalars['Int']['output'];
  rating: Scalars['Int']['output'];
};

export type FragranceReviewPaginationInput = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<FragranceReviewSortInput>;
};

export const FragranceReviewSortBy = {
  Recent: 'RECENT'
} as const;

export type FragranceReviewSortBy = typeof FragranceReviewSortBy[keyof typeof FragranceReviewSortBy];
export type FragranceReviewSortInput = {
  by?: InputMaybe<FragranceReviewSortBy>;
  direction?: InputMaybe<SortDirection>;
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
  fragrance: Fragrance;
  id: Scalars['ID']['output'];
  myVote?: Maybe<FragranceTraitVote>;
  name: Scalars['String']['output'];
  options: Array<TraitOption>;
  stats: TraitStats;
  type: TraitTypeEnum;
  typeId: Scalars['ID']['output'];
};

export type FragranceTraitInput = {
  type: TraitTypeEnum;
};

export type FragranceTraitVote = {
  __typename?: 'FragranceTraitVote';
  id: Scalars['ID']['output'];
  option?: Maybe<TraitOption>;
  type: TraitTypeEnum;
};

export type FragranceVote = {
  __typename?: 'FragranceVote';
  fragrance: Fragrance;
  id: Scalars['ID']['output'];
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

export type FragranceVotePaginationInput = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<FragranceVoteSortInput>;
};

export const FragranceVoteSortBy = {
  Recent: 'RECENT'
} as const;

export type FragranceVoteSortBy = typeof FragranceVoteSortBy[keyof typeof FragranceVoteSortBy];
export type FragranceVoteSortInput = {
  by?: InputMaybe<FragranceVoteSortBy>;
  direction?: InputMaybe<SortDirection>;
};

export type LogInInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type MoveFragranceCollectionItemsInput = {
  collectionId: Scalars['ID']['input'];
  insertBefore?: InputMaybe<Scalars['ID']['input']>;
  rangeLength?: InputMaybe<Scalars['Int']['input']>;
  rangeStart: Scalars['ID']['input'];
};

export type MoveFragranceCollectionsInput = {
  insertBefore?: InputMaybe<Scalars['ID']['input']>;
  rangeLength?: InputMaybe<Scalars['Int']['input']>;
  rangeStart: Scalars['ID']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addFragranceToCollections: Array<FragranceCollectionItem>;
  changePassword: Scalars['Boolean']['output'];
  confirmForgotPassword: Scalars['Boolean']['output'];
  confirmSignUp: User;
  createAccordEdit: AccordEdit;
  createAccordRequest: AccordRequest;
  createBrandEdit: BrandEdit;
  createBrandRequest: BrandRequest;
  createFragranceCollection: FragranceCollection;
  createFragranceCollectionItem: FragranceCollectionItem;
  createFragranceEdit: FragranceEdit;
  createFragranceReport: FragranceReport;
  createFragranceRequest: FragranceRequest;
  createFragranceReview: FragranceReview;
  createNoteEdit: NoteEdit;
  createNoteRequest: NoteRequest;
  createPost: Post;
  createPostComment: PostComment;
  deleteAccordRequest: AccordRequest;
  deleteAsset: Scalars['Boolean']['output'];
  deleteBrandRequest: BrandRequest;
  deleteFragranceCollection: FragranceCollection;
  deleteFragranceCollectionItem: FragranceCollectionItem;
  deleteFragranceRequest: FragranceRequest;
  deleteFragranceReview: FragranceReview;
  deleteNoteRequest: NoteRequest;
  deletePost: Post;
  deletePostComment: PostComment;
  follow: UserFollow;
  forgotPassword: AuthDeliveryResult;
  logIn: AuthTokenPayload;
  logOut: Scalars['Boolean']['output'];
  moveFragranceCollectionItems: Array<FragranceCollectionItem>;
  moveFragranceCollections: Array<FragranceCollection>;
  refresh?: Maybe<AuthTokenPayload>;
  removeFragranceFromCollections: Array<FragranceCollectionItem>;
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
  unfollow: UserFollow;
  updateAccordRequest: AccordRequest;
  updateBrandRequest: BrandRequest;
  updateFragranceCollection: FragranceCollection;
  updateFragranceRequest: FragranceRequest;
  updateFragranceReview: FragranceReview;
  updateMe: User;
  updateNoteRequest: NoteRequest;
  updatePost: Post;
  updatePostComment: PostComment;
  voteOnAccordRequest: AccordRequest;
  voteOnBrand: Brand;
  voteOnBrandRequest: BrandRequest;
  voteOnFragrance: Fragrance;
  voteOnFragranceAccord: Accord;
  voteOnFragranceNote: Note;
  voteOnFragranceRequest: FragranceRequest;
  voteOnFragranceReview: FragranceReview;
  voteOnFragranceTrait: FragranceTraitVote;
  voteOnNoteRequest: NoteRequest;
  voteOnPost: Post;
  voteOnPostComment: PostComment;
};


export type MutationAddFragranceToCollectionsArgs = {
  input: AddFragranceToCollectionsInput;
};


export type MutationChangePasswordArgs = {
  input: ChangePasswordInput;
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


export type MutationCreateFragranceCollectionArgs = {
  input: CreateFragranceCollectionInput;
};


export type MutationCreateFragranceCollectionItemArgs = {
  input: CreateFragranceCollectionItemInput;
};


export type MutationCreateFragranceEditArgs = {
  input: CreateFragranceEditInput;
};


export type MutationCreateFragranceReportArgs = {
  input: CreateFragranceReportInput;
};


export type MutationCreateFragranceRequestArgs = {
  input?: InputMaybe<CreateFragranceRequestInput>;
};


export type MutationCreateFragranceReviewArgs = {
  input: CreateFragranceReviewInput;
};


export type MutationCreateNoteEditArgs = {
  input: CreateNoteEditInput;
};


export type MutationCreateNoteRequestArgs = {
  input?: InputMaybe<CreateNoteRequestInput>;
};


export type MutationCreatePostArgs = {
  input: CreatePostInput;
};


export type MutationCreatePostCommentArgs = {
  input: CreatePostCommentInput;
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


export type MutationDeleteFragranceCollectionArgs = {
  input: DeleteFragranceCollectionInput;
};


export type MutationDeleteFragranceCollectionItemArgs = {
  input: DeleteFragranceCollectionItemInput;
};


export type MutationDeleteFragranceRequestArgs = {
  input: DeleteFragranceRequestInput;
};


export type MutationDeleteFragranceReviewArgs = {
  input: DeleteFragranceReviewInput;
};


export type MutationDeleteNoteRequestArgs = {
  input: DeleteNoteRequestInput;
};


export type MutationDeletePostArgs = {
  input: DeletePostInput;
};


export type MutationDeletePostCommentArgs = {
  input: DeletePostCommentInput;
};


export type MutationFollowArgs = {
  input: FollowUserInput;
};


export type MutationForgotPasswordArgs = {
  input: ForgotPasswordInput;
};


export type MutationLogInArgs = {
  input: LogInInput;
};


export type MutationMoveFragranceCollectionItemsArgs = {
  input: MoveFragranceCollectionItemsInput;
};


export type MutationMoveFragranceCollectionsArgs = {
  input: MoveFragranceCollectionsInput;
};


export type MutationRemoveFragranceFromCollectionsArgs = {
  input: RemoveFragranceFromCollectionsInput;
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


export type MutationUnfollowArgs = {
  input: UnfollowUserInput;
};


export type MutationUpdateAccordRequestArgs = {
  input: UpdateAccordRequestInput;
};


export type MutationUpdateBrandRequestArgs = {
  input: UpdateBrandRequestInput;
};


export type MutationUpdateFragranceCollectionArgs = {
  input: UpdateFragranceCollectionInput;
};


export type MutationUpdateFragranceRequestArgs = {
  input: UpdateFragranceRequestInput;
};


export type MutationUpdateFragranceReviewArgs = {
  input: UpdateFragranceReviewInput;
};


export type MutationUpdateMeArgs = {
  input: UpdateMeInput;
};


export type MutationUpdateNoteRequestArgs = {
  input: UpdateNoteRequestInput;
};


export type MutationUpdatePostArgs = {
  input: UpdatePostInput;
};


export type MutationUpdatePostCommentArgs = {
  input: UpdatePostCommentInput;
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


export type MutationVoteOnFragranceReviewArgs = {
  input: VoteOnFragranceReviewInput;
};


export type MutationVoteOnFragranceTraitArgs = {
  input: VoteOnFragranceTraitInput;
};


export type MutationVoteOnNoteRequestArgs = {
  input: VoteOnNoteRequestInput;
};


export type MutationVoteOnPostArgs = {
  input: VoteOnPostInput;
};


export type MutationVoteOnPostCommentArgs = {
  input: VoteOnPostCommentInput;
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

export type Post = {
  __typename?: 'Post';
  assets: Array<PostAsset>;
  commentCount: Scalars['Int']['output'];
  comments: PostCommentConnection;
  content?: Maybe<Scalars['JSON']['output']>;
  createdAt: Scalars['String']['output'];
  fragrance?: Maybe<Fragrance>;
  id: Scalars['ID']['output'];
  searchComments: SearchPostCommentConnection;
  title: Scalars['String']['output'];
  type: PostType;
  user: User;
  votes: VoteInfo;
};


export type PostCommentsArgs = {
  input?: InputMaybe<PostCommentPaginationInput>;
};


export type PostSearchCommentsArgs = {
  input?: InputMaybe<SearchInput>;
};

export type PostAsset = {
  __typename?: 'PostAsset';
  asset: Asset;
  displayOrder: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  post: Post;
};

export type PostComment = {
  __typename?: 'PostComment';
  assets: Array<PostCommentAsset>;
  commentCount: Scalars['Int']['output'];
  comments: PostCommentConnection;
  content?: Maybe<Scalars['JSON']['output']>;
  createdAt: Scalars['String']['output'];
  depth: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  parent?: Maybe<PostComment>;
  post: Post;
  user: User;
  votes: VoteInfo;
};


export type PostCommentCommentsArgs = {
  input?: InputMaybe<PostCommentPaginationInput>;
};

export type PostCommentAsset = {
  __typename?: 'PostCommentAsset';
  PostComment: PostComment;
  asset: Asset;
  displayOrder: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
};

export type PostCommentConnection = {
  __typename?: 'PostCommentConnection';
  edges: Array<PostCommentEdge>;
  pageInfo: PageInfo;
};

export type PostCommentEdge = {
  __typename?: 'PostCommentEdge';
  cursor: Scalars['String']['output'];
  node: PostComment;
};

export type PostCommentPaginationInput = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<PostCommentSortInput>;
};

export const PostCommentSortBy = {
  Recent: 'RECENT'
} as const;

export type PostCommentSortBy = typeof PostCommentSortBy[keyof typeof PostCommentSortBy];
export type PostCommentSortInput = {
  by?: InputMaybe<PostCommentSortBy>;
  direction?: InputMaybe<SortDirection>;
};

export type PostCommentVote = {
  __typename?: 'PostCommentVote';
  comment: PostComment;
  id: Scalars['ID']['output'];
  user: User;
  vote: Scalars['Int']['output'];
};

export type PostCommentVoteConnection = {
  __typename?: 'PostCommentVoteConnection';
  edges: Array<PostCommentVoteEdge>;
  pageInfo: PageInfo;
};

export type PostCommentVoteEdge = {
  __typename?: 'PostCommentVoteEdge';
  cursor: Scalars['String']['output'];
  node: PostCommentVote;
};

export type PostCommentVotePaginationInput = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<PostCommentVoteSortInput>;
};

export const PostCommentVoteSortBy = {
  Recent: 'RECENT'
} as const;

export type PostCommentVoteSortBy = typeof PostCommentVoteSortBy[keyof typeof PostCommentVoteSortBy];
export type PostCommentVoteSortInput = {
  by?: InputMaybe<PostCommentVoteSortBy>;
  direction?: InputMaybe<SortDirection>;
};

export type PostConnection = {
  __typename?: 'PostConnection';
  edges: Array<PostEdge>;
  pageInfo: PageInfo;
};

export type PostEdge = {
  __typename?: 'PostEdge';
  cursor: Scalars['String']['output'];
  node: Post;
};

export type PostPaginationInput = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<PostSortInput>;
};

export const PostSortBy = {
  Recent: 'RECENT'
} as const;

export type PostSortBy = typeof PostSortBy[keyof typeof PostSortBy];
export type PostSortInput = {
  by?: InputMaybe<PostSortBy>;
  direction?: InputMaybe<SortDirection>;
};

export const PostType = {
  Fragrance: 'FRAGRANCE',
  Media: 'MEDIA',
  Text: 'TEXT'
} as const;

export type PostType = typeof PostType[keyof typeof PostType];
export type PostVote = {
  __typename?: 'PostVote';
  id: Scalars['ID']['output'];
  post: Post;
  user: User;
  vote: Scalars['Int']['output'];
};

export type PostVoteConnection = {
  __typename?: 'PostVoteConnection';
  edges: Array<PostVoteEdge>;
  pageInfo: PageInfo;
};

export type PostVoteEdge = {
  __typename?: 'PostVoteEdge';
  cursor: Scalars['String']['output'];
  node: PostVote;
};

export type PostVotePaginationInput = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<PostVoteSortInput>;
};

export const PostVoteSortBy = {
  Recent: 'RECENT'
} as const;

export type PostVoteSortBy = typeof PostVoteSortBy[keyof typeof PostVoteSortBy];
export type PostVoteSortInput = {
  by?: InputMaybe<PostVoteSortBy>;
  direction?: InputMaybe<SortDirection>;
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
  fragranceCollection: FragranceCollection;
  fragranceCollections: FragranceCollectionConnection;
  fragranceEdit: FragranceEdit;
  fragranceEdits: FragranceEditConnection;
  fragranceRequest: FragranceRequest;
  fragranceRequests: FragranceRequestConnection;
  fragrances: FragranceConnection;
  healthy: Scalars['String']['output'];
  me: User;
  note: Note;
  noteEdit: NoteEdit;
  noteEdits: NoteEditConnection;
  noteRequest: NoteRequest;
  noteRequests: NoteRequestConnection;
  notes: NoteConnection;
  post: Post;
  postComment: PostComment;
  postComments: PostCommentConnection;
  posts: PostConnection;
  searchAccords: SearchAccordConnection;
  searchBrands: SearchBrandConnection;
  searchFragrances: SearchFragranceConnection;
  searchNotes: SearchNoteConnection;
  searchPosts: SearchPostConnection;
  searchUsers: SearchUserConnection;
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


export type QueryFragranceCollectionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryFragranceCollectionsArgs = {
  input?: InputMaybe<FragranceCollectionPaginationInput>;
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


export type QueryPostArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPostCommentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPostCommentsArgs = {
  input?: InputMaybe<PostCommentPaginationInput>;
};


export type QueryPostsArgs = {
  input?: InputMaybe<PostPaginationInput>;
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


export type QuerySearchPostsArgs = {
  input?: InputMaybe<SearchInput>;
};


export type QuerySearchUsersArgs = {
  input?: InputMaybe<SearchInput>;
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export const RelationshipStatus = {
  Follower: 'FOLLOWER',
  Following: 'FOLLOWING',
  Mutual: 'MUTUAL',
  None: 'NONE'
} as const;

export type RelationshipStatus = typeof RelationshipStatus[keyof typeof RelationshipStatus];
export type RemoveFragranceFromCollectionsInput = {
  collectionIds: Array<Scalars['ID']['input']>;
  fragranceId: Scalars['ID']['input'];
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
  after?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SearchSortInput>;
};

export type SearchPostCommentConnection = {
  __typename?: 'SearchPostCommentConnection';
  edges: Array<SearchPostCommentEdge>;
  pageInfo: SearchPageInfo;
};

export type SearchPostCommentEdge = {
  __typename?: 'SearchPostCommentEdge';
  node: PostComment;
  offset: Scalars['Int']['output'];
};

export type SearchPostConnection = {
  __typename?: 'SearchPostConnection';
  edges: Array<SearchPostEdge>;
  pageInfo: SearchPageInfo;
};

export type SearchPostEdge = {
  __typename?: 'SearchPostEdge';
  node: Post;
  offset: Scalars['Int']['output'];
};

export const SearchSortBy = {
  Relevance: 'RELEVANCE'
} as const;

export type SearchSortBy = typeof SearchSortBy[keyof typeof SearchSortBy];
export type SearchSortInput = {
  by?: InputMaybe<SearchSortBy>;
  direction?: InputMaybe<SortDirection>;
};

export type SearchUserConnection = {
  __typename?: 'SearchUserConnection';
  edges: Array<SearchUserEdge>;
  pageInfo: SearchPageInfo;
};

export type SearchUserEdge = {
  __typename?: 'SearchUserEdge';
  node: User;
  offset: Scalars['Int']['output'];
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
  Projection: 'PROJECTION',
  Season: 'SEASON',
  Time: 'TIME'
} as const;

export type TraitTypeEnum = typeof TraitTypeEnum[keyof typeof TraitTypeEnum];
export type TraitVoteDistribution = {
  __typename?: 'TraitVoteDistribution';
  option: TraitOption;
  votes: Scalars['Int']['output'];
};

export type UnfollowUserInput = {
  userId: Scalars['ID']['input'];
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

export type UpdateFragranceCollectionInput = {
  collectionId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
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

export type UpdateFragranceReviewInput = {
  body: Scalars['String']['input'];
  rating?: InputMaybe<Scalars['Float']['input']>;
  reviewId: Scalars['ID']['input'];
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

export type UpdatePostAssetInput = {
  assetId: Scalars['ID']['input'];
  displayOrder: Scalars['Int']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type UpdatePostCommentInput = {
  content?: InputMaybe<Scalars['JSON']['input']>;
  id: Scalars['ID']['input'];
};

export type UpdatePostInput = {
  content?: InputMaybe<Scalars['JSON']['input']>;
  id: Scalars['ID']['input'];
};

export type User = {
  __typename?: 'User';
  accordRequests: AccordRequestConnection;
  avatar?: Maybe<Asset>;
  brandRequests: BrandRequestConnection;
  collection: FragranceCollection;
  collections: FragranceCollectionConnection;
  email?: Maybe<Scalars['String']['output']>;
  followerCount: Scalars['Int']['output'];
  followers: UserFollowConnection;
  following: UserFollowConnection;
  followingCount: Scalars['Int']['output'];
  fragranceRequests: FragranceRequestConnection;
  id: Scalars['ID']['output'];
  likes: FragranceVoteConnection;
  noteRequests: NoteRequestConnection;
  posts: PostConnection;
  relationship: RelationshipStatus;
  review: FragranceReview;
  reviews: FragranceReviewConnection;
  username: Scalars['String']['output'];
};


export type UserAccordRequestsArgs = {
  input?: InputMaybe<RequestPaginationInput>;
};


export type UserBrandRequestsArgs = {
  input?: InputMaybe<RequestPaginationInput>;
};


export type UserCollectionArgs = {
  id: Scalars['ID']['input'];
};


export type UserCollectionsArgs = {
  input?: InputMaybe<FragranceCollectionPaginationInput>;
};


export type UserFollowersArgs = {
  input?: InputMaybe<UserFollowPaginationInput>;
};


export type UserFollowingArgs = {
  input?: InputMaybe<UserFollowPaginationInput>;
};


export type UserFragranceRequestsArgs = {
  input?: InputMaybe<RequestPaginationInput>;
};


export type UserLikesArgs = {
  input?: InputMaybe<FragranceVotePaginationInput>;
};


export type UserNoteRequestsArgs = {
  input?: InputMaybe<RequestPaginationInput>;
};


export type UserPostsArgs = {
  input?: InputMaybe<PostPaginationInput>;
};


export type UserReviewArgs = {
  id: Scalars['ID']['input'];
};


export type UserReviewsArgs = {
  input?: InputMaybe<FragranceReviewPaginationInput>;
};

export type UserFollow = {
  __typename?: 'UserFollow';
  id: Scalars['ID']['output'];
  user: User;
};

export type UserFollowConnection = {
  __typename?: 'UserFollowConnection';
  edges: Array<UserFollowEdge>;
  pageInfo: PageInfo;
};

export type UserFollowEdge = {
  __typename?: 'UserFollowEdge';
  cursor: Scalars['String']['output'];
  node: UserFollow;
};

export type UserFollowPaginationInput = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<UserFollowSortInput>;
};

export const UserFollowSortBy = {
  Recent: 'RECENT'
} as const;

export type UserFollowSortBy = typeof UserFollowSortBy[keyof typeof UserFollowSortBy];
export type UserFollowSortInput = {
  by?: InputMaybe<UserFollowSortBy>;
  direction?: InputMaybe<SortDirection>;
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

export type VoteOnFragranceReviewInput = {
  reviewId: Scalars['ID']['input'];
  vote: Scalars['Int']['input'];
};

export type VoteOnFragranceTraitInput = {
  fragranceId: Scalars['ID']['input'];
  traitOptionId?: InputMaybe<Scalars['ID']['input']>;
  traitTypeId: Scalars['ID']['input'];
};

export type VoteOnNoteRequestInput = {
  requestId: Scalars['ID']['input'];
  vote: Scalars['Int']['input'];
};

export type VoteOnPostCommentInput = {
  commentId: Scalars['ID']['input'];
  vote: Scalars['Int']['input'];
};

export type VoteOnPostInput = {
  postId: Scalars['ID']['input'];
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
  AddFragranceToCollectionsInput: ResolverTypeWrapper<Partial<AddFragranceToCollectionsInput>>;
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
  ChangePasswordInput: ResolverTypeWrapper<Partial<ChangePasswordInput>>;
  Concentration: ResolverTypeWrapper<Partial<Concentration>>;
  ConfirmForgotPasswordInput: ResolverTypeWrapper<Partial<ConfirmForgotPasswordInput>>;
  ConfirmSignUpInput: ResolverTypeWrapper<Partial<ConfirmSignUpInput>>;
  CreateAccordEditInput: ResolverTypeWrapper<Partial<CreateAccordEditInput>>;
  CreateAccordRequestInput: ResolverTypeWrapper<Partial<CreateAccordRequestInput>>;
  CreateBrandEditInput: ResolverTypeWrapper<Partial<CreateBrandEditInput>>;
  CreateBrandRequestInput: ResolverTypeWrapper<Partial<CreateBrandRequestInput>>;
  CreateFragranceCollectionInput: ResolverTypeWrapper<Partial<CreateFragranceCollectionInput>>;
  CreateFragranceCollectionItemInput: ResolverTypeWrapper<Partial<CreateFragranceCollectionItemInput>>;
  CreateFragranceEditInput: ResolverTypeWrapper<Partial<CreateFragranceEditInput>>;
  CreateFragranceReportInput: ResolverTypeWrapper<Partial<CreateFragranceReportInput>>;
  CreateFragranceRequestInput: ResolverTypeWrapper<Partial<CreateFragranceRequestInput>>;
  CreateFragranceReviewInput: ResolverTypeWrapper<Partial<CreateFragranceReviewInput>>;
  CreateNoteEditInput: ResolverTypeWrapper<Partial<CreateNoteEditInput>>;
  CreateNoteRequestInput: ResolverTypeWrapper<Partial<CreateNoteRequestInput>>;
  CreatePostAssetInput: ResolverTypeWrapper<Partial<CreatePostAssetInput>>;
  CreatePostCommentAssetInput: ResolverTypeWrapper<Partial<CreatePostCommentAssetInput>>;
  CreatePostCommentInput: ResolverTypeWrapper<Partial<CreatePostCommentInput>>;
  CreatePostInput: ResolverTypeWrapper<Partial<CreatePostInput>>;
  Date: ResolverTypeWrapper<Partial<Scalars['Date']['output']>>;
  DeleteAccordRequestInput: ResolverTypeWrapper<Partial<DeleteAccordRequestInput>>;
  DeleteAssetInput: ResolverTypeWrapper<Partial<DeleteAssetInput>>;
  DeleteBrandRequestInput: ResolverTypeWrapper<Partial<DeleteBrandRequestInput>>;
  DeleteFragranceCollectionInput: ResolverTypeWrapper<Partial<DeleteFragranceCollectionInput>>;
  DeleteFragranceCollectionItemInput: ResolverTypeWrapper<Partial<DeleteFragranceCollectionItemInput>>;
  DeleteFragranceRequestInput: ResolverTypeWrapper<Partial<DeleteFragranceRequestInput>>;
  DeleteFragranceReviewInput: ResolverTypeWrapper<Partial<DeleteFragranceReviewInput>>;
  DeleteNoteRequestInput: ResolverTypeWrapper<Partial<DeleteNoteRequestInput>>;
  DeletePostCommentInput: ResolverTypeWrapper<Partial<DeletePostCommentInput>>;
  DeletePostInput: ResolverTypeWrapper<Partial<DeletePostInput>>;
  EditJob: ResolverTypeWrapper<Partial<EditJob>>;
  EditJobStatus: ResolverTypeWrapper<Partial<EditJobStatus>>;
  EditStatus: ResolverTypeWrapper<Partial<EditStatus>>;
  Float: ResolverTypeWrapper<Partial<Scalars['Float']['output']>>;
  FollowUserInput: ResolverTypeWrapper<Partial<FollowUserInput>>;
  ForgotPasswordInput: ResolverTypeWrapper<Partial<ForgotPasswordInput>>;
  Fragrance: ResolverTypeWrapper<IFragranceSummary>;
  FragranceAccord: ResolverTypeWrapper<Partial<FragranceAccord>>;
  FragranceAccordConnection: ResolverTypeWrapper<Partial<FragranceAccordConnection>>;
  FragranceAccordEdge: ResolverTypeWrapper<Partial<FragranceAccordEdge>>;
  FragranceAccordPaginationInput: ResolverTypeWrapper<Partial<FragranceAccordPaginationInput>>;
  FragranceAccordSortBy: ResolverTypeWrapper<Partial<FragranceAccordSortBy>>;
  FragranceAccordSortInput: ResolverTypeWrapper<Partial<FragranceAccordSortInput>>;
  FragranceCollection: ResolverTypeWrapper<IFragranceCollectionSummary>;
  FragranceCollectionConnection: ResolverTypeWrapper<Partial<Omit<FragranceCollectionConnection, 'edges'> & { edges: Array<ResolversTypes['FragranceCollectionEdge']> }>>;
  FragranceCollectionEdge: ResolverTypeWrapper<Partial<Omit<FragranceCollectionEdge, 'node'> & { node: ResolversTypes['FragranceCollection'] }>>;
  FragranceCollectionInfo: ResolverTypeWrapper<Partial<FragranceCollectionInfo>>;
  FragranceCollectionItem: ResolverTypeWrapper<IFragranceCollectionItemSummary>;
  FragranceCollectionItemConnection: ResolverTypeWrapper<Partial<Omit<FragranceCollectionItemConnection, 'edges'> & { edges: Array<ResolversTypes['FragranceCollectionItemEdge']> }>>;
  FragranceCollectionItemEdge: ResolverTypeWrapper<Partial<Omit<FragranceCollectionItemEdge, 'node'> & { node: ResolversTypes['FragranceCollectionItem'] }>>;
  FragranceCollectionItemPaginationInput: ResolverTypeWrapper<Partial<FragranceCollectionItemPaginationInput>>;
  FragranceCollectionItemSortBy: ResolverTypeWrapper<Partial<FragranceCollectionItemSortBy>>;
  FragranceCollectionItemSortInput: ResolverTypeWrapper<Partial<FragranceCollectionItemSortInput>>;
  FragranceCollectionPaginationInput: ResolverTypeWrapper<Partial<FragranceCollectionPaginationInput>>;
  FragranceCollectionSortBy: ResolverTypeWrapper<Partial<FragranceCollectionSortBy>>;
  FragranceCollectionSortInput: ResolverTypeWrapper<Partial<FragranceCollectionSortInput>>;
  FragranceConnection: ResolverTypeWrapper<Partial<Omit<FragranceConnection, 'edges'> & { edges: Array<ResolversTypes['FragranceEdge']> }>>;
  FragranceEdge: ResolverTypeWrapper<Partial<Omit<FragranceEdge, 'node'> & { node: ResolversTypes['Fragrance'] }>>;
  FragranceEdit: ResolverTypeWrapper<IFragranceEditSummary>;
  FragranceEditConnection: ResolverTypeWrapper<Partial<Omit<FragranceEditConnection, 'edges'> & { edges: Array<ResolversTypes['FragranceEditEdge']> }>>;
  FragranceEditEdge: ResolverTypeWrapper<Partial<Omit<FragranceEditEdge, 'node'> & { node: ResolversTypes['FragranceEdit'] }>>;
  FragranceEditPaginationInput: ResolverTypeWrapper<Partial<FragranceEditPaginationInput>>;
  FragranceEditSortBy: ResolverTypeWrapper<Partial<FragranceEditSortBy>>;
  FragranceEditSortInput: ResolverTypeWrapper<Partial<FragranceEditSortInput>>;
  FragranceImage: ResolverTypeWrapper<IFragranceImageSummary>;
  FragranceImageConnection: ResolverTypeWrapper<Partial<Omit<FragranceImageConnection, 'edges'> & { edges: Array<ResolversTypes['FragranceImageEdge']> }>>;
  FragranceImageEdge: ResolverTypeWrapper<Partial<Omit<FragranceImageEdge, 'node'> & { node: ResolversTypes['FragranceImage'] }>>;
  FragranceNote: ResolverTypeWrapper<Partial<Omit<FragranceNote, 'note'> & { note: ResolversTypes['Note'] }>>;
  FragranceNoteConnection: ResolverTypeWrapper<Partial<Omit<FragranceNoteConnection, 'edges'> & { edges: Array<ResolversTypes['FragranceNoteEdge']> }>>;
  FragranceNoteEdge: ResolverTypeWrapper<Partial<Omit<FragranceNoteEdge, 'node'> & { node: ResolversTypes['FragranceNote'] }>>;
  FragranceNotePaginationInput: ResolverTypeWrapper<Partial<FragranceNotePaginationInput>>;
  FragranceNoteSortBy: ResolverTypeWrapper<Partial<FragranceNoteSortBy>>;
  FragranceNoteSortInput: ResolverTypeWrapper<Partial<FragranceNoteSortInput>>;
  FragrancePaginationInput: ResolverTypeWrapper<Partial<FragrancePaginationInput>>;
  FragranceReport: ResolverTypeWrapper<Partial<FragranceReport>>;
  FragranceRequest: ResolverTypeWrapper<IFragranceRequestSummary>;
  FragranceRequestConnection: ResolverTypeWrapper<Partial<Omit<FragranceRequestConnection, 'edges'> & { edges: Array<ResolversTypes['FragranceRequestEdge']> }>>;
  FragranceRequestEdge: ResolverTypeWrapper<Partial<Omit<FragranceRequestEdge, 'node'> & { node: ResolversTypes['FragranceRequest'] }>>;
  FragranceRequestNote: ResolverTypeWrapper<Partial<Omit<FragranceRequestNote, 'note'> & { note: ResolversTypes['Note'] }>>;
  FragranceRequestTrait: ResolverTypeWrapper<Partial<FragranceRequestTrait>>;
  FragranceReview: ResolverTypeWrapper<IFragranceReviewSummary>;
  FragranceReviewConnection: ResolverTypeWrapper<Partial<Omit<FragranceReviewConnection, 'edges'> & { edges: Array<ResolversTypes['FragranceReviewEdge']> }>>;
  FragranceReviewEdge: ResolverTypeWrapper<Partial<Omit<FragranceReviewEdge, 'node'> & { node: ResolversTypes['FragranceReview'] }>>;
  FragranceReviewInfo: ResolverTypeWrapper<Partial<FragranceReviewInfo>>;
  FragranceReviewInfoDistribution: ResolverTypeWrapper<Partial<FragranceReviewInfoDistribution>>;
  FragranceReviewPaginationInput: ResolverTypeWrapper<Partial<FragranceReviewPaginationInput>>;
  FragranceReviewSortBy: ResolverTypeWrapper<Partial<FragranceReviewSortBy>>;
  FragranceReviewSortInput: ResolverTypeWrapper<Partial<FragranceReviewSortInput>>;
  FragranceSortBy: ResolverTypeWrapper<Partial<FragranceSortBy>>;
  FragranceSortInput: ResolverTypeWrapper<Partial<FragranceSortInput>>;
  FragranceStatus: ResolverTypeWrapper<Partial<FragranceStatus>>;
  FragranceTrait: ResolverTypeWrapper<Partial<Omit<FragranceTrait, 'fragrance'> & { fragrance: ResolversTypes['Fragrance'] }>>;
  FragranceTraitInput: ResolverTypeWrapper<Partial<FragranceTraitInput>>;
  FragranceTraitVote: ResolverTypeWrapper<Partial<FragranceTraitVote>>;
  FragranceVote: ResolverTypeWrapper<IFragranceVoteSummary>;
  FragranceVoteConnection: ResolverTypeWrapper<Partial<Omit<FragranceVoteConnection, 'edges'> & { edges: Array<ResolversTypes['FragranceVoteEdge']> }>>;
  FragranceVoteEdge: ResolverTypeWrapper<Partial<Omit<FragranceVoteEdge, 'node'> & { node: ResolversTypes['FragranceVote'] }>>;
  FragranceVotePaginationInput: ResolverTypeWrapper<Partial<FragranceVotePaginationInput>>;
  FragranceVoteSortBy: ResolverTypeWrapper<Partial<FragranceVoteSortBy>>;
  FragranceVoteSortInput: ResolverTypeWrapper<Partial<FragranceVoteSortInput>>;
  ID: ResolverTypeWrapper<Partial<Scalars['ID']['output']>>;
  Int: ResolverTypeWrapper<Partial<Scalars['Int']['output']>>;
  JSON: ResolverTypeWrapper<Partial<Scalars['JSON']['output']>>;
  LogInInput: ResolverTypeWrapper<Partial<LogInInput>>;
  MoveFragranceCollectionItemsInput: ResolverTypeWrapper<Partial<MoveFragranceCollectionItemsInput>>;
  MoveFragranceCollectionsInput: ResolverTypeWrapper<Partial<MoveFragranceCollectionsInput>>;
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
  Post: ResolverTypeWrapper<IPost>;
  PostAsset: ResolverTypeWrapper<IPostAsset>;
  PostComment: ResolverTypeWrapper<IPostComment>;
  PostCommentAsset: ResolverTypeWrapper<IPostCommentAsset>;
  PostCommentConnection: ResolverTypeWrapper<Partial<Omit<PostCommentConnection, 'edges'> & { edges: Array<ResolversTypes['PostCommentEdge']> }>>;
  PostCommentEdge: ResolverTypeWrapper<Partial<Omit<PostCommentEdge, 'node'> & { node: ResolversTypes['PostComment'] }>>;
  PostCommentPaginationInput: ResolverTypeWrapper<Partial<PostCommentPaginationInput>>;
  PostCommentSortBy: ResolverTypeWrapper<Partial<PostCommentSortBy>>;
  PostCommentSortInput: ResolverTypeWrapper<Partial<PostCommentSortInput>>;
  PostCommentVote: ResolverTypeWrapper<Partial<Omit<PostCommentVote, 'comment' | 'user'> & { comment: ResolversTypes['PostComment'], user: ResolversTypes['User'] }>>;
  PostCommentVoteConnection: ResolverTypeWrapper<Partial<Omit<PostCommentVoteConnection, 'edges'> & { edges: Array<ResolversTypes['PostCommentVoteEdge']> }>>;
  PostCommentVoteEdge: ResolverTypeWrapper<Partial<Omit<PostCommentVoteEdge, 'node'> & { node: ResolversTypes['PostCommentVote'] }>>;
  PostCommentVotePaginationInput: ResolverTypeWrapper<Partial<PostCommentVotePaginationInput>>;
  PostCommentVoteSortBy: ResolverTypeWrapper<Partial<PostCommentVoteSortBy>>;
  PostCommentVoteSortInput: ResolverTypeWrapper<Partial<PostCommentVoteSortInput>>;
  PostConnection: ResolverTypeWrapper<Partial<Omit<PostConnection, 'edges'> & { edges: Array<ResolversTypes['PostEdge']> }>>;
  PostEdge: ResolverTypeWrapper<Partial<Omit<PostEdge, 'node'> & { node: ResolversTypes['Post'] }>>;
  PostPaginationInput: ResolverTypeWrapper<Partial<PostPaginationInput>>;
  PostSortBy: ResolverTypeWrapper<Partial<PostSortBy>>;
  PostSortInput: ResolverTypeWrapper<Partial<PostSortInput>>;
  PostType: ResolverTypeWrapper<Partial<PostType>>;
  PostVote: ResolverTypeWrapper<Partial<Omit<PostVote, 'post' | 'user'> & { post: ResolversTypes['Post'], user: ResolversTypes['User'] }>>;
  PostVoteConnection: ResolverTypeWrapper<Partial<Omit<PostVoteConnection, 'edges'> & { edges: Array<ResolversTypes['PostVoteEdge']> }>>;
  PostVoteEdge: ResolverTypeWrapper<Partial<Omit<PostVoteEdge, 'node'> & { node: ResolversTypes['PostVote'] }>>;
  PostVotePaginationInput: ResolverTypeWrapper<Partial<PostVotePaginationInput>>;
  PostVoteSortBy: ResolverTypeWrapper<Partial<PostVoteSortBy>>;
  PostVoteSortInput: ResolverTypeWrapper<Partial<PostVoteSortInput>>;
  PresignedUpload: ResolverTypeWrapper<Partial<PresignedUpload>>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  RelationshipStatus: ResolverTypeWrapper<Partial<RelationshipStatus>>;
  RemoveFragranceFromCollectionsInput: ResolverTypeWrapper<Partial<RemoveFragranceFromCollectionsInput>>;
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
  SearchPostCommentConnection: ResolverTypeWrapper<Partial<Omit<SearchPostCommentConnection, 'edges'> & { edges: Array<ResolversTypes['SearchPostCommentEdge']> }>>;
  SearchPostCommentEdge: ResolverTypeWrapper<Partial<Omit<SearchPostCommentEdge, 'node'> & { node: ResolversTypes['PostComment'] }>>;
  SearchPostConnection: ResolverTypeWrapper<Partial<Omit<SearchPostConnection, 'edges'> & { edges: Array<ResolversTypes['SearchPostEdge']> }>>;
  SearchPostEdge: ResolverTypeWrapper<Partial<Omit<SearchPostEdge, 'node'> & { node: ResolversTypes['Post'] }>>;
  SearchSortBy: ResolverTypeWrapper<Partial<SearchSortBy>>;
  SearchSortInput: ResolverTypeWrapper<Partial<SearchSortInput>>;
  SearchUserConnection: ResolverTypeWrapper<Partial<Omit<SearchUserConnection, 'edges'> & { edges: Array<ResolversTypes['SearchUserEdge']> }>>;
  SearchUserEdge: ResolverTypeWrapper<Partial<Omit<SearchUserEdge, 'node'> & { node: ResolversTypes['User'] }>>;
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
  TraitVoteDistribution: ResolverTypeWrapper<Partial<TraitVoteDistribution>>;
  UnfollowUserInput: ResolverTypeWrapper<Partial<UnfollowUserInput>>;
  UpdateAccordRequestInput: ResolverTypeWrapper<Partial<UpdateAccordRequestInput>>;
  UpdateBrandRequestInput: ResolverTypeWrapper<Partial<UpdateBrandRequestInput>>;
  UpdateFragranceCollectionInput: ResolverTypeWrapper<Partial<UpdateFragranceCollectionInput>>;
  UpdateFragranceRequestInput: ResolverTypeWrapper<Partial<UpdateFragranceRequestInput>>;
  UpdateFragranceReviewInput: ResolverTypeWrapper<Partial<UpdateFragranceReviewInput>>;
  UpdateMeInput: ResolverTypeWrapper<Partial<UpdateMeInput>>;
  UpdateNoteRequestInput: ResolverTypeWrapper<Partial<UpdateNoteRequestInput>>;
  UpdatePostAssetInput: ResolverTypeWrapper<Partial<UpdatePostAssetInput>>;
  UpdatePostCommentInput: ResolverTypeWrapper<Partial<UpdatePostCommentInput>>;
  UpdatePostInput: ResolverTypeWrapper<Partial<UpdatePostInput>>;
  User: ResolverTypeWrapper<IUserSummary>;
  UserFollow: ResolverTypeWrapper<IUserFollowSummary>;
  UserFollowConnection: ResolverTypeWrapper<Partial<Omit<UserFollowConnection, 'edges'> & { edges: Array<ResolversTypes['UserFollowEdge']> }>>;
  UserFollowEdge: ResolverTypeWrapper<Partial<Omit<UserFollowEdge, 'node'> & { node: ResolversTypes['UserFollow'] }>>;
  UserFollowPaginationInput: ResolverTypeWrapper<Partial<UserFollowPaginationInput>>;
  UserFollowSortBy: ResolverTypeWrapper<Partial<UserFollowSortBy>>;
  UserFollowSortInput: ResolverTypeWrapper<Partial<UserFollowSortInput>>;
  VoteInfo: ResolverTypeWrapper<Partial<VoteInfo>>;
  VoteOnAccordRequestInput: ResolverTypeWrapper<Partial<VoteOnAccordRequestInput>>;
  VoteOnBrandInput: ResolverTypeWrapper<Partial<VoteOnBrandInput>>;
  VoteOnBrandRequestInput: ResolverTypeWrapper<Partial<VoteOnBrandRequestInput>>;
  VoteOnFragranceAccordInput: ResolverTypeWrapper<Partial<VoteOnFragranceAccordInput>>;
  VoteOnFragranceInput: ResolverTypeWrapper<Partial<VoteOnFragranceInput>>;
  VoteOnFragranceNoteInput: ResolverTypeWrapper<Partial<VoteOnFragranceNoteInput>>;
  VoteOnFragranceRequestInput: ResolverTypeWrapper<Partial<VoteOnFragranceRequestInput>>;
  VoteOnFragranceReviewInput: ResolverTypeWrapper<Partial<VoteOnFragranceReviewInput>>;
  VoteOnFragranceTraitInput: ResolverTypeWrapper<Partial<VoteOnFragranceTraitInput>>;
  VoteOnNoteRequestInput: ResolverTypeWrapper<Partial<VoteOnNoteRequestInput>>;
  VoteOnPostCommentInput: ResolverTypeWrapper<Partial<VoteOnPostCommentInput>>;
  VoteOnPostInput: ResolverTypeWrapper<Partial<VoteOnPostInput>>;
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
  AddFragranceToCollectionsInput: Partial<AddFragranceToCollectionsInput>;
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
  ChangePasswordInput: Partial<ChangePasswordInput>;
  ConfirmForgotPasswordInput: Partial<ConfirmForgotPasswordInput>;
  ConfirmSignUpInput: Partial<ConfirmSignUpInput>;
  CreateAccordEditInput: Partial<CreateAccordEditInput>;
  CreateAccordRequestInput: Partial<CreateAccordRequestInput>;
  CreateBrandEditInput: Partial<CreateBrandEditInput>;
  CreateBrandRequestInput: Partial<CreateBrandRequestInput>;
  CreateFragranceCollectionInput: Partial<CreateFragranceCollectionInput>;
  CreateFragranceCollectionItemInput: Partial<CreateFragranceCollectionItemInput>;
  CreateFragranceEditInput: Partial<CreateFragranceEditInput>;
  CreateFragranceReportInput: Partial<CreateFragranceReportInput>;
  CreateFragranceRequestInput: Partial<CreateFragranceRequestInput>;
  CreateFragranceReviewInput: Partial<CreateFragranceReviewInput>;
  CreateNoteEditInput: Partial<CreateNoteEditInput>;
  CreateNoteRequestInput: Partial<CreateNoteRequestInput>;
  CreatePostAssetInput: Partial<CreatePostAssetInput>;
  CreatePostCommentAssetInput: Partial<CreatePostCommentAssetInput>;
  CreatePostCommentInput: Partial<CreatePostCommentInput>;
  CreatePostInput: Partial<CreatePostInput>;
  Date: Partial<Scalars['Date']['output']>;
  DeleteAccordRequestInput: Partial<DeleteAccordRequestInput>;
  DeleteAssetInput: Partial<DeleteAssetInput>;
  DeleteBrandRequestInput: Partial<DeleteBrandRequestInput>;
  DeleteFragranceCollectionInput: Partial<DeleteFragranceCollectionInput>;
  DeleteFragranceCollectionItemInput: Partial<DeleteFragranceCollectionItemInput>;
  DeleteFragranceRequestInput: Partial<DeleteFragranceRequestInput>;
  DeleteFragranceReviewInput: Partial<DeleteFragranceReviewInput>;
  DeleteNoteRequestInput: Partial<DeleteNoteRequestInput>;
  DeletePostCommentInput: Partial<DeletePostCommentInput>;
  DeletePostInput: Partial<DeletePostInput>;
  EditJob: Partial<EditJob>;
  Float: Partial<Scalars['Float']['output']>;
  FollowUserInput: Partial<FollowUserInput>;
  ForgotPasswordInput: Partial<ForgotPasswordInput>;
  Fragrance: IFragranceSummary;
  FragranceAccord: Partial<FragranceAccord>;
  FragranceAccordConnection: Partial<FragranceAccordConnection>;
  FragranceAccordEdge: Partial<FragranceAccordEdge>;
  FragranceAccordPaginationInput: Partial<FragranceAccordPaginationInput>;
  FragranceAccordSortInput: Partial<FragranceAccordSortInput>;
  FragranceCollection: IFragranceCollectionSummary;
  FragranceCollectionConnection: Partial<Omit<FragranceCollectionConnection, 'edges'> & { edges: Array<ResolversParentTypes['FragranceCollectionEdge']> }>;
  FragranceCollectionEdge: Partial<Omit<FragranceCollectionEdge, 'node'> & { node: ResolversParentTypes['FragranceCollection'] }>;
  FragranceCollectionInfo: Partial<FragranceCollectionInfo>;
  FragranceCollectionItem: IFragranceCollectionItemSummary;
  FragranceCollectionItemConnection: Partial<Omit<FragranceCollectionItemConnection, 'edges'> & { edges: Array<ResolversParentTypes['FragranceCollectionItemEdge']> }>;
  FragranceCollectionItemEdge: Partial<Omit<FragranceCollectionItemEdge, 'node'> & { node: ResolversParentTypes['FragranceCollectionItem'] }>;
  FragranceCollectionItemPaginationInput: Partial<FragranceCollectionItemPaginationInput>;
  FragranceCollectionItemSortInput: Partial<FragranceCollectionItemSortInput>;
  FragranceCollectionPaginationInput: Partial<FragranceCollectionPaginationInput>;
  FragranceCollectionSortInput: Partial<FragranceCollectionSortInput>;
  FragranceConnection: Partial<Omit<FragranceConnection, 'edges'> & { edges: Array<ResolversParentTypes['FragranceEdge']> }>;
  FragranceEdge: Partial<Omit<FragranceEdge, 'node'> & { node: ResolversParentTypes['Fragrance'] }>;
  FragranceEdit: IFragranceEditSummary;
  FragranceEditConnection: Partial<Omit<FragranceEditConnection, 'edges'> & { edges: Array<ResolversParentTypes['FragranceEditEdge']> }>;
  FragranceEditEdge: Partial<Omit<FragranceEditEdge, 'node'> & { node: ResolversParentTypes['FragranceEdit'] }>;
  FragranceEditPaginationInput: Partial<FragranceEditPaginationInput>;
  FragranceEditSortInput: Partial<FragranceEditSortInput>;
  FragranceImage: IFragranceImageSummary;
  FragranceImageConnection: Partial<Omit<FragranceImageConnection, 'edges'> & { edges: Array<ResolversParentTypes['FragranceImageEdge']> }>;
  FragranceImageEdge: Partial<Omit<FragranceImageEdge, 'node'> & { node: ResolversParentTypes['FragranceImage'] }>;
  FragranceNote: Partial<Omit<FragranceNote, 'note'> & { note: ResolversParentTypes['Note'] }>;
  FragranceNoteConnection: Partial<Omit<FragranceNoteConnection, 'edges'> & { edges: Array<ResolversParentTypes['FragranceNoteEdge']> }>;
  FragranceNoteEdge: Partial<Omit<FragranceNoteEdge, 'node'> & { node: ResolversParentTypes['FragranceNote'] }>;
  FragranceNotePaginationInput: Partial<FragranceNotePaginationInput>;
  FragranceNoteSortInput: Partial<FragranceNoteSortInput>;
  FragrancePaginationInput: Partial<FragrancePaginationInput>;
  FragranceReport: Partial<FragranceReport>;
  FragranceRequest: IFragranceRequestSummary;
  FragranceRequestConnection: Partial<Omit<FragranceRequestConnection, 'edges'> & { edges: Array<ResolversParentTypes['FragranceRequestEdge']> }>;
  FragranceRequestEdge: Partial<Omit<FragranceRequestEdge, 'node'> & { node: ResolversParentTypes['FragranceRequest'] }>;
  FragranceRequestNote: Partial<Omit<FragranceRequestNote, 'note'> & { note: ResolversParentTypes['Note'] }>;
  FragranceRequestTrait: Partial<FragranceRequestTrait>;
  FragranceReview: IFragranceReviewSummary;
  FragranceReviewConnection: Partial<Omit<FragranceReviewConnection, 'edges'> & { edges: Array<ResolversParentTypes['FragranceReviewEdge']> }>;
  FragranceReviewEdge: Partial<Omit<FragranceReviewEdge, 'node'> & { node: ResolversParentTypes['FragranceReview'] }>;
  FragranceReviewInfo: Partial<FragranceReviewInfo>;
  FragranceReviewInfoDistribution: Partial<FragranceReviewInfoDistribution>;
  FragranceReviewPaginationInput: Partial<FragranceReviewPaginationInput>;
  FragranceReviewSortInput: Partial<FragranceReviewSortInput>;
  FragranceSortInput: Partial<FragranceSortInput>;
  FragranceTrait: Partial<Omit<FragranceTrait, 'fragrance'> & { fragrance: ResolversParentTypes['Fragrance'] }>;
  FragranceTraitInput: Partial<FragranceTraitInput>;
  FragranceTraitVote: Partial<FragranceTraitVote>;
  FragranceVote: IFragranceVoteSummary;
  FragranceVoteConnection: Partial<Omit<FragranceVoteConnection, 'edges'> & { edges: Array<ResolversParentTypes['FragranceVoteEdge']> }>;
  FragranceVoteEdge: Partial<Omit<FragranceVoteEdge, 'node'> & { node: ResolversParentTypes['FragranceVote'] }>;
  FragranceVotePaginationInput: Partial<FragranceVotePaginationInput>;
  FragranceVoteSortInput: Partial<FragranceVoteSortInput>;
  ID: Partial<Scalars['ID']['output']>;
  Int: Partial<Scalars['Int']['output']>;
  JSON: Partial<Scalars['JSON']['output']>;
  LogInInput: Partial<LogInInput>;
  MoveFragranceCollectionItemsInput: Partial<MoveFragranceCollectionItemsInput>;
  MoveFragranceCollectionsInput: Partial<MoveFragranceCollectionsInput>;
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
  Post: IPost;
  PostAsset: IPostAsset;
  PostComment: IPostComment;
  PostCommentAsset: IPostCommentAsset;
  PostCommentConnection: Partial<Omit<PostCommentConnection, 'edges'> & { edges: Array<ResolversParentTypes['PostCommentEdge']> }>;
  PostCommentEdge: Partial<Omit<PostCommentEdge, 'node'> & { node: ResolversParentTypes['PostComment'] }>;
  PostCommentPaginationInput: Partial<PostCommentPaginationInput>;
  PostCommentSortInput: Partial<PostCommentSortInput>;
  PostCommentVote: Partial<Omit<PostCommentVote, 'comment' | 'user'> & { comment: ResolversParentTypes['PostComment'], user: ResolversParentTypes['User'] }>;
  PostCommentVoteConnection: Partial<Omit<PostCommentVoteConnection, 'edges'> & { edges: Array<ResolversParentTypes['PostCommentVoteEdge']> }>;
  PostCommentVoteEdge: Partial<Omit<PostCommentVoteEdge, 'node'> & { node: ResolversParentTypes['PostCommentVote'] }>;
  PostCommentVotePaginationInput: Partial<PostCommentVotePaginationInput>;
  PostCommentVoteSortInput: Partial<PostCommentVoteSortInput>;
  PostConnection: Partial<Omit<PostConnection, 'edges'> & { edges: Array<ResolversParentTypes['PostEdge']> }>;
  PostEdge: Partial<Omit<PostEdge, 'node'> & { node: ResolversParentTypes['Post'] }>;
  PostPaginationInput: Partial<PostPaginationInput>;
  PostSortInput: Partial<PostSortInput>;
  PostVote: Partial<Omit<PostVote, 'post' | 'user'> & { post: ResolversParentTypes['Post'], user: ResolversParentTypes['User'] }>;
  PostVoteConnection: Partial<Omit<PostVoteConnection, 'edges'> & { edges: Array<ResolversParentTypes['PostVoteEdge']> }>;
  PostVoteEdge: Partial<Omit<PostVoteEdge, 'node'> & { node: ResolversParentTypes['PostVote'] }>;
  PostVotePaginationInput: Partial<PostVotePaginationInput>;
  PostVoteSortInput: Partial<PostVoteSortInput>;
  PresignedUpload: Partial<PresignedUpload>;
  Query: Record<PropertyKey, never>;
  RemoveFragranceFromCollectionsInput: Partial<RemoveFragranceFromCollectionsInput>;
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
  SearchPostCommentConnection: Partial<Omit<SearchPostCommentConnection, 'edges'> & { edges: Array<ResolversParentTypes['SearchPostCommentEdge']> }>;
  SearchPostCommentEdge: Partial<Omit<SearchPostCommentEdge, 'node'> & { node: ResolversParentTypes['PostComment'] }>;
  SearchPostConnection: Partial<Omit<SearchPostConnection, 'edges'> & { edges: Array<ResolversParentTypes['SearchPostEdge']> }>;
  SearchPostEdge: Partial<Omit<SearchPostEdge, 'node'> & { node: ResolversParentTypes['Post'] }>;
  SearchSortInput: Partial<SearchSortInput>;
  SearchUserConnection: Partial<Omit<SearchUserConnection, 'edges'> & { edges: Array<ResolversParentTypes['SearchUserEdge']> }>;
  SearchUserEdge: Partial<Omit<SearchUserEdge, 'node'> & { node: ResolversParentTypes['User'] }>;
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
  TraitVoteDistribution: Partial<TraitVoteDistribution>;
  UnfollowUserInput: Partial<UnfollowUserInput>;
  UpdateAccordRequestInput: Partial<UpdateAccordRequestInput>;
  UpdateBrandRequestInput: Partial<UpdateBrandRequestInput>;
  UpdateFragranceCollectionInput: Partial<UpdateFragranceCollectionInput>;
  UpdateFragranceRequestInput: Partial<UpdateFragranceRequestInput>;
  UpdateFragranceReviewInput: Partial<UpdateFragranceReviewInput>;
  UpdateMeInput: Partial<UpdateMeInput>;
  UpdateNoteRequestInput: Partial<UpdateNoteRequestInput>;
  UpdatePostAssetInput: Partial<UpdatePostAssetInput>;
  UpdatePostCommentInput: Partial<UpdatePostCommentInput>;
  UpdatePostInput: Partial<UpdatePostInput>;
  User: IUserSummary;
  UserFollow: IUserFollowSummary;
  UserFollowConnection: Partial<Omit<UserFollowConnection, 'edges'> & { edges: Array<ResolversParentTypes['UserFollowEdge']> }>;
  UserFollowEdge: Partial<Omit<UserFollowEdge, 'node'> & { node: ResolversParentTypes['UserFollow'] }>;
  UserFollowPaginationInput: Partial<UserFollowPaginationInput>;
  UserFollowSortInput: Partial<UserFollowSortInput>;
  VoteInfo: Partial<VoteInfo>;
  VoteOnAccordRequestInput: Partial<VoteOnAccordRequestInput>;
  VoteOnBrandInput: Partial<VoteOnBrandInput>;
  VoteOnBrandRequestInput: Partial<VoteOnBrandRequestInput>;
  VoteOnFragranceAccordInput: Partial<VoteOnFragranceAccordInput>;
  VoteOnFragranceInput: Partial<VoteOnFragranceInput>;
  VoteOnFragranceNoteInput: Partial<VoteOnFragranceNoteInput>;
  VoteOnFragranceRequestInput: Partial<VoteOnFragranceRequestInput>;
  VoteOnFragranceReviewInput: Partial<VoteOnFragranceReviewInput>;
  VoteOnFragranceTraitInput: Partial<VoteOnFragranceTraitInput>;
  VoteOnNoteRequestInput: Partial<VoteOnNoteRequestInput>;
  VoteOnPostCommentInput: Partial<VoteOnPostCommentInput>;
  VoteOnPostInput: Partial<VoteOnPostInput>;
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
  contentType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  s3Key?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sizeBytes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
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
  myAccords?: Resolver<Array<ResolversTypes['Accord']>, ParentType, ContextType>;
  myNotes?: Resolver<Array<ResolversTypes['Note']>, ParentType, ContextType, RequireFields<FragranceMyNotesArgs, 'layer'>>;
  myReview?: Resolver<Maybe<ResolversTypes['FragranceReview']>, ParentType, ContextType>;
  myTraits?: Resolver<Array<ResolversTypes['FragranceTraitVote']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  notes?: Resolver<ResolversTypes['FragranceNoteConnection'], ParentType, ContextType, Partial<FragranceNotesArgs>>;
  releaseYear?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  reviewInfo?: Resolver<ResolversTypes['FragranceReviewInfo'], ParentType, ContextType>;
  reviews?: Resolver<ResolversTypes['FragranceReviewConnection'], ParentType, ContextType, Partial<FragranceReviewsArgs>>;
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

export type FragranceCollectionResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['FragranceCollection'] = ResolversParentTypes['FragranceCollection']> = ResolversObject<{
  hasFragrance?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<FragranceCollectionHasFragranceArgs, 'fragranceId'>>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  info?: Resolver<ResolversTypes['FragranceCollectionInfo'], ParentType, ContextType>;
  items?: Resolver<ResolversTypes['FragranceCollectionItemConnection'], ParentType, ContextType, Partial<FragranceCollectionItemsArgs>>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  previewItems?: Resolver<Array<ResolversTypes['FragranceCollectionItem']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
}>;

export type FragranceCollectionConnectionResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['FragranceCollectionConnection'] = ResolversParentTypes['FragranceCollectionConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['FragranceCollectionEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
}>;

export type FragranceCollectionEdgeResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['FragranceCollectionEdge'] = ResolversParentTypes['FragranceCollectionEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['FragranceCollection'], ParentType, ContextType>;
}>;

export type FragranceCollectionInfoResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['FragranceCollectionInfo'] = ResolversParentTypes['FragranceCollectionInfo']> = ResolversObject<{
  itemCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type FragranceCollectionItemResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['FragranceCollectionItem'] = ResolversParentTypes['FragranceCollectionItem']> = ResolversObject<{
  collection?: Resolver<ResolversTypes['FragranceCollection'], ParentType, ContextType>;
  fragrance?: Resolver<ResolversTypes['Fragrance'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
}>;

export type FragranceCollectionItemConnectionResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['FragranceCollectionItemConnection'] = ResolversParentTypes['FragranceCollectionItemConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['FragranceCollectionItemEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
}>;

export type FragranceCollectionItemEdgeResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['FragranceCollectionItemEdge'] = ResolversParentTypes['FragranceCollectionItemEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['FragranceCollectionItem'], ParentType, ContextType>;
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

export type FragranceReportResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['FragranceReport'] = ResolversParentTypes['FragranceReport']> = ResolversObject<{
  body?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
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

export type FragranceReviewResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['FragranceReview'] = ResolversParentTypes['FragranceReview']> = ResolversObject<{
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  body?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fragrance?: Resolver<ResolversTypes['Fragrance'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  rating?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  votes?: Resolver<ResolversTypes['VoteInfo'], ParentType, ContextType>;
}>;

export type FragranceReviewConnectionResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['FragranceReviewConnection'] = ResolversParentTypes['FragranceReviewConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['FragranceReviewEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
}>;

export type FragranceReviewEdgeResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['FragranceReviewEdge'] = ResolversParentTypes['FragranceReviewEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['FragranceReview'], ParentType, ContextType>;
}>;

export type FragranceReviewInfoResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['FragranceReviewInfo'] = ResolversParentTypes['FragranceReviewInfo']> = ResolversObject<{
  averageRating?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  distribution?: Resolver<Array<ResolversTypes['FragranceReviewInfoDistribution']>, ParentType, ContextType>;
}>;

export type FragranceReviewInfoDistributionResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['FragranceReviewInfoDistribution'] = ResolversParentTypes['FragranceReviewInfoDistribution']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  rating?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type FragranceTraitResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['FragranceTrait'] = ResolversParentTypes['FragranceTrait']> = ResolversObject<{
  fragrance?: Resolver<ResolversTypes['Fragrance'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  myVote?: Resolver<Maybe<ResolversTypes['FragranceTraitVote']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  options?: Resolver<Array<ResolversTypes['TraitOption']>, ParentType, ContextType>;
  stats?: Resolver<ResolversTypes['TraitStats'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['TraitTypeEnum'], ParentType, ContextType>;
  typeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
}>;

export type FragranceTraitVoteResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['FragranceTraitVote'] = ResolversParentTypes['FragranceTraitVote']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  option?: Resolver<Maybe<ResolversTypes['TraitOption']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['TraitTypeEnum'], ParentType, ContextType>;
}>;

export type FragranceVoteResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['FragranceVote'] = ResolversParentTypes['FragranceVote']> = ResolversObject<{
  fragrance?: Resolver<ResolversTypes['Fragrance'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  vote?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type FragranceVoteConnectionResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['FragranceVoteConnection'] = ResolversParentTypes['FragranceVoteConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['FragranceVoteEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
}>;

export type FragranceVoteEdgeResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['FragranceVoteEdge'] = ResolversParentTypes['FragranceVoteEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['FragranceVote'], ParentType, ContextType>;
}>;

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type MutationResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  addFragranceToCollections?: Resolver<Array<ResolversTypes['FragranceCollectionItem']>, ParentType, ContextType, RequireFields<MutationAddFragranceToCollectionsArgs, 'input'>>;
  changePassword?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationChangePasswordArgs, 'input'>>;
  confirmForgotPassword?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationConfirmForgotPasswordArgs, 'input'>>;
  confirmSignUp?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationConfirmSignUpArgs, 'input'>>;
  createAccordEdit?: Resolver<ResolversTypes['AccordEdit'], ParentType, ContextType, RequireFields<MutationCreateAccordEditArgs, 'input'>>;
  createAccordRequest?: Resolver<ResolversTypes['AccordRequest'], ParentType, ContextType, Partial<MutationCreateAccordRequestArgs>>;
  createBrandEdit?: Resolver<ResolversTypes['BrandEdit'], ParentType, ContextType, RequireFields<MutationCreateBrandEditArgs, 'input'>>;
  createBrandRequest?: Resolver<ResolversTypes['BrandRequest'], ParentType, ContextType, Partial<MutationCreateBrandRequestArgs>>;
  createFragranceCollection?: Resolver<ResolversTypes['FragranceCollection'], ParentType, ContextType, RequireFields<MutationCreateFragranceCollectionArgs, 'input'>>;
  createFragranceCollectionItem?: Resolver<ResolversTypes['FragranceCollectionItem'], ParentType, ContextType, RequireFields<MutationCreateFragranceCollectionItemArgs, 'input'>>;
  createFragranceEdit?: Resolver<ResolversTypes['FragranceEdit'], ParentType, ContextType, RequireFields<MutationCreateFragranceEditArgs, 'input'>>;
  createFragranceReport?: Resolver<ResolversTypes['FragranceReport'], ParentType, ContextType, RequireFields<MutationCreateFragranceReportArgs, 'input'>>;
  createFragranceRequest?: Resolver<ResolversTypes['FragranceRequest'], ParentType, ContextType, Partial<MutationCreateFragranceRequestArgs>>;
  createFragranceReview?: Resolver<ResolversTypes['FragranceReview'], ParentType, ContextType, RequireFields<MutationCreateFragranceReviewArgs, 'input'>>;
  createNoteEdit?: Resolver<ResolversTypes['NoteEdit'], ParentType, ContextType, RequireFields<MutationCreateNoteEditArgs, 'input'>>;
  createNoteRequest?: Resolver<ResolversTypes['NoteRequest'], ParentType, ContextType, Partial<MutationCreateNoteRequestArgs>>;
  createPost?: Resolver<ResolversTypes['Post'], ParentType, ContextType, RequireFields<MutationCreatePostArgs, 'input'>>;
  createPostComment?: Resolver<ResolversTypes['PostComment'], ParentType, ContextType, RequireFields<MutationCreatePostCommentArgs, 'input'>>;
  deleteAccordRequest?: Resolver<ResolversTypes['AccordRequest'], ParentType, ContextType, RequireFields<MutationDeleteAccordRequestArgs, 'input'>>;
  deleteAsset?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteAssetArgs, 'input'>>;
  deleteBrandRequest?: Resolver<ResolversTypes['BrandRequest'], ParentType, ContextType, RequireFields<MutationDeleteBrandRequestArgs, 'input'>>;
  deleteFragranceCollection?: Resolver<ResolversTypes['FragranceCollection'], ParentType, ContextType, RequireFields<MutationDeleteFragranceCollectionArgs, 'input'>>;
  deleteFragranceCollectionItem?: Resolver<ResolversTypes['FragranceCollectionItem'], ParentType, ContextType, RequireFields<MutationDeleteFragranceCollectionItemArgs, 'input'>>;
  deleteFragranceRequest?: Resolver<ResolversTypes['FragranceRequest'], ParentType, ContextType, RequireFields<MutationDeleteFragranceRequestArgs, 'input'>>;
  deleteFragranceReview?: Resolver<ResolversTypes['FragranceReview'], ParentType, ContextType, RequireFields<MutationDeleteFragranceReviewArgs, 'input'>>;
  deleteNoteRequest?: Resolver<ResolversTypes['NoteRequest'], ParentType, ContextType, RequireFields<MutationDeleteNoteRequestArgs, 'input'>>;
  deletePost?: Resolver<ResolversTypes['Post'], ParentType, ContextType, RequireFields<MutationDeletePostArgs, 'input'>>;
  deletePostComment?: Resolver<ResolversTypes['PostComment'], ParentType, ContextType, RequireFields<MutationDeletePostCommentArgs, 'input'>>;
  follow?: Resolver<ResolversTypes['UserFollow'], ParentType, ContextType, RequireFields<MutationFollowArgs, 'input'>>;
  forgotPassword?: Resolver<ResolversTypes['AuthDeliveryResult'], ParentType, ContextType, RequireFields<MutationForgotPasswordArgs, 'input'>>;
  logIn?: Resolver<ResolversTypes['AuthTokenPayload'], ParentType, ContextType, RequireFields<MutationLogInArgs, 'input'>>;
  logOut?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  moveFragranceCollectionItems?: Resolver<Array<ResolversTypes['FragranceCollectionItem']>, ParentType, ContextType, RequireFields<MutationMoveFragranceCollectionItemsArgs, 'input'>>;
  moveFragranceCollections?: Resolver<Array<ResolversTypes['FragranceCollection']>, ParentType, ContextType, RequireFields<MutationMoveFragranceCollectionsArgs, 'input'>>;
  refresh?: Resolver<Maybe<ResolversTypes['AuthTokenPayload']>, ParentType, ContextType>;
  removeFragranceFromCollections?: Resolver<Array<ResolversTypes['FragranceCollectionItem']>, ParentType, ContextType, RequireFields<MutationRemoveFragranceFromCollectionsArgs, 'input'>>;
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
  unfollow?: Resolver<ResolversTypes['UserFollow'], ParentType, ContextType, RequireFields<MutationUnfollowArgs, 'input'>>;
  updateAccordRequest?: Resolver<ResolversTypes['AccordRequest'], ParentType, ContextType, RequireFields<MutationUpdateAccordRequestArgs, 'input'>>;
  updateBrandRequest?: Resolver<ResolversTypes['BrandRequest'], ParentType, ContextType, RequireFields<MutationUpdateBrandRequestArgs, 'input'>>;
  updateFragranceCollection?: Resolver<ResolversTypes['FragranceCollection'], ParentType, ContextType, RequireFields<MutationUpdateFragranceCollectionArgs, 'input'>>;
  updateFragranceRequest?: Resolver<ResolversTypes['FragranceRequest'], ParentType, ContextType, RequireFields<MutationUpdateFragranceRequestArgs, 'input'>>;
  updateFragranceReview?: Resolver<ResolversTypes['FragranceReview'], ParentType, ContextType, RequireFields<MutationUpdateFragranceReviewArgs, 'input'>>;
  updateMe?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateMeArgs, 'input'>>;
  updateNoteRequest?: Resolver<ResolversTypes['NoteRequest'], ParentType, ContextType, RequireFields<MutationUpdateNoteRequestArgs, 'input'>>;
  updatePost?: Resolver<ResolversTypes['Post'], ParentType, ContextType, RequireFields<MutationUpdatePostArgs, 'input'>>;
  updatePostComment?: Resolver<ResolversTypes['PostComment'], ParentType, ContextType, RequireFields<MutationUpdatePostCommentArgs, 'input'>>;
  voteOnAccordRequest?: Resolver<ResolversTypes['AccordRequest'], ParentType, ContextType, RequireFields<MutationVoteOnAccordRequestArgs, 'input'>>;
  voteOnBrand?: Resolver<ResolversTypes['Brand'], ParentType, ContextType, RequireFields<MutationVoteOnBrandArgs, 'input'>>;
  voteOnBrandRequest?: Resolver<ResolversTypes['BrandRequest'], ParentType, ContextType, RequireFields<MutationVoteOnBrandRequestArgs, 'input'>>;
  voteOnFragrance?: Resolver<ResolversTypes['Fragrance'], ParentType, ContextType, RequireFields<MutationVoteOnFragranceArgs, 'input'>>;
  voteOnFragranceAccord?: Resolver<ResolversTypes['Accord'], ParentType, ContextType, RequireFields<MutationVoteOnFragranceAccordArgs, 'input'>>;
  voteOnFragranceNote?: Resolver<ResolversTypes['Note'], ParentType, ContextType, RequireFields<MutationVoteOnFragranceNoteArgs, 'input'>>;
  voteOnFragranceRequest?: Resolver<ResolversTypes['FragranceRequest'], ParentType, ContextType, RequireFields<MutationVoteOnFragranceRequestArgs, 'input'>>;
  voteOnFragranceReview?: Resolver<ResolversTypes['FragranceReview'], ParentType, ContextType, RequireFields<MutationVoteOnFragranceReviewArgs, 'input'>>;
  voteOnFragranceTrait?: Resolver<ResolversTypes['FragranceTraitVote'], ParentType, ContextType, RequireFields<MutationVoteOnFragranceTraitArgs, 'input'>>;
  voteOnNoteRequest?: Resolver<ResolversTypes['NoteRequest'], ParentType, ContextType, RequireFields<MutationVoteOnNoteRequestArgs, 'input'>>;
  voteOnPost?: Resolver<ResolversTypes['Post'], ParentType, ContextType, RequireFields<MutationVoteOnPostArgs, 'input'>>;
  voteOnPostComment?: Resolver<ResolversTypes['PostComment'], ParentType, ContextType, RequireFields<MutationVoteOnPostCommentArgs, 'input'>>;
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

export type PostResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post']> = ResolversObject<{
  assets?: Resolver<Array<ResolversTypes['PostAsset']>, ParentType, ContextType>;
  commentCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  comments?: Resolver<ResolversTypes['PostCommentConnection'], ParentType, ContextType, Partial<PostCommentsArgs>>;
  content?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fragrance?: Resolver<Maybe<ResolversTypes['Fragrance']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  searchComments?: Resolver<ResolversTypes['SearchPostCommentConnection'], ParentType, ContextType, Partial<PostSearchCommentsArgs>>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['PostType'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  votes?: Resolver<ResolversTypes['VoteInfo'], ParentType, ContextType>;
}>;

export type PostAssetResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['PostAsset'] = ResolversParentTypes['PostAsset']> = ResolversObject<{
  asset?: Resolver<ResolversTypes['Asset'], ParentType, ContextType>;
  displayOrder?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  post?: Resolver<ResolversTypes['Post'], ParentType, ContextType>;
}>;

export type PostCommentResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['PostComment'] = ResolversParentTypes['PostComment']> = ResolversObject<{
  assets?: Resolver<Array<ResolversTypes['PostCommentAsset']>, ParentType, ContextType>;
  commentCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  comments?: Resolver<ResolversTypes['PostCommentConnection'], ParentType, ContextType, Partial<PostCommentCommentsArgs>>;
  content?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  depth?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  parent?: Resolver<Maybe<ResolversTypes['PostComment']>, ParentType, ContextType>;
  post?: Resolver<ResolversTypes['Post'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  votes?: Resolver<ResolversTypes['VoteInfo'], ParentType, ContextType>;
}>;

export type PostCommentAssetResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['PostCommentAsset'] = ResolversParentTypes['PostCommentAsset']> = ResolversObject<{
  PostComment?: Resolver<ResolversTypes['PostComment'], ParentType, ContextType>;
  asset?: Resolver<ResolversTypes['Asset'], ParentType, ContextType>;
  displayOrder?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
}>;

export type PostCommentConnectionResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['PostCommentConnection'] = ResolversParentTypes['PostCommentConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['PostCommentEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
}>;

export type PostCommentEdgeResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['PostCommentEdge'] = ResolversParentTypes['PostCommentEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['PostComment'], ParentType, ContextType>;
}>;

export type PostCommentVoteResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['PostCommentVote'] = ResolversParentTypes['PostCommentVote']> = ResolversObject<{
  comment?: Resolver<ResolversTypes['PostComment'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  vote?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type PostCommentVoteConnectionResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['PostCommentVoteConnection'] = ResolversParentTypes['PostCommentVoteConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['PostCommentVoteEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
}>;

export type PostCommentVoteEdgeResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['PostCommentVoteEdge'] = ResolversParentTypes['PostCommentVoteEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['PostCommentVote'], ParentType, ContextType>;
}>;

export type PostConnectionResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['PostConnection'] = ResolversParentTypes['PostConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['PostEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
}>;

export type PostEdgeResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['PostEdge'] = ResolversParentTypes['PostEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Post'], ParentType, ContextType>;
}>;

export type PostVoteResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['PostVote'] = ResolversParentTypes['PostVote']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  post?: Resolver<ResolversTypes['Post'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  vote?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type PostVoteConnectionResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['PostVoteConnection'] = ResolversParentTypes['PostVoteConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['PostVoteEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
}>;

export type PostVoteEdgeResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['PostVoteEdge'] = ResolversParentTypes['PostVoteEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['PostVote'], ParentType, ContextType>;
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
  fragranceCollection?: Resolver<ResolversTypes['FragranceCollection'], ParentType, ContextType, RequireFields<QueryFragranceCollectionArgs, 'id'>>;
  fragranceCollections?: Resolver<ResolversTypes['FragranceCollectionConnection'], ParentType, ContextType, Partial<QueryFragranceCollectionsArgs>>;
  fragranceEdit?: Resolver<ResolversTypes['FragranceEdit'], ParentType, ContextType, RequireFields<QueryFragranceEditArgs, 'id'>>;
  fragranceEdits?: Resolver<ResolversTypes['FragranceEditConnection'], ParentType, ContextType, Partial<QueryFragranceEditsArgs>>;
  fragranceRequest?: Resolver<ResolversTypes['FragranceRequest'], ParentType, ContextType, RequireFields<QueryFragranceRequestArgs, 'id'>>;
  fragranceRequests?: Resolver<ResolversTypes['FragranceRequestConnection'], ParentType, ContextType, Partial<QueryFragranceRequestsArgs>>;
  fragrances?: Resolver<ResolversTypes['FragranceConnection'], ParentType, ContextType, Partial<QueryFragrancesArgs>>;
  healthy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  me?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  note?: Resolver<ResolversTypes['Note'], ParentType, ContextType, RequireFields<QueryNoteArgs, 'id'>>;
  noteEdit?: Resolver<ResolversTypes['NoteEdit'], ParentType, ContextType, RequireFields<QueryNoteEditArgs, 'id'>>;
  noteEdits?: Resolver<ResolversTypes['NoteEditConnection'], ParentType, ContextType, Partial<QueryNoteEditsArgs>>;
  noteRequest?: Resolver<ResolversTypes['NoteRequest'], ParentType, ContextType, RequireFields<QueryNoteRequestArgs, 'id'>>;
  noteRequests?: Resolver<ResolversTypes['NoteRequestConnection'], ParentType, ContextType, Partial<QueryNoteRequestsArgs>>;
  notes?: Resolver<ResolversTypes['NoteConnection'], ParentType, ContextType, Partial<QueryNotesArgs>>;
  post?: Resolver<ResolversTypes['Post'], ParentType, ContextType, RequireFields<QueryPostArgs, 'id'>>;
  postComment?: Resolver<ResolversTypes['PostComment'], ParentType, ContextType, RequireFields<QueryPostCommentArgs, 'id'>>;
  postComments?: Resolver<ResolversTypes['PostCommentConnection'], ParentType, ContextType, Partial<QueryPostCommentsArgs>>;
  posts?: Resolver<ResolversTypes['PostConnection'], ParentType, ContextType, Partial<QueryPostsArgs>>;
  searchAccords?: Resolver<ResolversTypes['SearchAccordConnection'], ParentType, ContextType, Partial<QuerySearchAccordsArgs>>;
  searchBrands?: Resolver<ResolversTypes['SearchBrandConnection'], ParentType, ContextType, Partial<QuerySearchBrandsArgs>>;
  searchFragrances?: Resolver<ResolversTypes['SearchFragranceConnection'], ParentType, ContextType, Partial<QuerySearchFragrancesArgs>>;
  searchNotes?: Resolver<ResolversTypes['SearchNoteConnection'], ParentType, ContextType, Partial<QuerySearchNotesArgs>>;
  searchPosts?: Resolver<ResolversTypes['SearchPostConnection'], ParentType, ContextType, Partial<QuerySearchPostsArgs>>;
  searchUsers?: Resolver<ResolversTypes['SearchUserConnection'], ParentType, ContextType, Partial<QuerySearchUsersArgs>>;
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

export type SearchPostCommentConnectionResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['SearchPostCommentConnection'] = ResolversParentTypes['SearchPostCommentConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['SearchPostCommentEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['SearchPageInfo'], ParentType, ContextType>;
}>;

export type SearchPostCommentEdgeResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['SearchPostCommentEdge'] = ResolversParentTypes['SearchPostCommentEdge']> = ResolversObject<{
  node?: Resolver<ResolversTypes['PostComment'], ParentType, ContextType>;
  offset?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type SearchPostConnectionResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['SearchPostConnection'] = ResolversParentTypes['SearchPostConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['SearchPostEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['SearchPageInfo'], ParentType, ContextType>;
}>;

export type SearchPostEdgeResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['SearchPostEdge'] = ResolversParentTypes['SearchPostEdge']> = ResolversObject<{
  node?: Resolver<ResolversTypes['Post'], ParentType, ContextType>;
  offset?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type SearchUserConnectionResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['SearchUserConnection'] = ResolversParentTypes['SearchUserConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['SearchUserEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['SearchPageInfo'], ParentType, ContextType>;
}>;

export type SearchUserEdgeResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['SearchUserEdge'] = ResolversParentTypes['SearchUserEdge']> = ResolversObject<{
  node?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  offset?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
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

export type TraitVoteDistributionResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['TraitVoteDistribution'] = ResolversParentTypes['TraitVoteDistribution']> = ResolversObject<{
  option?: Resolver<ResolversTypes['TraitOption'], ParentType, ContextType>;
  votes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  accordRequests?: Resolver<ResolversTypes['AccordRequestConnection'], ParentType, ContextType, Partial<UserAccordRequestsArgs>>;
  avatar?: Resolver<Maybe<ResolversTypes['Asset']>, ParentType, ContextType>;
  brandRequests?: Resolver<ResolversTypes['BrandRequestConnection'], ParentType, ContextType, Partial<UserBrandRequestsArgs>>;
  collection?: Resolver<ResolversTypes['FragranceCollection'], ParentType, ContextType, RequireFields<UserCollectionArgs, 'id'>>;
  collections?: Resolver<ResolversTypes['FragranceCollectionConnection'], ParentType, ContextType, Partial<UserCollectionsArgs>>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  followerCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  followers?: Resolver<ResolversTypes['UserFollowConnection'], ParentType, ContextType, Partial<UserFollowersArgs>>;
  following?: Resolver<ResolversTypes['UserFollowConnection'], ParentType, ContextType, Partial<UserFollowingArgs>>;
  followingCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  fragranceRequests?: Resolver<ResolversTypes['FragranceRequestConnection'], ParentType, ContextType, Partial<UserFragranceRequestsArgs>>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  likes?: Resolver<ResolversTypes['FragranceVoteConnection'], ParentType, ContextType, Partial<UserLikesArgs>>;
  noteRequests?: Resolver<ResolversTypes['NoteRequestConnection'], ParentType, ContextType, Partial<UserNoteRequestsArgs>>;
  posts?: Resolver<ResolversTypes['PostConnection'], ParentType, ContextType, Partial<UserPostsArgs>>;
  relationship?: Resolver<ResolversTypes['RelationshipStatus'], ParentType, ContextType>;
  review?: Resolver<ResolversTypes['FragranceReview'], ParentType, ContextType, RequireFields<UserReviewArgs, 'id'>>;
  reviews?: Resolver<ResolversTypes['FragranceReviewConnection'], ParentType, ContextType, Partial<UserReviewsArgs>>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type UserFollowResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['UserFollow'] = ResolversParentTypes['UserFollow']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
}>;

export type UserFollowConnectionResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['UserFollowConnection'] = ResolversParentTypes['UserFollowConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['UserFollowEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
}>;

export type UserFollowEdgeResolvers<ContextType = ServerContext, ParentType extends ResolversParentTypes['UserFollowEdge'] = ResolversParentTypes['UserFollowEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['UserFollow'], ParentType, ContextType>;
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
  FragranceCollection?: FragranceCollectionResolvers<ContextType>;
  FragranceCollectionConnection?: FragranceCollectionConnectionResolvers<ContextType>;
  FragranceCollectionEdge?: FragranceCollectionEdgeResolvers<ContextType>;
  FragranceCollectionInfo?: FragranceCollectionInfoResolvers<ContextType>;
  FragranceCollectionItem?: FragranceCollectionItemResolvers<ContextType>;
  FragranceCollectionItemConnection?: FragranceCollectionItemConnectionResolvers<ContextType>;
  FragranceCollectionItemEdge?: FragranceCollectionItemEdgeResolvers<ContextType>;
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
  FragranceReport?: FragranceReportResolvers<ContextType>;
  FragranceRequest?: FragranceRequestResolvers<ContextType>;
  FragranceRequestConnection?: FragranceRequestConnectionResolvers<ContextType>;
  FragranceRequestEdge?: FragranceRequestEdgeResolvers<ContextType>;
  FragranceRequestNote?: FragranceRequestNoteResolvers<ContextType>;
  FragranceRequestTrait?: FragranceRequestTraitResolvers<ContextType>;
  FragranceReview?: FragranceReviewResolvers<ContextType>;
  FragranceReviewConnection?: FragranceReviewConnectionResolvers<ContextType>;
  FragranceReviewEdge?: FragranceReviewEdgeResolvers<ContextType>;
  FragranceReviewInfo?: FragranceReviewInfoResolvers<ContextType>;
  FragranceReviewInfoDistribution?: FragranceReviewInfoDistributionResolvers<ContextType>;
  FragranceTrait?: FragranceTraitResolvers<ContextType>;
  FragranceTraitVote?: FragranceTraitVoteResolvers<ContextType>;
  FragranceVote?: FragranceVoteResolvers<ContextType>;
  FragranceVoteConnection?: FragranceVoteConnectionResolvers<ContextType>;
  FragranceVoteEdge?: FragranceVoteEdgeResolvers<ContextType>;
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
  Post?: PostResolvers<ContextType>;
  PostAsset?: PostAssetResolvers<ContextType>;
  PostComment?: PostCommentResolvers<ContextType>;
  PostCommentAsset?: PostCommentAssetResolvers<ContextType>;
  PostCommentConnection?: PostCommentConnectionResolvers<ContextType>;
  PostCommentEdge?: PostCommentEdgeResolvers<ContextType>;
  PostCommentVote?: PostCommentVoteResolvers<ContextType>;
  PostCommentVoteConnection?: PostCommentVoteConnectionResolvers<ContextType>;
  PostCommentVoteEdge?: PostCommentVoteEdgeResolvers<ContextType>;
  PostConnection?: PostConnectionResolvers<ContextType>;
  PostEdge?: PostEdgeResolvers<ContextType>;
  PostVote?: PostVoteResolvers<ContextType>;
  PostVoteConnection?: PostVoteConnectionResolvers<ContextType>;
  PostVoteEdge?: PostVoteEdgeResolvers<ContextType>;
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
  SearchPostCommentConnection?: SearchPostCommentConnectionResolvers<ContextType>;
  SearchPostCommentEdge?: SearchPostCommentEdgeResolvers<ContextType>;
  SearchPostConnection?: SearchPostConnectionResolvers<ContextType>;
  SearchPostEdge?: SearchPostEdgeResolvers<ContextType>;
  SearchUserConnection?: SearchUserConnectionResolvers<ContextType>;
  SearchUserEdge?: SearchUserEdgeResolvers<ContextType>;
  TraitOption?: TraitOptionResolvers<ContextType>;
  TraitStats?: TraitStatsResolvers<ContextType>;
  TraitVoteDistribution?: TraitVoteDistributionResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserFollow?: UserFollowResolvers<ContextType>;
  UserFollowConnection?: UserFollowConnectionResolvers<ContextType>;
  UserFollowEdge?: UserFollowEdgeResolvers<ContextType>;
  VoteInfo?: VoteInfoResolvers<ContextType>;
}>;

