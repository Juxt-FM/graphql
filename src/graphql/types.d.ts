import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export enum DevicePlatform {
  Ios = 'ios',
  Android = 'android',
  Web = 'web'
}

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  email: Scalars['String'];
  phone?: Maybe<Scalars['String']>;
  profile: UserProfile;
  verified?: Maybe<Scalars['String']>;
  suspended?: Maybe<Scalars['String']>;
  updated: Scalars['String'];
  created: Scalars['String'];
};

export type Device = {
  __typename?: 'Device';
  id: Scalars['ID'];
  platform: DevicePlatform;
  model: Scalars['String'];
  ipAddr: Scalars['String'];
  created: Scalars['String'];
  updated: Scalars['String'];
};

export type AuthCredentials = {
  __typename?: 'AuthCredentials';
  accessToken: Scalars['String'];
};

export type DeviceInput = {
  id: Scalars['ID'];
  platform: DevicePlatform;
  model: Scalars['String'];
  fcmKey?: Maybe<Scalars['String']>;
};

export type UserInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  confirmPassword: Scalars['String'];
};

export type LoginInput = {
  identifier: Scalars['String'];
  password: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  me: User;
  profile: UserProfile;
  singleBlogPost: BlogPost;
  filterBlogPosts: Array<BlogPost>;
  reactions: Array<Reaction>;
  myDrafts: Array<BlogPost>;
  commentThread: Array<Comment>;
};


export type QueryProfileArgs = {
  id: Scalars['ID'];
};


export type QuerySingleBlogPostArgs = {
  id: Scalars['ID'];
};


export type QueryFilterBlogPostsArgs = {
  filters: BlogPostFilters;
};


export type QueryReactionsArgs = {
  id: Scalars['ID'];
  limit: Scalars['Int'];
  offset: Scalars['Int'];
};


export type QueryMyDraftsArgs = {
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
};


export type QueryCommentThreadArgs = {
  parent: Scalars['ID'];
  filters: CommentThreadFilters;
};

export type Mutation = {
  __typename?: 'Mutation';
  createUser: AuthCredentials;
  loginUser: AuthCredentials;
  logoutUser: Scalars['String'];
  updateEmail: User;
  updatePhone: User;
  verifyEmail?: Maybe<AuthCredentials>;
  verifyPhone?: Maybe<AuthCredentials>;
  resetPassword: Scalars['String'];
  refreshToken: AuthCredentials;
  deactivateAccount: Scalars['String'];
  updateProfile: UserProfile;
  createBlogPost: BlogPost;
  updateBlogPost: BlogPost;
  deleteBlogPost: Scalars['String'];
  createComment: Comment;
  updateComment: Comment;
  deleteComment: Comment;
  createReaction: Reaction;
  updateReaction: Reaction;
  deleteReaction: Scalars['String'];
  createWatchlist: Watchlist;
  updateWatchlist: Watchlist;
  deleteWatchlist: Scalars['String'];
};


export type MutationCreateUserArgs = {
  data: UserInput;
  device: DeviceInput;
};


export type MutationLoginUserArgs = {
  data: LoginInput;
  device: DeviceInput;
};


export type MutationLogoutUserArgs = {
  device: Scalars['ID'];
};


export type MutationUpdateEmailArgs = {
  email: Scalars['String'];
};


export type MutationUpdatePhoneArgs = {
  phone: Scalars['String'];
};


export type MutationVerifyEmailArgs = {
  code: Scalars['String'];
};


export type MutationVerifyPhoneArgs = {
  code: Scalars['String'];
};


export type MutationResetPasswordArgs = {
  password: Scalars['String'];
  confirmPassword: Scalars['String'];
};


export type MutationUpdateProfileArgs = {
  data: UpdateProfileInput;
};


export type MutationCreateBlogPostArgs = {
  data: BlogPostInput;
};


export type MutationUpdateBlogPostArgs = {
  id: Scalars['ID'];
  data: BlogPostInput;
};


export type MutationDeleteBlogPostArgs = {
  id: Scalars['ID'];
};


export type MutationCreateCommentArgs = {
  data: CommentInput;
};


export type MutationUpdateCommentArgs = {
  id: Scalars['ID'];
  data: CommentInput;
};


export type MutationDeleteCommentArgs = {
  id: Scalars['ID'];
};


export type MutationCreateReactionArgs = {
  data: ReactionInput;
};


export type MutationUpdateReactionArgs = {
  id: Scalars['ID'];
  data: ReactionInput;
};


export type MutationDeleteReactionArgs = {
  id: Scalars['ID'];
};


export type MutationCreateWatchlistArgs = {
  data: WatchlistInput;
};


export type MutationUpdateWatchlistArgs = {
  id: Scalars['ID'];
  data: WatchlistInput;
};


export type MutationDeleteWatchlistArgs = {
  id: Scalars['ID'];
};

export type UserProfile = {
  __typename?: 'UserProfile';
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  location?: Maybe<Scalars['String']>;
  summary?: Maybe<Scalars['String']>;
  profileImageURL?: Maybe<Scalars['String']>;
  coverImageURL?: Maybe<Scalars['String']>;
  watchlists: Array<Watchlist>;
  posts: Array<BlogPost>;
  comments: Array<Comment>;
  created: Scalars['String'];
  updated: Scalars['String'];
};

export type UpdateProfileInput = {
  name?: Maybe<Scalars['String']>;
  summary?: Maybe<Scalars['String']>;
  location?: Maybe<Scalars['String']>;
};

export enum PublicationStatus {
  Public = 'public',
  Draft = 'draft'
}

export enum PostContentFormat {
  Html = 'html',
  Markdown = 'markdown'
}

export type BlogPost = {
  __typename?: 'BlogPost';
  id: Scalars['ID'];
  publicationStatus: PublicationStatus;
  contentFormat: PostContentFormat;
  author: Scalars['ID'];
  title: Scalars['String'];
  subtitle?: Maybe<Scalars['String']>;
  imageURL?: Maybe<Scalars['String']>;
  content: Scalars['String'];
  symbols: Array<Scalars['String']>;
  tags: Array<Scalars['String']>;
  comments: Array<Comment>;
  reactionCount: Scalars['Int'];
  reactionStatus?: Maybe<Reaction>;
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};


export type BlogPostCommentsArgs = {
  depth: Scalars['Int'];
  limit: Scalars['Int'];
  offset: Scalars['Int'];
};

export type Comment = {
  __typename?: 'Comment';
  id: Scalars['ID'];
  post: Scalars['ID'];
  replyStatus: Scalars['ID'];
  author: Scalars['ID'];
  message: Scalars['String'];
  replies?: Maybe<Array<Comment>>;
  reactionCount: Scalars['Int'];
  reactionStatus?: Maybe<Reaction>;
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type Reaction = {
  __typename?: 'Reaction';
  id: Scalars['ID'];
  to: Scalars['ID'];
  reaction: Scalars['String'];
  updatedAt: Scalars['String'];
  createdAt: Scalars['String'];
};

export type BlogPostInput = {
  publicationStatus?: Maybe<PublicationStatus>;
  contentFormat?: Maybe<PostContentFormat>;
  symbols: Array<Scalars['String']>;
  tags: Array<Scalars['String']>;
  title: Scalars['String'];
  imageURL?: Maybe<Scalars['String']>;
  subtitle?: Maybe<Scalars['String']>;
  content: Scalars['String'];
};

export type CommentInput = {
  post: Scalars['ID'];
  replyStatus?: Maybe<Scalars['ID']>;
  message: Scalars['String'];
};

export type ReactionInput = {
  to: Scalars['String'];
  toType: Scalars['String'];
  reaction: Scalars['String'];
};

export type BlogPostFilters = {
  user?: Maybe<Scalars['ID']>;
  query?: Maybe<Scalars['String']>;
  symbols?: Maybe<Array<Scalars['String']>>;
  limit: Scalars['Int'];
  offset: Scalars['Int'];
};

export type CommentThreadFilters = {
  depth: Scalars['Int'];
  limit: Scalars['Int'];
  offset: Scalars['Int'];
};

export type Watchlist = {
  __typename?: 'Watchlist';
  id: Scalars['ID'];
  name: Scalars['String'];
  symbols: Array<Scalars['String']>;
  updatedAt: Scalars['String'];
  createdAt: Scalars['String'];
};

export type WatchlistInput = {
  name?: Maybe<Scalars['String']>;
  symbols?: Maybe<Array<Scalars['String']>>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

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
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

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
export type ResolversTypes = {
  DevicePlatform: DevicePlatform;
  User: ResolverTypeWrapper<User>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Device: ResolverTypeWrapper<Device>;
  AuthCredentials: ResolverTypeWrapper<AuthCredentials>;
  DeviceInput: DeviceInput;
  UserInput: UserInput;
  LoginInput: LoginInput;
  Query: ResolverTypeWrapper<{}>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Mutation: ResolverTypeWrapper<{}>;
  UserProfile: ResolverTypeWrapper<UserProfile>;
  UpdateProfileInput: UpdateProfileInput;
  PublicationStatus: PublicationStatus;
  PostContentFormat: PostContentFormat;
  BlogPost: ResolverTypeWrapper<BlogPost>;
  Comment: ResolverTypeWrapper<Comment>;
  Reaction: ResolverTypeWrapper<Reaction>;
  BlogPostInput: BlogPostInput;
  CommentInput: CommentInput;
  ReactionInput: ReactionInput;
  BlogPostFilters: BlogPostFilters;
  CommentThreadFilters: CommentThreadFilters;
  Watchlist: ResolverTypeWrapper<Watchlist>;
  WatchlistInput: WatchlistInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  User: User;
  ID: Scalars['ID'];
  String: Scalars['String'];
  Device: Device;
  AuthCredentials: AuthCredentials;
  DeviceInput: DeviceInput;
  UserInput: UserInput;
  LoginInput: LoginInput;
  Query: {};
  Int: Scalars['Int'];
  Mutation: {};
  UserProfile: UserProfile;
  UpdateProfileInput: UpdateProfileInput;
  BlogPost: BlogPost;
  Comment: Comment;
  Reaction: Reaction;
  BlogPostInput: BlogPostInput;
  CommentInput: CommentInput;
  ReactionInput: ReactionInput;
  BlogPostFilters: BlogPostFilters;
  CommentThreadFilters: CommentThreadFilters;
  Watchlist: Watchlist;
  WatchlistInput: WatchlistInput;
  Boolean: Scalars['Boolean'];
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  profile?: Resolver<ResolversTypes['UserProfile'], ParentType, ContextType>;
  verified?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  suspended?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updated?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  created?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeviceResolvers<ContextType = any, ParentType extends ResolversParentTypes['Device'] = ResolversParentTypes['Device']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  platform?: Resolver<ResolversTypes['DevicePlatform'], ParentType, ContextType>;
  model?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ipAddr?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  created?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updated?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AuthCredentialsResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthCredentials'] = ResolversParentTypes['AuthCredentials']> = {
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  me?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  profile?: Resolver<ResolversTypes['UserProfile'], ParentType, ContextType, RequireFields<QueryProfileArgs, 'id'>>;
  singleBlogPost?: Resolver<ResolversTypes['BlogPost'], ParentType, ContextType, RequireFields<QuerySingleBlogPostArgs, 'id'>>;
  filterBlogPosts?: Resolver<Array<ResolversTypes['BlogPost']>, ParentType, ContextType, RequireFields<QueryFilterBlogPostsArgs, 'filters'>>;
  reactions?: Resolver<Array<ResolversTypes['Reaction']>, ParentType, ContextType, RequireFields<QueryReactionsArgs, 'id' | 'limit' | 'offset'>>;
  myDrafts?: Resolver<Array<ResolversTypes['BlogPost']>, ParentType, ContextType, RequireFields<QueryMyDraftsArgs, never>>;
  commentThread?: Resolver<Array<ResolversTypes['Comment']>, ParentType, ContextType, RequireFields<QueryCommentThreadArgs, 'parent' | 'filters'>>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createUser?: Resolver<ResolversTypes['AuthCredentials'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'data' | 'device'>>;
  loginUser?: Resolver<ResolversTypes['AuthCredentials'], ParentType, ContextType, RequireFields<MutationLoginUserArgs, 'data' | 'device'>>;
  logoutUser?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationLogoutUserArgs, 'device'>>;
  updateEmail?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateEmailArgs, 'email'>>;
  updatePhone?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdatePhoneArgs, 'phone'>>;
  verifyEmail?: Resolver<Maybe<ResolversTypes['AuthCredentials']>, ParentType, ContextType, RequireFields<MutationVerifyEmailArgs, 'code'>>;
  verifyPhone?: Resolver<Maybe<ResolversTypes['AuthCredentials']>, ParentType, ContextType, RequireFields<MutationVerifyPhoneArgs, 'code'>>;
  resetPassword?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationResetPasswordArgs, 'password' | 'confirmPassword'>>;
  refreshToken?: Resolver<ResolversTypes['AuthCredentials'], ParentType, ContextType>;
  deactivateAccount?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updateProfile?: Resolver<ResolversTypes['UserProfile'], ParentType, ContextType, RequireFields<MutationUpdateProfileArgs, 'data'>>;
  createBlogPost?: Resolver<ResolversTypes['BlogPost'], ParentType, ContextType, RequireFields<MutationCreateBlogPostArgs, 'data'>>;
  updateBlogPost?: Resolver<ResolversTypes['BlogPost'], ParentType, ContextType, RequireFields<MutationUpdateBlogPostArgs, 'id' | 'data'>>;
  deleteBlogPost?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationDeleteBlogPostArgs, 'id'>>;
  createComment?: Resolver<ResolversTypes['Comment'], ParentType, ContextType, RequireFields<MutationCreateCommentArgs, 'data'>>;
  updateComment?: Resolver<ResolversTypes['Comment'], ParentType, ContextType, RequireFields<MutationUpdateCommentArgs, 'id' | 'data'>>;
  deleteComment?: Resolver<ResolversTypes['Comment'], ParentType, ContextType, RequireFields<MutationDeleteCommentArgs, 'id'>>;
  createReaction?: Resolver<ResolversTypes['Reaction'], ParentType, ContextType, RequireFields<MutationCreateReactionArgs, 'data'>>;
  updateReaction?: Resolver<ResolversTypes['Reaction'], ParentType, ContextType, RequireFields<MutationUpdateReactionArgs, 'id' | 'data'>>;
  deleteReaction?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationDeleteReactionArgs, 'id'>>;
  createWatchlist?: Resolver<ResolversTypes['Watchlist'], ParentType, ContextType, RequireFields<MutationCreateWatchlistArgs, 'data'>>;
  updateWatchlist?: Resolver<ResolversTypes['Watchlist'], ParentType, ContextType, RequireFields<MutationUpdateWatchlistArgs, 'id' | 'data'>>;
  deleteWatchlist?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationDeleteWatchlistArgs, 'id'>>;
};

export type UserProfileResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserProfile'] = ResolversParentTypes['UserProfile']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  summary?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  profileImageURL?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  coverImageURL?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  watchlists?: Resolver<Array<ResolversTypes['Watchlist']>, ParentType, ContextType>;
  posts?: Resolver<Array<ResolversTypes['BlogPost']>, ParentType, ContextType>;
  comments?: Resolver<Array<ResolversTypes['Comment']>, ParentType, ContextType>;
  created?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updated?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BlogPostResolvers<ContextType = any, ParentType extends ResolversParentTypes['BlogPost'] = ResolversParentTypes['BlogPost']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  publicationStatus?: Resolver<ResolversTypes['PublicationStatus'], ParentType, ContextType>;
  contentFormat?: Resolver<ResolversTypes['PostContentFormat'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  subtitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  imageURL?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  symbols?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  tags?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  comments?: Resolver<Array<ResolversTypes['Comment']>, ParentType, ContextType, RequireFields<BlogPostCommentsArgs, 'depth' | 'limit' | 'offset'>>;
  reactionCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  reactionStatus?: Resolver<Maybe<ResolversTypes['Reaction']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CommentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Comment'] = ResolversParentTypes['Comment']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  post?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  replyStatus?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  replies?: Resolver<Maybe<Array<ResolversTypes['Comment']>>, ParentType, ContextType>;
  reactionCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  reactionStatus?: Resolver<Maybe<ResolversTypes['Reaction']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ReactionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Reaction'] = ResolversParentTypes['Reaction']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  to?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  reaction?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WatchlistResolvers<ContextType = any, ParentType extends ResolversParentTypes['Watchlist'] = ResolversParentTypes['Watchlist']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  symbols?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  User?: UserResolvers<ContextType>;
  Device?: DeviceResolvers<ContextType>;
  AuthCredentials?: AuthCredentialsResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  UserProfile?: UserProfileResolvers<ContextType>;
  BlogPost?: BlogPostResolvers<ContextType>;
  Comment?: CommentResolvers<ContextType>;
  Reaction?: ReactionResolvers<ContextType>;
  Watchlist?: WatchlistResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
