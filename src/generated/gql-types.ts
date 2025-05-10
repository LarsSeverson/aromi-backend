import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { FragranceSummary, FragranceSummaryEdge, FragranceReviewSummary, FragranceReviewSummaryEdge } from '../schemas/fragrance/mappers';
import { UserSummary } from '../schemas/user/mappers';
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
};

export type AccordsInput = {
  fill?: InputMaybe<Scalars['Boolean']['input']>;
  pagination?: InputMaybe<PaginationInput>;
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
  expiresAt: Scalars['Int']['output'];
  idToken: Scalars['String']['output'];
};

export type CodeDeliveryDetails = {
  __typename?: 'CodeDeliveryDetails';
  attribute?: Maybe<Scalars['String']['output']>;
  destination?: Maybe<Scalars['String']['output']>;
  method?: Maybe<Scalars['String']['output']>;
};

export type CreateCollectionInput = {
  name: Scalars['String']['input'];
};

export type Fragrance = {
  __typename?: 'Fragrance';
  accords: FragranceAccordConnection;
  audit: Audit;
  brand: Scalars['String']['output'];
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
  input?: InputMaybe<AccordsInput>;
};


export type FragranceImagesArgs = {
  input?: InputMaybe<PaginationInput>;
};


export type FragranceReviewsArgs = {
  input?: InputMaybe<PaginationInput>;
};

export type FragranceAccord = {
  __typename?: 'FragranceAccord';
  accordId: Scalars['Int']['output'];
  audit: Audit;
  color: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  myVote?: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
  votes: Scalars['Int']['output'];
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
  id: Scalars['Int']['output'];
  src: Scalars['String']['output'];
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
  id: Scalars['Int']['output'];
  layer: NoteLayer;
  myVote?: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
  noteId: Scalars['Int']['output'];
  votes: Scalars['Int']['output'];
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
  middle: FragranceNoteConnection;
  top: FragranceNoteConnection;
};


export type FragranceNotesBaseArgs = {
  input?: InputMaybe<NotesInput>;
};


export type FragranceNotesMiddleArgs = {
  input?: InputMaybe<NotesInput>;
};


export type FragranceNotesTopArgs = {
  input?: InputMaybe<NotesInput>;
};

export type FragranceReview = {
  __typename?: 'FragranceReview';
  audit: Audit;
  id: Scalars['Int']['output'];
  rating: Scalars['Int']['output'];
  review: Scalars['String']['output'];
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
  myVote?: Maybe<Scalars['Float']['output']>;
  type: FragranceTraitType;
  value: Scalars['Float']['output'];
};

export enum FragranceTraitType {
  Allure = 'ALLURE',
  Balance = 'BALANCE',
  Complexity = 'COMPLEXITY',
  Gender = 'GENDER',
  Longevity = 'LONGEVITY',
  Sillage = 'SILLAGE'
}

export type Mutation = {
  __typename?: 'Mutation';
  confirmForgotPassword: Scalars['Boolean']['output'];
  confirmSignUp: Scalars['Boolean']['output'];
  createCollection?: Maybe<UserCollection>;
  forgotPassword: Scalars['Boolean']['output'];
  logIn: AuthPayload;
  logOut: Scalars['Boolean']['output'];
  refresh?: Maybe<AuthPayload>;
  resendSignUpConfirmationCode: Scalars['Boolean']['output'];
  signUp: SignUpResult;
};


export type MutationConfirmForgotPasswordArgs = {
  confirmationCode: Scalars['String']['input'];
  email: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};


export type MutationConfirmSignUpArgs = {
  confirmationCode: Scalars['String']['input'];
  email: Scalars['String']['input'];
};


export type MutationCreateCollectionArgs = {
  input: CreateCollectionInput;
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String']['input'];
};


export type MutationLogInArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationResendSignUpConfirmationCodeArgs = {
  email: Scalars['String']['input'];
};


export type MutationSignUpArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export enum NoteLayer {
  Base = 'BASE',
  Middle = 'MIDDLE',
  Top = 'TOP'
}

export type NotesInput = {
  fill?: InputMaybe<Scalars['Boolean']['input']>;
  layers?: InputMaybe<Array<NoteLayer>>;
  pagination?: InputMaybe<PaginationInput>;
};

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
  fragrance?: Maybe<Fragrance>;
  fragrances: FragranceConnection;
  me?: Maybe<User>;
  user?: Maybe<User>;
};


export type QueryFragranceArgs = {
  id: Scalars['Int']['input'];
};


export type QueryFragrancesArgs = {
  input?: InputMaybe<PaginationInput>;
};


export type QueryUserArgs = {
  id: Scalars['Int']['input'];
};

export type SignUpResult = {
  __typename?: 'SignUpResult';
  complete: Scalars['Boolean']['output'];
  delivery?: Maybe<CodeDeliveryDetails>;
};

export enum SortBy {
  CreatedAt = 'createdAt',
  Id = 'id',
  UpdatedAt = 'updatedAt'
}

export type SortByInput = {
  by?: SortBy;
  direction?: SortDirection;
};

export enum SortDirection {
  Ascending = 'ASCENDING',
  Descending = 'DESCENDING'
}

export type User = {
  __typename?: 'User';
  collections: UserCollectionConnection;
  email: Scalars['String']['output'];
  followerCount: Scalars['Int']['output'];
  followingCount: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  likes: FragranceConnection;
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

export type UserCollection = {
  __typename?: 'UserCollection';
  id: Scalars['Int']['output'];
  items: UserCollectionItemConnection;
  name: Scalars['String']['output'];
  user: User;
};


export type UserCollectionItemsArgs = {
  input?: InputMaybe<PaginationInput>;
};

export type UserCollectionConnection = {
  __typename?: 'UserCollectionConnection';
  edges: Array<UserCollectionEdge>;
  pageInfo: PageInfo;
};

export type UserCollectionEdge = {
  __typename?: 'UserCollectionEdge';
  cursor: Scalars['String']['output'];
  node: UserCollection;
};

export type UserCollectionItem = {
  __typename?: 'UserCollectionItem';
  collection: UserCollection;
  fragrance: Fragrance;
  id: Scalars['Int']['output'];
};

export type UserCollectionItemConnection = {
  __typename?: 'UserCollectionItemConnection';
  edges: Array<UserCollectionItemEdge>;
  pageInfo: PageInfo;
};

export type UserCollectionItemEdge = {
  __typename?: 'UserCollectionItemEdge';
  cursor: Scalars['String']['output'];
  node: UserCollectionItem;
};

export type VoteSummary = {
  __typename?: 'VoteSummary';
  dislikesCount: Scalars['Int']['output'];
  likesCount: Scalars['Int']['output'];
  myVote?: Maybe<Scalars['Boolean']['output']>;
  score: Scalars['Int']['output'];
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
  AccordsInput: ResolverTypeWrapper<Partial<AccordsInput>>;
  Audit: ResolverTypeWrapper<Partial<Audit>>;
  AuthPayload: ResolverTypeWrapper<Partial<AuthPayload>>;
  Boolean: ResolverTypeWrapper<Partial<Scalars['Boolean']['output']>>;
  CodeDeliveryDetails: ResolverTypeWrapper<Partial<CodeDeliveryDetails>>;
  CreateCollectionInput: ResolverTypeWrapper<Partial<CreateCollectionInput>>;
  Date: ResolverTypeWrapper<Partial<Scalars['Date']['output']>>;
  Float: ResolverTypeWrapper<Partial<Scalars['Float']['output']>>;
  Fragrance: ResolverTypeWrapper<FragranceSummary>;
  FragranceAccord: ResolverTypeWrapper<Partial<FragranceAccord>>;
  FragranceAccordConnection: ResolverTypeWrapper<Partial<FragranceAccordConnection>>;
  FragranceAccordEdge: ResolverTypeWrapper<Partial<FragranceAccordEdge>>;
  FragranceConnection: ResolverTypeWrapper<Partial<Omit<FragranceConnection, 'edges'> & { edges: Array<ResolversTypes['FragranceEdge']> }>>;
  FragranceEdge: ResolverTypeWrapper<FragranceSummaryEdge>;
  FragranceImage: ResolverTypeWrapper<Partial<FragranceImage>>;
  FragranceImageConnection: ResolverTypeWrapper<Partial<FragranceImageConnection>>;
  FragranceImageEdge: ResolverTypeWrapper<Partial<FragranceImageEdge>>;
  FragranceNote: ResolverTypeWrapper<Partial<FragranceNote>>;
  FragranceNoteConnection: ResolverTypeWrapper<Partial<FragranceNoteConnection>>;
  FragranceNoteEdge: ResolverTypeWrapper<Partial<FragranceNoteEdge>>;
  FragranceNotes: ResolverTypeWrapper<Partial<FragranceNotes>>;
  FragranceReview: ResolverTypeWrapper<FragranceReviewSummary>;
  FragranceReviewConnection: ResolverTypeWrapper<Partial<Omit<FragranceReviewConnection, 'edges'> & { edges: Array<ResolversTypes['FragranceReviewEdge']> }>>;
  FragranceReviewDistribution: ResolverTypeWrapper<Partial<FragranceReviewDistribution>>;
  FragranceReviewEdge: ResolverTypeWrapper<FragranceReviewSummaryEdge>;
  FragranceTrait: ResolverTypeWrapper<Partial<FragranceTrait>>;
  FragranceTraitType: ResolverTypeWrapper<Partial<FragranceTraitType>>;
  Int: ResolverTypeWrapper<Partial<Scalars['Int']['output']>>;
  Mutation: ResolverTypeWrapper<{}>;
  NoteLayer: ResolverTypeWrapper<Partial<NoteLayer>>;
  NotesInput: ResolverTypeWrapper<Partial<NotesInput>>;
  PageInfo: ResolverTypeWrapper<Partial<PageInfo>>;
  PaginationInput: ResolverTypeWrapper<Partial<PaginationInput>>;
  Query: ResolverTypeWrapper<{}>;
  SignUpResult: ResolverTypeWrapper<Partial<SignUpResult>>;
  SortBy: ResolverTypeWrapper<Partial<SortBy>>;
  SortByInput: ResolverTypeWrapper<Partial<SortByInput>>;
  SortDirection: ResolverTypeWrapper<Partial<SortDirection>>;
  String: ResolverTypeWrapper<Partial<Scalars['String']['output']>>;
  User: ResolverTypeWrapper<UserSummary>;
  UserCollection: ResolverTypeWrapper<Partial<Omit<UserCollection, 'items' | 'user'> & { items: ResolversTypes['UserCollectionItemConnection'], user: ResolversTypes['User'] }>>;
  UserCollectionConnection: ResolverTypeWrapper<Partial<Omit<UserCollectionConnection, 'edges'> & { edges: Array<ResolversTypes['UserCollectionEdge']> }>>;
  UserCollectionEdge: ResolverTypeWrapper<Partial<Omit<UserCollectionEdge, 'node'> & { node: ResolversTypes['UserCollection'] }>>;
  UserCollectionItem: ResolverTypeWrapper<Partial<Omit<UserCollectionItem, 'collection' | 'fragrance'> & { collection: ResolversTypes['UserCollection'], fragrance: ResolversTypes['Fragrance'] }>>;
  UserCollectionItemConnection: ResolverTypeWrapper<Partial<Omit<UserCollectionItemConnection, 'edges'> & { edges: Array<ResolversTypes['UserCollectionItemEdge']> }>>;
  UserCollectionItemEdge: ResolverTypeWrapper<Partial<Omit<UserCollectionItemEdge, 'node'> & { node: ResolversTypes['UserCollectionItem'] }>>;
  VoteSummary: ResolverTypeWrapper<Partial<VoteSummary>>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AccordsInput: Partial<AccordsInput>;
  Audit: Partial<Audit>;
  AuthPayload: Partial<AuthPayload>;
  Boolean: Partial<Scalars['Boolean']['output']>;
  CodeDeliveryDetails: Partial<CodeDeliveryDetails>;
  CreateCollectionInput: Partial<CreateCollectionInput>;
  Date: Partial<Scalars['Date']['output']>;
  Float: Partial<Scalars['Float']['output']>;
  Fragrance: FragranceSummary;
  FragranceAccord: Partial<FragranceAccord>;
  FragranceAccordConnection: Partial<FragranceAccordConnection>;
  FragranceAccordEdge: Partial<FragranceAccordEdge>;
  FragranceConnection: Partial<Omit<FragranceConnection, 'edges'> & { edges: Array<ResolversParentTypes['FragranceEdge']> }>;
  FragranceEdge: FragranceSummaryEdge;
  FragranceImage: Partial<FragranceImage>;
  FragranceImageConnection: Partial<FragranceImageConnection>;
  FragranceImageEdge: Partial<FragranceImageEdge>;
  FragranceNote: Partial<FragranceNote>;
  FragranceNoteConnection: Partial<FragranceNoteConnection>;
  FragranceNoteEdge: Partial<FragranceNoteEdge>;
  FragranceNotes: Partial<FragranceNotes>;
  FragranceReview: FragranceReviewSummary;
  FragranceReviewConnection: Partial<Omit<FragranceReviewConnection, 'edges'> & { edges: Array<ResolversParentTypes['FragranceReviewEdge']> }>;
  FragranceReviewDistribution: Partial<FragranceReviewDistribution>;
  FragranceReviewEdge: FragranceReviewSummaryEdge;
  FragranceTrait: Partial<FragranceTrait>;
  Int: Partial<Scalars['Int']['output']>;
  Mutation: {};
  NotesInput: Partial<NotesInput>;
  PageInfo: Partial<PageInfo>;
  PaginationInput: Partial<PaginationInput>;
  Query: {};
  SignUpResult: Partial<SignUpResult>;
  SortByInput: Partial<SortByInput>;
  String: Partial<Scalars['String']['output']>;
  User: UserSummary;
  UserCollection: Partial<Omit<UserCollection, 'items' | 'user'> & { items: ResolversParentTypes['UserCollectionItemConnection'], user: ResolversParentTypes['User'] }>;
  UserCollectionConnection: Partial<Omit<UserCollectionConnection, 'edges'> & { edges: Array<ResolversParentTypes['UserCollectionEdge']> }>;
  UserCollectionEdge: Partial<Omit<UserCollectionEdge, 'node'> & { node: ResolversParentTypes['UserCollection'] }>;
  UserCollectionItem: Partial<Omit<UserCollectionItem, 'collection' | 'fragrance'> & { collection: ResolversParentTypes['UserCollection'], fragrance: ResolversParentTypes['Fragrance'] }>;
  UserCollectionItemConnection: Partial<Omit<UserCollectionItemConnection, 'edges'> & { edges: Array<ResolversParentTypes['UserCollectionItemEdge']> }>;
  UserCollectionItemEdge: Partial<Omit<UserCollectionItemEdge, 'node'> & { node: ResolversParentTypes['UserCollectionItem'] }>;
  VoteSummary: Partial<VoteSummary>;
}>;

export type AuditResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['Audit'] = ResolversParentTypes['Audit']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  deletedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AuthPayloadResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['AuthPayload'] = ResolversParentTypes['AuthPayload']> = ResolversObject<{
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  expiresAt?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
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

export type FragranceResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['Fragrance'] = ResolversParentTypes['Fragrance']> = ResolversObject<{
  accords?: Resolver<ResolversTypes['FragranceAccordConnection'], ParentType, ContextType, Partial<FragranceAccordsArgs>>;
  audit?: Resolver<ResolversTypes['Audit'], ParentType, ContextType>;
  brand?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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
  myVote?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  votes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
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
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  src?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  layer?: Resolver<ResolversTypes['NoteLayer'], ParentType, ContextType>;
  myVote?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  noteId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  votes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
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
  middle?: Resolver<ResolversTypes['FragranceNoteConnection'], ParentType, ContextType, Partial<FragranceNotesMiddleArgs>>;
  top?: Resolver<ResolversTypes['FragranceNoteConnection'], ParentType, ContextType, Partial<FragranceNotesTopArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceReviewResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['FragranceReview'] = ResolversParentTypes['FragranceReview']> = ResolversObject<{
  audit?: Resolver<ResolversTypes['Audit'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  rating?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  review?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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
  myVote?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['FragranceTraitType'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  confirmForgotPassword?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationConfirmForgotPasswordArgs, 'confirmationCode' | 'email' | 'newPassword'>>;
  confirmSignUp?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationConfirmSignUpArgs, 'confirmationCode' | 'email'>>;
  createCollection?: Resolver<Maybe<ResolversTypes['UserCollection']>, ParentType, ContextType, RequireFields<MutationCreateCollectionArgs, 'input'>>;
  forgotPassword?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationForgotPasswordArgs, 'email'>>;
  logIn?: Resolver<ResolversTypes['AuthPayload'], ParentType, ContextType, RequireFields<MutationLogInArgs, 'email' | 'password'>>;
  logOut?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  refresh?: Resolver<Maybe<ResolversTypes['AuthPayload']>, ParentType, ContextType>;
  resendSignUpConfirmationCode?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationResendSignUpConfirmationCodeArgs, 'email'>>;
  signUp?: Resolver<ResolversTypes['SignUpResult'], ParentType, ContextType, RequireFields<MutationSignUpArgs, 'email' | 'password'>>;
}>;

export type PageInfoResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = ResolversObject<{
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  startCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  fragrance?: Resolver<Maybe<ResolversTypes['Fragrance']>, ParentType, ContextType, RequireFields<QueryFragranceArgs, 'id'>>;
  fragrances?: Resolver<ResolversTypes['FragranceConnection'], ParentType, ContextType, Partial<QueryFragrancesArgs>>;
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
}>;

export type SignUpResultResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['SignUpResult'] = ResolversParentTypes['SignUpResult']> = ResolversObject<{
  complete?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  delivery?: Resolver<Maybe<ResolversTypes['CodeDeliveryDetails']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  collections?: Resolver<ResolversTypes['UserCollectionConnection'], ParentType, ContextType, Partial<UserCollectionsArgs>>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  followerCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  followingCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  likes?: Resolver<ResolversTypes['FragranceConnection'], ParentType, ContextType, Partial<UserLikesArgs>>;
  reviews?: Resolver<ResolversTypes['FragranceReviewConnection'], ParentType, ContextType, Partial<UserReviewsArgs>>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserCollectionResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['UserCollection'] = ResolversParentTypes['UserCollection']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  items?: Resolver<ResolversTypes['UserCollectionItemConnection'], ParentType, ContextType, Partial<UserCollectionItemsArgs>>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserCollectionConnectionResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['UserCollectionConnection'] = ResolversParentTypes['UserCollectionConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['UserCollectionEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserCollectionEdgeResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['UserCollectionEdge'] = ResolversParentTypes['UserCollectionEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['UserCollection'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserCollectionItemResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['UserCollectionItem'] = ResolversParentTypes['UserCollectionItem']> = ResolversObject<{
  collection?: Resolver<ResolversTypes['UserCollection'], ParentType, ContextType>;
  fragrance?: Resolver<ResolversTypes['Fragrance'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserCollectionItemConnectionResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['UserCollectionItemConnection'] = ResolversParentTypes['UserCollectionItemConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['UserCollectionItemEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserCollectionItemEdgeResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['UserCollectionItemEdge'] = ResolversParentTypes['UserCollectionItemEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['UserCollectionItem'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VoteSummaryResolvers<ContextType = ApiContext, ParentType extends ResolversParentTypes['VoteSummary'] = ResolversParentTypes['VoteSummary']> = ResolversObject<{
  dislikesCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  likesCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  myVote?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  score?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = ApiContext> = ResolversObject<{
  Audit?: AuditResolvers<ContextType>;
  AuthPayload?: AuthPayloadResolvers<ContextType>;
  CodeDeliveryDetails?: CodeDeliveryDetailsResolvers<ContextType>;
  Date?: GraphQLScalarType;
  Fragrance?: FragranceResolvers<ContextType>;
  FragranceAccord?: FragranceAccordResolvers<ContextType>;
  FragranceAccordConnection?: FragranceAccordConnectionResolvers<ContextType>;
  FragranceAccordEdge?: FragranceAccordEdgeResolvers<ContextType>;
  FragranceConnection?: FragranceConnectionResolvers<ContextType>;
  FragranceEdge?: FragranceEdgeResolvers<ContextType>;
  FragranceImage?: FragranceImageResolvers<ContextType>;
  FragranceImageConnection?: FragranceImageConnectionResolvers<ContextType>;
  FragranceImageEdge?: FragranceImageEdgeResolvers<ContextType>;
  FragranceNote?: FragranceNoteResolvers<ContextType>;
  FragranceNoteConnection?: FragranceNoteConnectionResolvers<ContextType>;
  FragranceNoteEdge?: FragranceNoteEdgeResolvers<ContextType>;
  FragranceNotes?: FragranceNotesResolvers<ContextType>;
  FragranceReview?: FragranceReviewResolvers<ContextType>;
  FragranceReviewConnection?: FragranceReviewConnectionResolvers<ContextType>;
  FragranceReviewDistribution?: FragranceReviewDistributionResolvers<ContextType>;
  FragranceReviewEdge?: FragranceReviewEdgeResolvers<ContextType>;
  FragranceTrait?: FragranceTraitResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  SignUpResult?: SignUpResultResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserCollection?: UserCollectionResolvers<ContextType>;
  UserCollectionConnection?: UserCollectionConnectionResolvers<ContextType>;
  UserCollectionEdge?: UserCollectionEdgeResolvers<ContextType>;
  UserCollectionItem?: UserCollectionItemResolvers<ContextType>;
  UserCollectionItemConnection?: UserCollectionItemConnectionResolvers<ContextType>;
  UserCollectionItemEdge?: UserCollectionItemEdgeResolvers<ContextType>;
  VoteSummary?: VoteSummaryResolvers<ContextType>;
}>;

