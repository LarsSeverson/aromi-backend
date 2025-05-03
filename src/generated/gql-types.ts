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

export type Accord = {
  __typename?: 'Accord';
  color: Scalars['String']['output'];
  dCreated: Scalars['Date']['output'];
  dDeleted?: Maybe<Scalars['Date']['output']>;
  dModified: Scalars['Date']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type AccordRequest = {
  __typename?: 'AccordRequest';
  color: Scalars['String']['output'];
  dCreated: Scalars['Date']['output'];
  dDeleted?: Maybe<Scalars['Date']['output']>;
  dModified: Scalars['Date']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  state: State;
  user: User;
};

export type AccordsInput = {
  fill?: InputMaybe<Scalars['Boolean']['input']>;
  pagination?: InputMaybe<PaginationInput>;
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
  brand: Scalars['String']['output'];
  dCreated: Scalars['Date']['output'];
  dModified: Scalars['Date']['output'];
  id: Scalars['Int']['output'];
  images: FragranceImageConnection;
  myReview?: Maybe<FragranceReview>;
  name: Scalars['String']['output'];
  notes: FragranceNotes;
  rating: Scalars['Float']['output'];
  reviewDistribution: FragranceReviewDistribution;
  reviews: FragranceReviewConnection;
  reviewsCount: Scalars['Int']['output'];
  traits: FragranceTraits;
  votes: FragranceVotes;
};


export type FragranceAccordsArgs = {
  input?: InputMaybe<AccordsInput>;
};


export type FragranceImagesArgs = {
  input?: InputMaybe<QueryInput>;
};


export type FragranceReviewsArgs = {
  input?: InputMaybe<QueryInput>;
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
  dCreated: Scalars['Date']['output'];
  dModified: Scalars['Date']['output'];
  id: Scalars['Int']['output'];
  items: FragranceCollectionItemConnection;
  name: Scalars['String']['output'];
  user: User;
};


export type FragranceCollectionItemsArgs = {
  input?: InputMaybe<QueryInput>;
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
  collection: FragranceCollection;
  dCreated: Scalars['Date']['output'];
  dModified: Scalars['Date']['output'];
  fragrance: Fragrance;
  id: Scalars['Int']['output'];
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
  fragranceId: Scalars['Int']['output'];
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
  dCreated: Scalars['Date']['output'];
  dDeleted?: Maybe<Scalars['Date']['output']>;
  dModified: Scalars['Date']['output'];
  fragrance: Fragrance;
  id: Scalars['Int']['output'];
  myVote?: Maybe<Scalars['Boolean']['output']>;
  rating: Scalars['Int']['output'];
  review: Scalars['String']['output'];
  user: User;
  votes: Scalars['Int']['output'];
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

export type FragranceVotes = {
  __typename?: 'FragranceVotes';
  dislikes: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  likes: Scalars['Int']['output'];
  myVote?: Maybe<Scalars['Boolean']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addFragranceToCollection?: Maybe<FragranceCollection>;
  confirmForgotPassword: Scalars['Boolean']['output'];
  confirmSignUp: Scalars['Boolean']['output'];
  createCollection?: Maybe<FragranceCollection>;
  forgotPassword: Scalars['Boolean']['output'];
  logIn: AuthPayload;
  logOut: Scalars['Boolean']['output'];
  refresh?: Maybe<AuthPayload>;
  removeFragranceFromCollection?: Maybe<FragranceCollection>;
  reviewFragrance?: Maybe<FragranceReview>;
  signUp: SignUpResult;
  voteOnAccord?: Maybe<FragranceAccord>;
  voteOnFragrance?: Maybe<FragranceVotes>;
  voteOnNote?: Maybe<FragranceNote>;
  voteOnReview?: Maybe<FragranceReview>;
  voteOnTrait?: Maybe<FragranceTrait>;
};


export type MutationAddFragranceToCollectionArgs = {
  collectionId: Scalars['Int']['input'];
  fragranceId: Scalars['Int']['input'];
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


export type MutationRemoveFragranceFromCollectionArgs = {
  collectionId: Scalars['Int']['input'];
  fragranceId: Scalars['Int']['input'];
};


export type MutationReviewFragranceArgs = {
  fragranceId: Scalars['Int']['input'];
  myRating: Scalars['Int']['input'];
  myReview: Scalars['String']['input'];
};


export type MutationSignUpArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
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

export type Note = {
  __typename?: 'Note';
  dCreated: Scalars['Date']['output'];
  dDeleted?: Maybe<Scalars['Date']['output']>;
  dModified: Scalars['Date']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export enum NoteLayer {
  Base = 'base',
  Middle = 'middle',
  Top = 'top'
}

export type NoteRequest = {
  __typename?: 'NoteRequest';
  dCreated: Scalars['Date']['output'];
  dDeleted?: Maybe<Scalars['Date']['output']>;
  dModified: Scalars['Date']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  state: State;
  url: Scalars['String']['output'];
  user: User;
};

export type NotesInput = {
  fill?: InputMaybe<Scalars['Boolean']['input']>;
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
  accordById?: Maybe<Accord>;
  accordByLikeName?: Maybe<Array<Accord>>;
  accordRequest?: Maybe<AccordRequest>;
  collection?: Maybe<FragranceCollection>;
  fragrance?: Maybe<Fragrance>;
  fragrances: FragranceConnection;
  me?: Maybe<User>;
  noteById?: Maybe<Note>;
  noteByLikeName?: Maybe<Array<Note>>;
  noteRequest?: Maybe<NoteRequest>;
  user?: Maybe<User>;
};


export type QueryAccordByIdArgs = {
  id: Scalars['Int']['input'];
};


export type QueryAccordByLikeNameArgs = {
  name: Scalars['String']['input'];
};


export type QueryAccordRequestArgs = {
  id: Scalars['Int']['input'];
};


export type QueryCollectionArgs = {
  id: Scalars['Int']['input'];
};


export type QueryFragranceArgs = {
  id: Scalars['Int']['input'];
};


export type QueryFragrancesArgs = {
  input?: InputMaybe<QueryInput>;
};


export type QueryNoteByIdArgs = {
  id: Scalars['Int']['input'];
};


export type QueryNoteByLikeNameArgs = {
  name: Scalars['String']['input'];
};


export type QueryNoteRequestArgs = {
  id: Scalars['Int']['input'];
};


export type QueryUserArgs = {
  id: Scalars['Int']['input'];
};

export type QueryInput = {
  pagination?: InputMaybe<PaginationInput>;
};

export type SignUpResult = {
  __typename?: 'SignUpResult';
  complete: Scalars['Boolean']['output'];
  delivery?: Maybe<CodeDeliveryDetails>;
};

export enum SortBy {
  Added = 'added',
  Created = 'created',
  Id = 'id',
  Modified = 'modified',
  Votes = 'votes'
}

export type SortByInput = {
  by: SortBy;
  direction?: SortDirection;
};

export enum SortDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export enum State {
  Approved = 'approved',
  Declined = 'declined',
  Inactive = 'inactive',
  Pending = 'pending'
}

export type User = {
  __typename?: 'User';
  collections: FragranceCollectionConnection;
  email: Scalars['String']['output'];
  followers: Scalars['Int']['output'];
  following: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  likes: FragranceConnection;
  reviews: FragranceReviewConnection;
  username: Scalars['String']['output'];
};


export type UserCollectionsArgs = {
  input?: InputMaybe<QueryInput>;
};


export type UserLikesArgs = {
  input?: InputMaybe<QueryInput>;
};


export type UserReviewsArgs = {
  input?: InputMaybe<QueryInput>;
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
  Accord: ResolverTypeWrapper<Accord>;
  AccordRequest: ResolverTypeWrapper<AccordRequest>;
  AccordsInput: AccordsInput;
  AuthPayload: ResolverTypeWrapper<AuthPayload>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CodeDeliveryDetails: ResolverTypeWrapper<CodeDeliveryDetails>;
  CreateCollectionInput: CreateCollectionInput;
  Date: ResolverTypeWrapper<Scalars['Date']['output']>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  Fragrance: ResolverTypeWrapper<Fragrance>;
  FragranceAccord: ResolverTypeWrapper<FragranceAccord>;
  FragranceAccordConnection: ResolverTypeWrapper<FragranceAccordConnection>;
  FragranceAccordEdge: ResolverTypeWrapper<FragranceAccordEdge>;
  FragranceCollection: ResolverTypeWrapper<FragranceCollection>;
  FragranceCollectionConnection: ResolverTypeWrapper<FragranceCollectionConnection>;
  FragranceCollectionEdge: ResolverTypeWrapper<FragranceCollectionEdge>;
  FragranceCollectionItem: ResolverTypeWrapper<FragranceCollectionItem>;
  FragranceCollectionItemConnection: ResolverTypeWrapper<FragranceCollectionItemConnection>;
  FragranceCollectionItemEdge: ResolverTypeWrapper<FragranceCollectionItemEdge>;
  FragranceConnection: ResolverTypeWrapper<FragranceConnection>;
  FragranceEdge: ResolverTypeWrapper<FragranceEdge>;
  FragranceImage: ResolverTypeWrapper<FragranceImage>;
  FragranceImageConnection: ResolverTypeWrapper<FragranceImageConnection>;
  FragranceImageEdge: ResolverTypeWrapper<FragranceImageEdge>;
  FragranceNote: ResolverTypeWrapper<FragranceNote>;
  FragranceNoteConnection: ResolverTypeWrapper<FragranceNoteConnection>;
  FragranceNoteEdge: ResolverTypeWrapper<FragranceNoteEdge>;
  FragranceNotes: ResolverTypeWrapper<FragranceNotes>;
  FragranceReview: ResolverTypeWrapper<FragranceReview>;
  FragranceReviewConnection: ResolverTypeWrapper<FragranceReviewConnection>;
  FragranceReviewDistribution: ResolverTypeWrapper<FragranceReviewDistribution>;
  FragranceReviewEdge: ResolverTypeWrapper<FragranceReviewEdge>;
  FragranceTrait: ResolverTypeWrapper<FragranceTrait>;
  FragranceTraitType: FragranceTraitType;
  FragranceTraits: ResolverTypeWrapper<FragranceTraits>;
  FragranceVotes: ResolverTypeWrapper<FragranceVotes>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Note: ResolverTypeWrapper<Note>;
  NoteLayer: NoteLayer;
  NoteRequest: ResolverTypeWrapper<NoteRequest>;
  NotesInput: NotesInput;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  PaginationInput: PaginationInput;
  Query: ResolverTypeWrapper<{}>;
  QueryInput: QueryInput;
  SignUpResult: ResolverTypeWrapper<SignUpResult>;
  SortBy: SortBy;
  SortByInput: SortByInput;
  SortDirection: SortDirection;
  State: State;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  User: ResolverTypeWrapper<User>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Accord: Accord;
  AccordRequest: AccordRequest;
  AccordsInput: AccordsInput;
  AuthPayload: AuthPayload;
  Boolean: Scalars['Boolean']['output'];
  CodeDeliveryDetails: CodeDeliveryDetails;
  CreateCollectionInput: CreateCollectionInput;
  Date: Scalars['Date']['output'];
  Float: Scalars['Float']['output'];
  Fragrance: Fragrance;
  FragranceAccord: FragranceAccord;
  FragranceAccordConnection: FragranceAccordConnection;
  FragranceAccordEdge: FragranceAccordEdge;
  FragranceCollection: FragranceCollection;
  FragranceCollectionConnection: FragranceCollectionConnection;
  FragranceCollectionEdge: FragranceCollectionEdge;
  FragranceCollectionItem: FragranceCollectionItem;
  FragranceCollectionItemConnection: FragranceCollectionItemConnection;
  FragranceCollectionItemEdge: FragranceCollectionItemEdge;
  FragranceConnection: FragranceConnection;
  FragranceEdge: FragranceEdge;
  FragranceImage: FragranceImage;
  FragranceImageConnection: FragranceImageConnection;
  FragranceImageEdge: FragranceImageEdge;
  FragranceNote: FragranceNote;
  FragranceNoteConnection: FragranceNoteConnection;
  FragranceNoteEdge: FragranceNoteEdge;
  FragranceNotes: FragranceNotes;
  FragranceReview: FragranceReview;
  FragranceReviewConnection: FragranceReviewConnection;
  FragranceReviewDistribution: FragranceReviewDistribution;
  FragranceReviewEdge: FragranceReviewEdge;
  FragranceTrait: FragranceTrait;
  FragranceTraits: FragranceTraits;
  FragranceVotes: FragranceVotes;
  Int: Scalars['Int']['output'];
  Mutation: {};
  Note: Note;
  NoteRequest: NoteRequest;
  NotesInput: NotesInput;
  PageInfo: PageInfo;
  PaginationInput: PaginationInput;
  Query: {};
  QueryInput: QueryInput;
  SignUpResult: SignUpResult;
  SortByInput: SortByInput;
  String: Scalars['String']['output'];
  User: User;
}>;

export type AccordResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Accord'] = ResolversParentTypes['Accord']> = ResolversObject<{
  color?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  dCreated?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  dDeleted?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  dModified?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AccordRequestResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AccordRequest'] = ResolversParentTypes['AccordRequest']> = ResolversObject<{
  color?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  dCreated?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  dDeleted?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  dModified?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  state?: Resolver<ResolversTypes['State'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AuthPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AuthPayload'] = ResolversParentTypes['AuthPayload']> = ResolversObject<{
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  expiresAt?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  idToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CodeDeliveryDetailsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CodeDeliveryDetails'] = ResolversParentTypes['CodeDeliveryDetails']> = ResolversObject<{
  attribute?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  destination?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  method?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type FragranceResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Fragrance'] = ResolversParentTypes['Fragrance']> = ResolversObject<{
  accords?: Resolver<ResolversTypes['FragranceAccordConnection'], ParentType, ContextType, Partial<FragranceAccordsArgs>>;
  brand?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  dCreated?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  dModified?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  images?: Resolver<ResolversTypes['FragranceImageConnection'], ParentType, ContextType, Partial<FragranceImagesArgs>>;
  myReview?: Resolver<Maybe<ResolversTypes['FragranceReview']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  notes?: Resolver<ResolversTypes['FragranceNotes'], ParentType, ContextType>;
  rating?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  reviewDistribution?: Resolver<ResolversTypes['FragranceReviewDistribution'], ParentType, ContextType>;
  reviews?: Resolver<ResolversTypes['FragranceReviewConnection'], ParentType, ContextType, Partial<FragranceReviewsArgs>>;
  reviewsCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  traits?: Resolver<ResolversTypes['FragranceTraits'], ParentType, ContextType>;
  votes?: Resolver<ResolversTypes['FragranceVotes'], ParentType, ContextType>;
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

export type FragranceAccordConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['FragranceAccordConnection'] = ResolversParentTypes['FragranceAccordConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['FragranceAccordEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceAccordEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['FragranceAccordEdge'] = ResolversParentTypes['FragranceAccordEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['FragranceAccord'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceCollectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['FragranceCollection'] = ResolversParentTypes['FragranceCollection']> = ResolversObject<{
  dCreated?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  dModified?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  items?: Resolver<ResolversTypes['FragranceCollectionItemConnection'], ParentType, ContextType, Partial<FragranceCollectionItemsArgs>>;
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

export type FragranceCollectionItemResolvers<ContextType = Context, ParentType extends ResolversParentTypes['FragranceCollectionItem'] = ResolversParentTypes['FragranceCollectionItem']> = ResolversObject<{
  collection?: Resolver<ResolversTypes['FragranceCollection'], ParentType, ContextType>;
  dCreated?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  dModified?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  fragrance?: Resolver<ResolversTypes['Fragrance'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceCollectionItemConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['FragranceCollectionItemConnection'] = ResolversParentTypes['FragranceCollectionItemConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['FragranceCollectionItemEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceCollectionItemEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['FragranceCollectionItemEdge'] = ResolversParentTypes['FragranceCollectionItemEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['FragranceCollectionItem'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['FragranceConnection'] = ResolversParentTypes['FragranceConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['FragranceEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['FragranceEdge'] = ResolversParentTypes['FragranceEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Fragrance'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceImageResolvers<ContextType = Context, ParentType extends ResolversParentTypes['FragranceImage'] = ResolversParentTypes['FragranceImage']> = ResolversObject<{
  alt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  src?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceImageConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['FragranceImageConnection'] = ResolversParentTypes['FragranceImageConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['FragranceImageEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceImageEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['FragranceImageEdge'] = ResolversParentTypes['FragranceImageEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['FragranceImage'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceNoteResolvers<ContextType = Context, ParentType extends ResolversParentTypes['FragranceNote'] = ResolversParentTypes['FragranceNote']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  layer?: Resolver<ResolversTypes['NoteLayer'], ParentType, ContextType>;
  myVote?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  noteId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  votes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceNoteConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['FragranceNoteConnection'] = ResolversParentTypes['FragranceNoteConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['FragranceNoteEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceNoteEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['FragranceNoteEdge'] = ResolversParentTypes['FragranceNoteEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['FragranceNote'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceNotesResolvers<ContextType = Context, ParentType extends ResolversParentTypes['FragranceNotes'] = ResolversParentTypes['FragranceNotes']> = ResolversObject<{
  base?: Resolver<ResolversTypes['FragranceNoteConnection'], ParentType, ContextType, Partial<FragranceNotesBaseArgs>>;
  fragranceId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  middle?: Resolver<ResolversTypes['FragranceNoteConnection'], ParentType, ContextType, Partial<FragranceNotesMiddleArgs>>;
  top?: Resolver<ResolversTypes['FragranceNoteConnection'], ParentType, ContextType, Partial<FragranceNotesTopArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceReviewResolvers<ContextType = Context, ParentType extends ResolversParentTypes['FragranceReview'] = ResolversParentTypes['FragranceReview']> = ResolversObject<{
  dCreated?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  dDeleted?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  dModified?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  fragrance?: Resolver<ResolversTypes['Fragrance'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  myVote?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  rating?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  review?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  votes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FragranceReviewConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['FragranceReviewConnection'] = ResolversParentTypes['FragranceReviewConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['FragranceReviewEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
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

export type FragranceReviewEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['FragranceReviewEdge'] = ResolversParentTypes['FragranceReviewEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['FragranceReview'], ParentType, ContextType>;
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

export type FragranceVotesResolvers<ContextType = Context, ParentType extends ResolversParentTypes['FragranceVotes'] = ResolversParentTypes['FragranceVotes']> = ResolversObject<{
  dislikes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  likes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  myVote?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  addFragranceToCollection?: Resolver<Maybe<ResolversTypes['FragranceCollection']>, ParentType, ContextType, RequireFields<MutationAddFragranceToCollectionArgs, 'collectionId' | 'fragranceId'>>;
  confirmForgotPassword?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationConfirmForgotPasswordArgs, 'confirmationCode' | 'email' | 'newPassword'>>;
  confirmSignUp?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationConfirmSignUpArgs, 'confirmationCode' | 'email'>>;
  createCollection?: Resolver<Maybe<ResolversTypes['FragranceCollection']>, ParentType, ContextType, RequireFields<MutationCreateCollectionArgs, 'input'>>;
  forgotPassword?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationForgotPasswordArgs, 'email'>>;
  logIn?: Resolver<ResolversTypes['AuthPayload'], ParentType, ContextType, RequireFields<MutationLogInArgs, 'email' | 'password'>>;
  logOut?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  refresh?: Resolver<Maybe<ResolversTypes['AuthPayload']>, ParentType, ContextType>;
  removeFragranceFromCollection?: Resolver<Maybe<ResolversTypes['FragranceCollection']>, ParentType, ContextType, RequireFields<MutationRemoveFragranceFromCollectionArgs, 'collectionId' | 'fragranceId'>>;
  reviewFragrance?: Resolver<Maybe<ResolversTypes['FragranceReview']>, ParentType, ContextType, RequireFields<MutationReviewFragranceArgs, 'fragranceId' | 'myRating' | 'myReview'>>;
  signUp?: Resolver<ResolversTypes['SignUpResult'], ParentType, ContextType, RequireFields<MutationSignUpArgs, 'email' | 'password'>>;
  voteOnAccord?: Resolver<Maybe<ResolversTypes['FragranceAccord']>, ParentType, ContextType, RequireFields<MutationVoteOnAccordArgs, 'accordId' | 'fragranceId' | 'myVote'>>;
  voteOnFragrance?: Resolver<Maybe<ResolversTypes['FragranceVotes']>, ParentType, ContextType, RequireFields<MutationVoteOnFragranceArgs, 'fragranceId'>>;
  voteOnNote?: Resolver<Maybe<ResolversTypes['FragranceNote']>, ParentType, ContextType, RequireFields<MutationVoteOnNoteArgs, 'fragranceId' | 'layer' | 'myVote' | 'noteId'>>;
  voteOnReview?: Resolver<Maybe<ResolversTypes['FragranceReview']>, ParentType, ContextType, RequireFields<MutationVoteOnReviewArgs, 'reviewId'>>;
  voteOnTrait?: Resolver<Maybe<ResolversTypes['FragranceTrait']>, ParentType, ContextType, RequireFields<MutationVoteOnTraitArgs, 'fragranceId' | 'myVote' | 'trait'>>;
}>;

export type NoteResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Note'] = ResolversParentTypes['Note']> = ResolversObject<{
  dCreated?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  dDeleted?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  dModified?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type NoteRequestResolvers<ContextType = Context, ParentType extends ResolversParentTypes['NoteRequest'] = ResolversParentTypes['NoteRequest']> = ResolversObject<{
  dCreated?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  dDeleted?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  dModified?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  state?: Resolver<ResolversTypes['State'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PageInfoResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = ResolversObject<{
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  startCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  accordById?: Resolver<Maybe<ResolversTypes['Accord']>, ParentType, ContextType, RequireFields<QueryAccordByIdArgs, 'id'>>;
  accordByLikeName?: Resolver<Maybe<Array<ResolversTypes['Accord']>>, ParentType, ContextType, RequireFields<QueryAccordByLikeNameArgs, 'name'>>;
  accordRequest?: Resolver<Maybe<ResolversTypes['AccordRequest']>, ParentType, ContextType, RequireFields<QueryAccordRequestArgs, 'id'>>;
  collection?: Resolver<Maybe<ResolversTypes['FragranceCollection']>, ParentType, ContextType, RequireFields<QueryCollectionArgs, 'id'>>;
  fragrance?: Resolver<Maybe<ResolversTypes['Fragrance']>, ParentType, ContextType, RequireFields<QueryFragranceArgs, 'id'>>;
  fragrances?: Resolver<ResolversTypes['FragranceConnection'], ParentType, ContextType, Partial<QueryFragrancesArgs>>;
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  noteById?: Resolver<Maybe<ResolversTypes['Note']>, ParentType, ContextType, RequireFields<QueryNoteByIdArgs, 'id'>>;
  noteByLikeName?: Resolver<Maybe<Array<ResolversTypes['Note']>>, ParentType, ContextType, RequireFields<QueryNoteByLikeNameArgs, 'name'>>;
  noteRequest?: Resolver<Maybe<ResolversTypes['NoteRequest']>, ParentType, ContextType, RequireFields<QueryNoteRequestArgs, 'id'>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
}>;

export type SignUpResultResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SignUpResult'] = ResolversParentTypes['SignUpResult']> = ResolversObject<{
  complete?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  delivery?: Resolver<Maybe<ResolversTypes['CodeDeliveryDetails']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  collections?: Resolver<ResolversTypes['FragranceCollectionConnection'], ParentType, ContextType, Partial<UserCollectionsArgs>>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  followers?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  following?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  likes?: Resolver<ResolversTypes['FragranceConnection'], ParentType, ContextType, Partial<UserLikesArgs>>;
  reviews?: Resolver<ResolversTypes['FragranceReviewConnection'], ParentType, ContextType, Partial<UserReviewsArgs>>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = Context> = ResolversObject<{
  Accord?: AccordResolvers<ContextType>;
  AccordRequest?: AccordRequestResolvers<ContextType>;
  AuthPayload?: AuthPayloadResolvers<ContextType>;
  CodeDeliveryDetails?: CodeDeliveryDetailsResolvers<ContextType>;
  Date?: GraphQLScalarType;
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
  FragranceReview?: FragranceReviewResolvers<ContextType>;
  FragranceReviewConnection?: FragranceReviewConnectionResolvers<ContextType>;
  FragranceReviewDistribution?: FragranceReviewDistributionResolvers<ContextType>;
  FragranceReviewEdge?: FragranceReviewEdgeResolvers<ContextType>;
  FragranceTrait?: FragranceTraitResolvers<ContextType>;
  FragranceTraits?: FragranceTraitsResolvers<ContextType>;
  FragranceVotes?: FragranceVotesResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Note?: NoteResolvers<ContextType>;
  NoteRequest?: NoteRequestResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  SignUpResult?: SignUpResultResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
}>;

