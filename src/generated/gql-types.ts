import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { IFragranceDraftSummary, IFragranceDraftImageSummary } from '../features/fragranceDrafts/types';
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

export type CreateFragranceDraftInput = {
  concentration?: InputMaybe<Concentration>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  releaseYear?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<FragranceStatus>;
};

export type DeleteFragranceDraftImageInput = {
  assetId: Scalars['ID']['input'];
  draftId: Scalars['ID']['input'];
  version: Scalars['Int']['input'];
};

export type DeleteFragranceDraftInput = {
  id: Scalars['ID']['input'];
};

export type Draft = {
  id: Scalars['ID']['output'];
  user: User;
};

export type DraftPaginationInput = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<DraftSortInput>;
};

export const DraftSortBy = {
  Recent: 'RECENT'
} as const;

export type DraftSortBy = typeof DraftSortBy[keyof typeof DraftSortBy];
export type DraftSortInput = {
  by?: InputMaybe<DraftSortBy>;
  direction?: InputMaybe<SortDirection>;
};

export type FinalizeFragranceDraftImageInput = {
  assetId: Scalars['ID']['input'];
  draftId: Scalars['ID']['input'];
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
};

export type FragranceConnection = {
  __typename?: 'FragranceConnection';
  edges: Array<FragranceEdge>;
  pageInfo: PageInfo;
};

export type FragranceDraft = {
  __typename?: 'FragranceDraft';
  concentration?: Maybe<Concentration>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  image?: Maybe<FragranceDraftImage>;
  name?: Maybe<Scalars['String']['output']>;
  releaseYear?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<FragranceStatus>;
  trait: FragranceDraftTrait;
  traits: Array<FragranceDraftTrait>;
  user: User;
  version: Scalars['Int']['output'];
};


export type FragranceDraftTraitArgs = {
  type: TraitTypeEnum;
};

export type FragranceDraftConnection = {
  __typename?: 'FragranceDraftConnection';
  edges: Array<FragranceDraftEdge>;
  pageInfo: PageInfo;
};

export type FragranceDraftEdge = {
  __typename?: 'FragranceDraftEdge';
  cursor: Scalars['String']['output'];
  node: FragranceDraft;
};

export type FragranceDraftImage = {
  __typename?: 'FragranceDraftImage';
  draft: FragranceDraft;
  id: Scalars['ID']['output'];
  type: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type FragranceDraftImageConnection = {
  __typename?: 'FragranceDraftImageConnection';
  edges: Array<FragranceDraftImageEdge>;
  pageInfo: PageInfo;
};

export type FragranceDraftImageEdge = {
  __typename?: 'FragranceDraftImageEdge';
  cursor: Scalars['String']['output'];
  node: FragranceDraftImage;
};

export type FragranceDraftTrait = {
  __typename?: 'FragranceDraftTrait';
  selectedOption?: Maybe<TraitOption>;
  traitType: TraitTypeEnum;
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
  createFragranceDraft: FragranceDraft;
  deleteFragranceDraft: FragranceDraft;
  deleteFragranceDraftImage: FragranceDraft;
  finalizeFragranceDraftImage: FragranceDraft;
  forgotPassword: AuthDeliveryResult;
  logIn: AuthTokenPayload;
  logOut: Scalars['Boolean']['output'];
  refresh?: Maybe<AuthTokenPayload>;
  resendSignUpCode: AuthDeliveryResult;
  signUp: AuthDeliveryResult;
  stageFragranceDraftImage: PresignedUpload;
  updateFragranceDraft: FragranceDraft;
  updateUser: User;
  updateUserAvatar: PresignedUpload;
};


export type MutationConfirmForgotPasswordArgs = {
  input: ConfirmForgotPasswordInput;
};


export type MutationConfirmSignUpArgs = {
  input: ConfirmSignUpInput;
};


export type MutationCreateFragranceDraftArgs = {
  input: CreateFragranceDraftInput;
};


export type MutationDeleteFragranceDraftArgs = {
  input: DeleteFragranceDraftInput;
};


export type MutationDeleteFragranceDraftImageArgs = {
  input: DeleteFragranceDraftImageInput;
};


export type MutationFinalizeFragranceDraftImageArgs = {
  input: FinalizeFragranceDraftImageInput;
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


export type MutationSignUpArgs = {
  input: SignUpInput;
};


export type MutationStageFragranceDraftImageArgs = {
  input: StageAssetInput;
};


export type MutationUpdateFragranceDraftArgs = {
  input: UpdateFragranceDraftInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};


export type MutationUpdateUserAvatarArgs = {
  input: StageAssetInput;
};

export type Note = {
  __typename?: 'Note';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  thumbnailUrl: Scalars['String']['output'];
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

export type NotePaginationInput = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<NoteSortInput>;
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
  accords: AccordConnection;
  fragranceDraft: FragranceDraft;
  fragranceDrafts: FragranceDraftConnection;
  me: User;
  notes: NoteConnection;
  user: User;
};


export type QueryAccordsArgs = {
  input?: InputMaybe<AccordPaginationInput>;
};


export type QueryFragranceDraftArgs = {
  id: Scalars['ID']['input'];
};


export type QueryFragranceDraftsArgs = {
  input?: InputMaybe<DraftPaginationInput>;
};


export type QueryNotesArgs = {
  input?: InputMaybe<NotePaginationInput>;
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export type ResendSignUpCodeInput = {
  email: Scalars['String']['input'];
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

export type UpdateFragranceDraftInput = {
  concentration?: InputMaybe<Concentration>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  releaseYear?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<FragranceStatus>;
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
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  username: Scalars['String']['output'];
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


/** Mapping of interface types */
export type ResolversInterfaceTypes<_RefType extends Record<string, unknown>> = ResolversObject<{
  Draft: never;
}>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Accord: ResolverTypeWrapper<Partial<Accord>>;
  AccordConnection: ResolverTypeWrapper<Partial<AccordConnection>>;
  AccordEdge: ResolverTypeWrapper<Partial<AccordEdge>>;
  AccordPaginationInput: ResolverTypeWrapper<Partial<AccordPaginationInput>>;
  AccordSortBy: ResolverTypeWrapper<Partial<AccordSortBy>>;
  AccordSortInput: ResolverTypeWrapper<Partial<AccordSortInput>>;
  Asset: ResolverTypeWrapper<Partial<Asset>>;
  AuthCodeDeliveryDetails: ResolverTypeWrapper<Partial<AuthCodeDeliveryDetails>>;
  AuthDeliveryResult: ResolverTypeWrapper<Partial<AuthDeliveryResult>>;
  AuthTokenPayload: ResolverTypeWrapper<Partial<AuthTokenPayload>>;
  AvatarStatus: ResolverTypeWrapper<Partial<AvatarStatus>>;
  Boolean: ResolverTypeWrapper<Partial<Scalars['Boolean']['output']>>;
  Concentration: ResolverTypeWrapper<Partial<Concentration>>;
  ConfirmForgotPasswordInput: ResolverTypeWrapper<Partial<ConfirmForgotPasswordInput>>;
  ConfirmSignUpInput: ResolverTypeWrapper<Partial<ConfirmSignUpInput>>;
  CreateFragranceDraftInput: ResolverTypeWrapper<Partial<CreateFragranceDraftInput>>;
  Date: ResolverTypeWrapper<Partial<Scalars['Date']['output']>>;
  DeleteFragranceDraftImageInput: ResolverTypeWrapper<Partial<DeleteFragranceDraftImageInput>>;
  DeleteFragranceDraftInput: ResolverTypeWrapper<Partial<DeleteFragranceDraftInput>>;
  Draft: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Draft']>;
  DraftPaginationInput: ResolverTypeWrapper<Partial<DraftPaginationInput>>;
  DraftSortBy: ResolverTypeWrapper<Partial<DraftSortBy>>;
  DraftSortInput: ResolverTypeWrapper<Partial<DraftSortInput>>;
  FinalizeFragranceDraftImageInput: ResolverTypeWrapper<Partial<FinalizeFragranceDraftImageInput>>;
  Float: ResolverTypeWrapper<Partial<Scalars['Float']['output']>>;
  ForgotPasswordInput: ResolverTypeWrapper<Partial<ForgotPasswordInput>>;
  Fragrance: ResolverTypeWrapper<Partial<Fragrance>>;
  FragranceConnection: ResolverTypeWrapper<Partial<FragranceConnection>>;
  FragranceDraft: ResolverTypeWrapper<IFragranceDraftSummary>;
  FragranceDraftConnection: ResolverTypeWrapper<Partial<Omit<FragranceDraftConnection, 'edges'> & { edges: Array<ResolversTypes['FragranceDraftEdge']> }>>;
  FragranceDraftEdge: ResolverTypeWrapper<Partial<Omit<FragranceDraftEdge, 'node'> & { node: ResolversTypes['FragranceDraft'] }>>;
  FragranceDraftImage: ResolverTypeWrapper<IFragranceDraftImageSummary>;
  FragranceDraftImageConnection: ResolverTypeWrapper<Partial<Omit<FragranceDraftImageConnection, 'edges'> & { edges: Array<ResolversTypes['FragranceDraftImageEdge']> }>>;
  FragranceDraftImageEdge: ResolverTypeWrapper<Partial<Omit<FragranceDraftImageEdge, 'node'> & { node: ResolversTypes['FragranceDraftImage'] }>>;
  FragranceDraftTrait: ResolverTypeWrapper<Partial<FragranceDraftTrait>>;
  FragranceEdge: ResolverTypeWrapper<Partial<FragranceEdge>>;
  FragranceImage: ResolverTypeWrapper<Partial<FragranceImage>>;
  FragranceImageConnection: ResolverTypeWrapper<Partial<FragranceImageConnection>>;
  FragranceImageEdge: ResolverTypeWrapper<Partial<FragranceImageEdge>>;
  FragranceStatus: ResolverTypeWrapper<Partial<FragranceStatus>>;
  ID: ResolverTypeWrapper<Partial<Scalars['ID']['output']>>;
  Int: ResolverTypeWrapper<Partial<Scalars['Int']['output']>>;
  JSON: ResolverTypeWrapper<Partial<Scalars['JSON']['output']>>;
  LogInInput: ResolverTypeWrapper<Partial<LogInInput>>;
  Mutation: ResolverTypeWrapper<{}>;
  Note: ResolverTypeWrapper<Partial<Note>>;
  NoteConnection: ResolverTypeWrapper<Partial<NoteConnection>>;
  NoteEdge: ResolverTypeWrapper<Partial<NoteEdge>>;
  NotePaginationInput: ResolverTypeWrapper<Partial<NotePaginationInput>>;
  NoteSortBy: ResolverTypeWrapper<Partial<NoteSortBy>>;
  NoteSortInput: ResolverTypeWrapper<Partial<NoteSortInput>>;
  PageInfo: ResolverTypeWrapper<Partial<PageInfo>>;
  PresignedUpload: ResolverTypeWrapper<Partial<PresignedUpload>>;
  Query: ResolverTypeWrapper<{}>;
  ResendSignUpCodeInput: ResolverTypeWrapper<Partial<ResendSignUpCodeInput>>;
  SignUpInput: ResolverTypeWrapper<Partial<SignUpInput>>;
  SortDirection: ResolverTypeWrapper<Partial<SortDirection>>;
  StageAssetInput: ResolverTypeWrapper<Partial<StageAssetInput>>;
  String: ResolverTypeWrapper<Partial<Scalars['String']['output']>>;
  Trait: ResolverTypeWrapper<Partial<Trait>>;
  TraitOption: ResolverTypeWrapper<Partial<TraitOption>>;
  TraitStats: ResolverTypeWrapper<Partial<TraitStats>>;
  TraitTypeEnum: ResolverTypeWrapper<Partial<TraitTypeEnum>>;
  TraitVote: ResolverTypeWrapper<Partial<TraitVote>>;
  TraitVoteDistribution: ResolverTypeWrapper<Partial<TraitVoteDistribution>>;
  UpdateFragranceDraftInput: ResolverTypeWrapper<Partial<UpdateFragranceDraftInput>>;
  UpdateUserInput: ResolverTypeWrapper<Partial<UpdateUserInput>>;
  User: ResolverTypeWrapper<Partial<User>>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Accord: Partial<Accord>;
  AccordConnection: Partial<AccordConnection>;
  AccordEdge: Partial<AccordEdge>;
  AccordPaginationInput: Partial<AccordPaginationInput>;
  AccordSortInput: Partial<AccordSortInput>;
  Asset: Partial<Asset>;
  AuthCodeDeliveryDetails: Partial<AuthCodeDeliveryDetails>;
  AuthDeliveryResult: Partial<AuthDeliveryResult>;
  AuthTokenPayload: Partial<AuthTokenPayload>;
  Boolean: Partial<Scalars['Boolean']['output']>;
  ConfirmForgotPasswordInput: Partial<ConfirmForgotPasswordInput>;
  ConfirmSignUpInput: Partial<ConfirmSignUpInput>;
  CreateFragranceDraftInput: Partial<CreateFragranceDraftInput>;
  Date: Partial<Scalars['Date']['output']>;
  DeleteFragranceDraftImageInput: Partial<DeleteFragranceDraftImageInput>;
  DeleteFragranceDraftInput: Partial<DeleteFragranceDraftInput>;
  Draft: ResolversInterfaceTypes<ResolversParentTypes>['Draft'];
  DraftPaginationInput: Partial<DraftPaginationInput>;
  DraftSortInput: Partial<DraftSortInput>;
  FinalizeFragranceDraftImageInput: Partial<FinalizeFragranceDraftImageInput>;
  Float: Partial<Scalars['Float']['output']>;
  ForgotPasswordInput: Partial<ForgotPasswordInput>;
  Fragrance: Partial<Fragrance>;
  FragranceConnection: Partial<FragranceConnection>;
  FragranceDraft: IFragranceDraftSummary;
  FragranceDraftConnection: Partial<Omit<FragranceDraftConnection, 'edges'> & { edges: Array<ResolversParentTypes['FragranceDraftEdge']> }>;
  FragranceDraftEdge: Partial<Omit<FragranceDraftEdge, 'node'> & { node: ResolversParentTypes['FragranceDraft'] }>;
  FragranceDraftImage: IFragranceDraftImageSummary;
  FragranceDraftImageConnection: Partial<Omit<FragranceDraftImageConnection, 'edges'> & { edges: Array<ResolversParentTypes['FragranceDraftImageEdge']> }>;
  FragranceDraftImageEdge: Partial<Omit<FragranceDraftImageEdge, 'node'> & { node: ResolversParentTypes['FragranceDraftImage'] }>;
  FragranceDraftTrait: Partial<FragranceDraftTrait>;
  FragranceEdge: Partial<FragranceEdge>;
  FragranceImage: Partial<FragranceImage>;
  FragranceImageConnection: Partial<FragranceImageConnection>;
  FragranceImageEdge: Partial<FragranceImageEdge>;
  ID: Partial<Scalars['ID']['output']>;
  Int: Partial<Scalars['Int']['output']>;
  JSON: Partial<Scalars['JSON']['output']>;
  LogInInput: Partial<LogInInput>;
  Mutation: {};
  Note: Partial<Note>;
  NoteConnection: Partial<NoteConnection>;
  NoteEdge: Partial<NoteEdge>;
  NotePaginationInput: Partial<NotePaginationInput>;
  NoteSortInput: Partial<NoteSortInput>;
  PageInfo: Partial<PageInfo>;
  PresignedUpload: Partial<PresignedUpload>;
  Query: {};
  ResendSignUpCodeInput: Partial<ResendSignUpCodeInput>;
  SignUpInput: Partial<SignUpInput>;
  StageAssetInput: Partial<StageAssetInput>;
  String: Partial<Scalars['String']['output']>;
  Trait: Partial<Trait>;
  TraitOption: Partial<TraitOption>;
  TraitStats: Partial<TraitStats>;
  TraitVote: Partial<TraitVote>;
  TraitVoteDistribution: Partial<TraitVoteDistribution>;
  UpdateFragranceDraftInput: Partial<UpdateFragranceDraftInput>;
  UpdateUserInput: Partial<UpdateUserInput>;
  User: Partial<User>;
}>;

export type AccordResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['Accord'] = ResolversParentTypes['Accord']> = ResolversObject<{
  color?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
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
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  size?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AuthCodeDeliveryDetailsResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['AuthCodeDeliveryDetails'] = ResolversParentTypes['AuthCodeDeliveryDetails']> = ResolversObject<{
  attribute?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  destination?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  method?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AuthDeliveryResultResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['AuthDeliveryResult'] = ResolversParentTypes['AuthDeliveryResult']> = ResolversObject<{
  delivery?: Resolver<Maybe<ResolversTypes['AuthCodeDeliveryDetails']>, ParentType, ContextType>;
  isComplete?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AuthTokenPayloadResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['AuthTokenPayload'] = ResolversParentTypes['AuthTokenPayload']> = ResolversObject<{
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  expiresIn?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  idToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type DraftResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['Draft'] = ResolversParentTypes['Draft']> = ResolversObject<{
  __resolveType: TypeResolveFn<null, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
}>;

export type FragranceResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['Fragrance'] = ResolversParentTypes['Fragrance']> = ResolversObject<{
  brand?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  concentration?: Resolver<ResolversTypes['Concentration'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  images?: Resolver<ResolversTypes['FragranceImageConnection'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  releaseYear?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['FragranceStatus'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceConnectionResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['FragranceConnection'] = ResolversParentTypes['FragranceConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['FragranceEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceDraftResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['FragranceDraft'] = ResolversParentTypes['FragranceDraft']> = ResolversObject<{
  concentration?: Resolver<Maybe<ResolversTypes['Concentration']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['FragranceDraftImage']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  releaseYear?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['FragranceStatus']>, ParentType, ContextType>;
  trait?: Resolver<ResolversTypes['FragranceDraftTrait'], ParentType, ContextType, RequireFields<FragranceDraftTraitArgs, 'type'>>;
  traits?: Resolver<Array<ResolversTypes['FragranceDraftTrait']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  version?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceDraftConnectionResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['FragranceDraftConnection'] = ResolversParentTypes['FragranceDraftConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['FragranceDraftEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceDraftEdgeResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['FragranceDraftEdge'] = ResolversParentTypes['FragranceDraftEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['FragranceDraft'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceDraftImageResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['FragranceDraftImage'] = ResolversParentTypes['FragranceDraftImage']> = ResolversObject<{
  draft?: Resolver<ResolversTypes['FragranceDraft'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceDraftImageConnectionResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['FragranceDraftImageConnection'] = ResolversParentTypes['FragranceDraftImageConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['FragranceDraftImageEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceDraftImageEdgeResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['FragranceDraftImageEdge'] = ResolversParentTypes['FragranceDraftImageEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['FragranceDraftImage'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceDraftTraitResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['FragranceDraftTrait'] = ResolversParentTypes['FragranceDraftTrait']> = ResolversObject<{
  selectedOption?: Resolver<Maybe<ResolversTypes['TraitOption']>, ParentType, ContextType>;
  traitType?: Resolver<ResolversTypes['TraitTypeEnum'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceEdgeResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['FragranceEdge'] = ResolversParentTypes['FragranceEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Fragrance'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceImageResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['FragranceImage'] = ResolversParentTypes['FragranceImage']> = ResolversObject<{
  bg?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  height?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type MutationResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  confirmForgotPassword?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationConfirmForgotPasswordArgs, 'input'>>;
  confirmSignUp?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationConfirmSignUpArgs, 'input'>>;
  createFragranceDraft?: Resolver<ResolversTypes['FragranceDraft'], ParentType, ContextType, RequireFields<MutationCreateFragranceDraftArgs, 'input'>>;
  deleteFragranceDraft?: Resolver<ResolversTypes['FragranceDraft'], ParentType, ContextType, RequireFields<MutationDeleteFragranceDraftArgs, 'input'>>;
  deleteFragranceDraftImage?: Resolver<ResolversTypes['FragranceDraft'], ParentType, ContextType, RequireFields<MutationDeleteFragranceDraftImageArgs, 'input'>>;
  finalizeFragranceDraftImage?: Resolver<ResolversTypes['FragranceDraft'], ParentType, ContextType, RequireFields<MutationFinalizeFragranceDraftImageArgs, 'input'>>;
  forgotPassword?: Resolver<ResolversTypes['AuthDeliveryResult'], ParentType, ContextType, RequireFields<MutationForgotPasswordArgs, 'input'>>;
  logIn?: Resolver<ResolversTypes['AuthTokenPayload'], ParentType, ContextType, RequireFields<MutationLogInArgs, 'input'>>;
  logOut?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  refresh?: Resolver<Maybe<ResolversTypes['AuthTokenPayload']>, ParentType, ContextType>;
  resendSignUpCode?: Resolver<ResolversTypes['AuthDeliveryResult'], ParentType, ContextType, RequireFields<MutationResendSignUpCodeArgs, 'input'>>;
  signUp?: Resolver<ResolversTypes['AuthDeliveryResult'], ParentType, ContextType, RequireFields<MutationSignUpArgs, 'input'>>;
  stageFragranceDraftImage?: Resolver<ResolversTypes['PresignedUpload'], ParentType, ContextType, RequireFields<MutationStageFragranceDraftImageArgs, 'input'>>;
  updateFragranceDraft?: Resolver<ResolversTypes['FragranceDraft'], ParentType, ContextType, RequireFields<MutationUpdateFragranceDraftArgs, 'input'>>;
  updateUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'input'>>;
  updateUserAvatar?: Resolver<ResolversTypes['PresignedUpload'], ParentType, ContextType, RequireFields<MutationUpdateUserAvatarArgs, 'input'>>;
}>;

export type NoteResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['Note'] = ResolversParentTypes['Note']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  thumbnailUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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

export type PresignedUploadResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['PresignedUpload'] = ResolversParentTypes['PresignedUpload']> = ResolversObject<{
  fields?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  accords?: Resolver<ResolversTypes['AccordConnection'], ParentType, ContextType, Partial<QueryAccordsArgs>>;
  fragranceDraft?: Resolver<ResolversTypes['FragranceDraft'], ParentType, ContextType, RequireFields<QueryFragranceDraftArgs, 'id'>>;
  fragranceDrafts?: Resolver<ResolversTypes['FragranceDraftConnection'], ParentType, ContextType, Partial<QueryFragranceDraftsArgs>>;
  me?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  notes?: Resolver<ResolversTypes['NoteConnection'], ParentType, ContextType, Partial<QueryNotesArgs>>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
}>;

export type TraitResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['Trait'] = ResolversParentTypes['Trait']> = ResolversObject<{
  myVote?: Resolver<Maybe<ResolversTypes['TraitVote']>, ParentType, ContextType>;
  options?: Resolver<Array<ResolversTypes['TraitOption']>, ParentType, ContextType>;
  stats?: Resolver<Maybe<ResolversTypes['TraitStats']>, ParentType, ContextType>;
  traitType?: Resolver<ResolversTypes['TraitTypeEnum'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TraitOptionResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['TraitOption'] = ResolversParentTypes['TraitOption']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  score?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TraitStatsResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['TraitStats'] = ResolversParentTypes['TraitStats']> = ResolversObject<{
  averageScore?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  distribution?: Resolver<Array<ResolversTypes['TraitVoteDistribution']>, ParentType, ContextType>;
  totalVotes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TraitVoteResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['TraitVote'] = ResolversParentTypes['TraitVote']> = ResolversObject<{
  option?: Resolver<ResolversTypes['TraitOption'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TraitVoteDistributionResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['TraitVoteDistribution'] = ResolversParentTypes['TraitVoteDistribution']> = ResolversObject<{
  option?: Resolver<ResolversTypes['TraitOption'], ParentType, ContextType>;
  votes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  avatarSrc?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  avatarStatus?: Resolver<ResolversTypes['AvatarStatus'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = ApiContext> = ResolversObject<{
  Accord?: AccordResolvers<ContextType>;
  AccordConnection?: AccordConnectionResolvers<ContextType>;
  AccordEdge?: AccordEdgeResolvers<ContextType>;
  Asset?: AssetResolvers<ContextType>;
  AuthCodeDeliveryDetails?: AuthCodeDeliveryDetailsResolvers<ContextType>;
  AuthDeliveryResult?: AuthDeliveryResultResolvers<ContextType>;
  AuthTokenPayload?: AuthTokenPayloadResolvers<ContextType>;
  Date?: GraphQLScalarType;
  Draft?: DraftResolvers<ContextType>;
  Fragrance?: FragranceResolvers<ContextType>;
  FragranceConnection?: FragranceConnectionResolvers<ContextType>;
  FragranceDraft?: FragranceDraftResolvers<ContextType>;
  FragranceDraftConnection?: FragranceDraftConnectionResolvers<ContextType>;
  FragranceDraftEdge?: FragranceDraftEdgeResolvers<ContextType>;
  FragranceDraftImage?: FragranceDraftImageResolvers<ContextType>;
  FragranceDraftImageConnection?: FragranceDraftImageConnectionResolvers<ContextType>;
  FragranceDraftImageEdge?: FragranceDraftImageEdgeResolvers<ContextType>;
  FragranceDraftTrait?: FragranceDraftTraitResolvers<ContextType>;
  FragranceEdge?: FragranceEdgeResolvers<ContextType>;
  FragranceImage?: FragranceImageResolvers<ContextType>;
  FragranceImageConnection?: FragranceImageConnectionResolvers<ContextType>;
  FragranceImageEdge?: FragranceImageEdgeResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Note?: NoteResolvers<ContextType>;
  NoteConnection?: NoteConnectionResolvers<ContextType>;
  NoteEdge?: NoteEdgeResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  PresignedUpload?: PresignedUploadResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Trait?: TraitResolvers<ContextType>;
  TraitOption?: TraitOptionResolvers<ContextType>;
  TraitStats?: TraitStatsResolvers<ContextType>;
  TraitVote?: TraitVoteResolvers<ContextType>;
  TraitVoteDistribution?: TraitVoteDistributionResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
}>;

