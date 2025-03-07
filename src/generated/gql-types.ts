import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { Context } from '@src/context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
};

export type CreateCollectionInput = {
  name: Scalars['String']['input'];
};

export type Fragrance = {
  __typename?: 'Fragrance';
  accords: Array<FragranceAccord>;
  brand: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  images: Array<FragranceImage>;
  myReview?: Maybe<FragranceReview>;
  name: Scalars['String']['output'];
  notes: FragranceNotes;
  rating: Scalars['Float']['output'];
  reviewDistribution: FragranceReviewDistribution;
  reviews: Array<FragranceReview>;
  reviewsCount: Scalars['Int']['output'];
  traits: FragranceTraits;
  vote: FragranceVote;
};


export type FragranceAccordsArgs = {
  fill?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type FragranceImagesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type FragranceReviewsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type FragranceAccord = {
  __typename?: 'FragranceAccord';
  accordId: Scalars['Int']['output'];
  color: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  myVote?: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
  votes: Scalars['Int']['output'];
};

export type FragranceCollection = {
  __typename?: 'FragranceCollection';
  dCreated: Scalars['Date']['output'];
  dModified: Scalars['Date']['output'];
  fragrances: Array<Fragrance>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  user: User;
};


export type FragranceCollectionFragrancesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
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

export type FragranceImage = {
  __typename?: 'FragranceImage';
  id: Scalars['Int']['output'];
  url: Scalars['String']['output'];
};

export type FragranceNote = {
  __typename?: 'FragranceNote';
  icon: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  layer: NoteLayer;
  myVote?: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
  noteId: Scalars['Int']['output'];
  votes: Scalars['Int']['output'];
};

export type FragranceNotes = {
  __typename?: 'FragranceNotes';
  base: Array<FragranceNote>;
  fragranceId: Scalars['Int']['output'];
  middle: Array<FragranceNote>;
  top: Array<FragranceNote>;
};


export type FragranceNotesBaseArgs = {
  fill?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type FragranceNotesMiddleArgs = {
  fill?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type FragranceNotesTopArgs = {
  fill?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type FragranceReview = {
  __typename?: 'FragranceReview';
  author: Scalars['String']['output'];
  dCreated: Scalars['Date']['output'];
  dDeleted?: Maybe<Scalars['Date']['output']>;
  dModified: Scalars['Date']['output'];
  id: Scalars['Int']['output'];
  myVote?: Maybe<Scalars['Boolean']['output']>;
  rating: Scalars['Int']['output'];
  review: Scalars['String']['output'];
  votes: Scalars['Int']['output'];
};

export type FragranceReviewDistribution = {
  __typename?: 'FragranceReviewDistribution';
  five: Scalars['Int']['output'];
  four: Scalars['Int']['output'];
  one: Scalars['Int']['output'];
  three: Scalars['Int']['output'];
  two: Scalars['Int']['output'];
};

export type FragranceTrait = {
  __typename?: 'FragranceTrait';
  id: Scalars['Int']['output'];
  myVote?: Maybe<Scalars['Float']['output']>;
  trait: FragranceTraitType;
  value: Scalars['Float']['output'];
};

export enum FragranceTraitType {
  Allure = 'allure',
  Balance = 'balance',
  Complexity = 'complexity',
  Gender = 'gender',
  Longevity = 'longevity',
  Sillage = 'sillage'
}

export type FragranceTraits = {
  __typename?: 'FragranceTraits';
  allure: FragranceTrait;
  balance: FragranceTrait;
  complexity: FragranceTrait;
  fragranceId: Scalars['Int']['output'];
  gender: FragranceTrait;
  longevity: FragranceTrait;
  sillage: FragranceTrait;
};

export type FragranceVote = {
  __typename?: 'FragranceVote';
  dislikes: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  likes: Scalars['Int']['output'];
  myVote?: Maybe<Scalars['Boolean']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addFragranceToCollection?: Maybe<FragranceCollection>;
  createCollection?: Maybe<FragranceCollection>;
  removeFragranceFromCollection?: Maybe<FragranceCollection>;
  reviewFragrance?: Maybe<FragranceReview>;
  upsertUser?: Maybe<User>;
  voteOnAccord?: Maybe<FragranceAccord>;
  voteOnFragrance?: Maybe<FragranceVote>;
  voteOnNote?: Maybe<FragranceNote>;
  voteOnReview?: Maybe<FragranceReview>;
  voteOnTrait?: Maybe<FragranceTrait>;
};


export type MutationAddFragranceToCollectionArgs = {
  collectionId: Scalars['Int']['input'];
  fragranceId: Scalars['Int']['input'];
};


export type MutationCreateCollectionArgs = {
  input: CreateCollectionInput;
};


export type MutationRemoveFragranceFromCollectionArgs = {
  collectionId: Scalars['Int']['input'];
  fragranceId: Scalars['Int']['input'];
};


export type MutationReviewFragranceArgs = {
  fragranceId: Scalars['Int']['input'];
  myRating: Scalars['Int']['input'];
  myReview: Scalars['String']['input'];
};


export type MutationUpsertUserArgs = {
  cognitoId: Scalars['String']['input'];
  email: Scalars['String']['input'];
};


export type MutationVoteOnAccordArgs = {
  accordId: Scalars['Int']['input'];
  fragranceId: Scalars['Int']['input'];
  myVote: Scalars['Boolean']['input'];
};


export type MutationVoteOnFragranceArgs = {
  fragranceId: Scalars['Int']['input'];
  myVote?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationVoteOnNoteArgs = {
  fragranceId: Scalars['Int']['input'];
  layer: NoteLayer;
  myVote: Scalars['Boolean']['input'];
  noteId: Scalars['Int']['input'];
};


export type MutationVoteOnReviewArgs = {
  myVote?: InputMaybe<Scalars['Boolean']['input']>;
  reviewId: Scalars['Int']['input'];
};


export type MutationVoteOnTraitArgs = {
  fragranceId: Scalars['Int']['input'];
  myVote: Scalars['Float']['input'];
  trait: FragranceTraitType;
};

export enum NoteLayer {
  Base = 'base',
  Middle = 'middle',
  Top = 'top'
}

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  fragrance?: Maybe<Fragrance>;
  fragrances?: Maybe<Array<Fragrance>>;
  me?: Maybe<User>;
  user?: Maybe<User>;
};


export type QueryFragranceArgs = {
  id: Scalars['Int']['input'];
};


export type QueryFragrancesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryUserArgs = {
  id: Scalars['Int']['input'];
};

export enum SortBy {
  Created = 'created',
  Id = 'id',
  Updated = 'updated'
}

export type SortByInput = {
  by: SortBy;
  direction?: SortDirection;
};

export enum SortDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type User = {
  __typename?: 'User';
  cognitoId: Scalars['String']['output'];
  collections: FragranceCollectionConnection;
  email: Scalars['String']['output'];
  followers: Scalars['Int']['output'];
  following: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  likes: Array<Fragrance>;
  reviews: Array<FragranceReview>;
  username: Scalars['String']['output'];
};


export type UserCollectionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<SortByInput>;
};


export type UserLikesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type UserReviewsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
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
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CreateCollectionInput: CreateCollectionInput;
  Date: ResolverTypeWrapper<Scalars['Date']['output']>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  Fragrance: ResolverTypeWrapper<Fragrance>;
  FragranceAccord: ResolverTypeWrapper<FragranceAccord>;
  FragranceCollection: ResolverTypeWrapper<FragranceCollection>;
  FragranceCollectionConnection: ResolverTypeWrapper<FragranceCollectionConnection>;
  FragranceCollectionEdge: ResolverTypeWrapper<FragranceCollectionEdge>;
  FragranceImage: ResolverTypeWrapper<FragranceImage>;
  FragranceNote: ResolverTypeWrapper<FragranceNote>;
  FragranceNotes: ResolverTypeWrapper<FragranceNotes>;
  FragranceReview: ResolverTypeWrapper<FragranceReview>;
  FragranceReviewDistribution: ResolverTypeWrapper<FragranceReviewDistribution>;
  FragranceTrait: ResolverTypeWrapper<FragranceTrait>;
  FragranceTraitType: FragranceTraitType;
  FragranceTraits: ResolverTypeWrapper<FragranceTraits>;
  FragranceVote: ResolverTypeWrapper<FragranceVote>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  NoteLayer: NoteLayer;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  Query: ResolverTypeWrapper<{}>;
  SortBy: SortBy;
  SortByInput: SortByInput;
  SortDirection: SortDirection;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  User: ResolverTypeWrapper<User>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean']['output'];
  CreateCollectionInput: CreateCollectionInput;
  Date: Scalars['Date']['output'];
  Float: Scalars['Float']['output'];
  Fragrance: Fragrance;
  FragranceAccord: FragranceAccord;
  FragranceCollection: FragranceCollection;
  FragranceCollectionConnection: FragranceCollectionConnection;
  FragranceCollectionEdge: FragranceCollectionEdge;
  FragranceImage: FragranceImage;
  FragranceNote: FragranceNote;
  FragranceNotes: FragranceNotes;
  FragranceReview: FragranceReview;
  FragranceReviewDistribution: FragranceReviewDistribution;
  FragranceTrait: FragranceTrait;
  FragranceTraits: FragranceTraits;
  FragranceVote: FragranceVote;
  Int: Scalars['Int']['output'];
  Mutation: {};
  PageInfo: PageInfo;
  Query: {};
  SortByInput: SortByInput;
  String: Scalars['String']['output'];
  User: User;
}>;

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type FragranceResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Fragrance'] = ResolversParentTypes['Fragrance']> = ResolversObject<{
  accords?: Resolver<Array<ResolversTypes['FragranceAccord']>, ParentType, ContextType, Partial<FragranceAccordsArgs>>;
  brand?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  images?: Resolver<Array<ResolversTypes['FragranceImage']>, ParentType, ContextType, Partial<FragranceImagesArgs>>;
  myReview?: Resolver<Maybe<ResolversTypes['FragranceReview']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  notes?: Resolver<ResolversTypes['FragranceNotes'], ParentType, ContextType>;
  rating?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  reviewDistribution?: Resolver<ResolversTypes['FragranceReviewDistribution'], ParentType, ContextType>;
  reviews?: Resolver<Array<ResolversTypes['FragranceReview']>, ParentType, ContextType, Partial<FragranceReviewsArgs>>;
  reviewsCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  traits?: Resolver<ResolversTypes['FragranceTraits'], ParentType, ContextType>;
  vote?: Resolver<ResolversTypes['FragranceVote'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceAccordResolvers<ContextType = Context, ParentType extends ResolversParentTypes['FragranceAccord'] = ResolversParentTypes['FragranceAccord']> = ResolversObject<{
  accordId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  color?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  myVote?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  votes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceCollectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['FragranceCollection'] = ResolversParentTypes['FragranceCollection']> = ResolversObject<{
  dCreated?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  dModified?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  fragrances?: Resolver<Array<ResolversTypes['Fragrance']>, ParentType, ContextType, Partial<FragranceCollectionFragrancesArgs>>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceCollectionConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['FragranceCollectionConnection'] = ResolversParentTypes['FragranceCollectionConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['FragranceCollectionEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceCollectionEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['FragranceCollectionEdge'] = ResolversParentTypes['FragranceCollectionEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['FragranceCollection'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceImageResolvers<ContextType = Context, ParentType extends ResolversParentTypes['FragranceImage'] = ResolversParentTypes['FragranceImage']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceNoteResolvers<ContextType = Context, ParentType extends ResolversParentTypes['FragranceNote'] = ResolversParentTypes['FragranceNote']> = ResolversObject<{
  icon?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  layer?: Resolver<ResolversTypes['NoteLayer'], ParentType, ContextType>;
  myVote?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  noteId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  votes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceNotesResolvers<ContextType = Context, ParentType extends ResolversParentTypes['FragranceNotes'] = ResolversParentTypes['FragranceNotes']> = ResolversObject<{
  base?: Resolver<Array<ResolversTypes['FragranceNote']>, ParentType, ContextType, Partial<FragranceNotesBaseArgs>>;
  fragranceId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  middle?: Resolver<Array<ResolversTypes['FragranceNote']>, ParentType, ContextType, Partial<FragranceNotesMiddleArgs>>;
  top?: Resolver<Array<ResolversTypes['FragranceNote']>, ParentType, ContextType, Partial<FragranceNotesTopArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceReviewResolvers<ContextType = Context, ParentType extends ResolversParentTypes['FragranceReview'] = ResolversParentTypes['FragranceReview']> = ResolversObject<{
  author?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  dCreated?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  dDeleted?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  dModified?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  myVote?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  rating?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  review?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  votes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceReviewDistributionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['FragranceReviewDistribution'] = ResolversParentTypes['FragranceReviewDistribution']> = ResolversObject<{
  five?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  four?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  one?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  three?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  two?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceTraitResolvers<ContextType = Context, ParentType extends ResolversParentTypes['FragranceTrait'] = ResolversParentTypes['FragranceTrait']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  myVote?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  trait?: Resolver<ResolversTypes['FragranceTraitType'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceTraitsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['FragranceTraits'] = ResolversParentTypes['FragranceTraits']> = ResolversObject<{
  allure?: Resolver<ResolversTypes['FragranceTrait'], ParentType, ContextType>;
  balance?: Resolver<ResolversTypes['FragranceTrait'], ParentType, ContextType>;
  complexity?: Resolver<ResolversTypes['FragranceTrait'], ParentType, ContextType>;
  fragranceId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  gender?: Resolver<ResolversTypes['FragranceTrait'], ParentType, ContextType>;
  longevity?: Resolver<ResolversTypes['FragranceTrait'], ParentType, ContextType>;
  sillage?: Resolver<ResolversTypes['FragranceTrait'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceVoteResolvers<ContextType = Context, ParentType extends ResolversParentTypes['FragranceVote'] = ResolversParentTypes['FragranceVote']> = ResolversObject<{
  dislikes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  likes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  myVote?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  addFragranceToCollection?: Resolver<Maybe<ResolversTypes['FragranceCollection']>, ParentType, ContextType, RequireFields<MutationAddFragranceToCollectionArgs, 'collectionId' | 'fragranceId'>>;
  createCollection?: Resolver<Maybe<ResolversTypes['FragranceCollection']>, ParentType, ContextType, RequireFields<MutationCreateCollectionArgs, 'input'>>;
  removeFragranceFromCollection?: Resolver<Maybe<ResolversTypes['FragranceCollection']>, ParentType, ContextType, RequireFields<MutationRemoveFragranceFromCollectionArgs, 'collectionId' | 'fragranceId'>>;
  reviewFragrance?: Resolver<Maybe<ResolversTypes['FragranceReview']>, ParentType, ContextType, RequireFields<MutationReviewFragranceArgs, 'fragranceId' | 'myRating' | 'myReview'>>;
  upsertUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationUpsertUserArgs, 'cognitoId' | 'email'>>;
  voteOnAccord?: Resolver<Maybe<ResolversTypes['FragranceAccord']>, ParentType, ContextType, RequireFields<MutationVoteOnAccordArgs, 'accordId' | 'fragranceId' | 'myVote'>>;
  voteOnFragrance?: Resolver<Maybe<ResolversTypes['FragranceVote']>, ParentType, ContextType, RequireFields<MutationVoteOnFragranceArgs, 'fragranceId'>>;
  voteOnNote?: Resolver<Maybe<ResolversTypes['FragranceNote']>, ParentType, ContextType, RequireFields<MutationVoteOnNoteArgs, 'fragranceId' | 'layer' | 'myVote' | 'noteId'>>;
  voteOnReview?: Resolver<Maybe<ResolversTypes['FragranceReview']>, ParentType, ContextType, RequireFields<MutationVoteOnReviewArgs, 'reviewId'>>;
  voteOnTrait?: Resolver<Maybe<ResolversTypes['FragranceTrait']>, ParentType, ContextType, RequireFields<MutationVoteOnTraitArgs, 'fragranceId' | 'myVote' | 'trait'>>;
}>;

export type PageInfoResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = ResolversObject<{
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  startCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  fragrance?: Resolver<Maybe<ResolversTypes['Fragrance']>, ParentType, ContextType, RequireFields<QueryFragranceArgs, 'id'>>;
  fragrances?: Resolver<Maybe<Array<ResolversTypes['Fragrance']>>, ParentType, ContextType, Partial<QueryFragrancesArgs>>;
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
}>;

export type UserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  cognitoId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  collections?: Resolver<ResolversTypes['FragranceCollectionConnection'], ParentType, ContextType, Partial<UserCollectionsArgs>>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  followers?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  following?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  likes?: Resolver<Array<ResolversTypes['Fragrance']>, ParentType, ContextType, Partial<UserLikesArgs>>;
  reviews?: Resolver<Array<ResolversTypes['FragranceReview']>, ParentType, ContextType, Partial<UserReviewsArgs>>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = Context> = ResolversObject<{
  Date?: GraphQLScalarType;
  Fragrance?: FragranceResolvers<ContextType>;
  FragranceAccord?: FragranceAccordResolvers<ContextType>;
  FragranceCollection?: FragranceCollectionResolvers<ContextType>;
  FragranceCollectionConnection?: FragranceCollectionConnectionResolvers<ContextType>;
  FragranceCollectionEdge?: FragranceCollectionEdgeResolvers<ContextType>;
  FragranceImage?: FragranceImageResolvers<ContextType>;
  FragranceNote?: FragranceNoteResolvers<ContextType>;
  FragranceNotes?: FragranceNotesResolvers<ContextType>;
  FragranceReview?: FragranceReviewResolvers<ContextType>;
  FragranceReviewDistribution?: FragranceReviewDistributionResolvers<ContextType>;
  FragranceTrait?: FragranceTraitResolvers<ContextType>;
  FragranceTraits?: FragranceTraitsResolvers<ContextType>;
  FragranceVote?: FragranceVoteResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
}>;

