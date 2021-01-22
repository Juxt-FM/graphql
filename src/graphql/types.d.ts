import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
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

export type UserAccount = {
  __typename?: 'UserAccount';
  id: Scalars['ID'];
  email: Scalars['String'];
  phone?: Maybe<Scalars['String']>;
  profile?: Maybe<UserProfile>;
  verified?: Maybe<Scalars['Boolean']>;
  suspended?: Maybe<Scalars['String']>;
  updated: Scalars['String'];
  created: Scalars['String'];
};

export type UserDevice = {
  __typename?: 'UserDevice';
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
  refreshToken?: Maybe<Scalars['String']>;
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
  me: UserAccount;
  userProfile: UserProfile;
  postByID: Post;
  ideaByID: Idea;
  postDrafts: Array<Post>;
  suggestedPosts: Array<Post>;
  suggestedIdeas: Array<Idea>;
};


export type QueryUserProfileArgs = {
  id: Scalars['ID'];
};


export type QueryPostByIdArgs = {
  id: Scalars['ID'];
};


export type QueryIdeaByIdArgs = {
  id: Scalars['ID'];
};


export type QuerySuggestedPostsArgs = {
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
};


export type QuerySuggestedIdeasArgs = {
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createUser: AuthCredentials;
  loginUser: AuthCredentials;
  logoutUser: Scalars['String'];
  updateEmail: UserAccount;
  updatePhone: UserAccount;
  verifyEmail?: Maybe<AuthCredentials>;
  verifyPhone?: Maybe<AuthCredentials>;
  resetPassword: Scalars['String'];
  refreshToken: AuthCredentials;
  deactivateAccount: Scalars['String'];
  followProfile: FollowingStatus;
  unfollowProfile: Scalars['String'];
  updateProfile: UserProfile;
  updateProfileImage: Scalars['String'];
  updateCoverImage: Scalars['String'];
  createPost: Post;
  updatePost: Post;
  deletePost: Scalars['String'];
  createIdea: Idea;
  updateIdea: Idea;
  deleteIdea: Scalars['String'];
  createReaction: Scalars['String'];
  deleteReaction: Scalars['String'];
  reportContent: Scalars['String'];
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


export type MutationRefreshTokenArgs = {
  device: Scalars['ID'];
};


export type MutationFollowProfileArgs = {
  id: Scalars['ID'];
};


export type MutationUnfollowProfileArgs = {
  id: Scalars['ID'];
};


export type MutationUpdateProfileArgs = {
  data: ProfileInput;
};


export type MutationCreatePostArgs = {
  data: PostInput;
};


export type MutationUpdatePostArgs = {
  id: Scalars['ID'];
  data: PostInput;
};


export type MutationDeletePostArgs = {
  id: Scalars['ID'];
};


export type MutationCreateIdeaArgs = {
  data: IdeaInput;
};


export type MutationUpdateIdeaArgs = {
  id: Scalars['ID'];
  message: Scalars['String'];
};


export type MutationDeleteIdeaArgs = {
  id: Scalars['ID'];
};


export type MutationCreateReactionArgs = {
  to: Scalars['ID'];
  reaction: ReactionType;
};


export type MutationDeleteReactionArgs = {
  id: Scalars['ID'];
};


export type MutationReportContentArgs = {
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
  posts: Array<Post>;
  ideas: Array<Idea>;
  followers: Array<UserProfile>;
  followCount: Scalars['Int'];
  followStatus?: Maybe<FollowingStatus>;
  created: Scalars['String'];
  updated: Scalars['String'];
};


export type UserProfilePostsArgs = {
  limit: Scalars['Int'];
  offset: Scalars['Int'];
};


export type UserProfileIdeasArgs = {
  limit: Scalars['Int'];
  offset: Scalars['Int'];
};


export type UserProfileFollowersArgs = {
  limit: Scalars['Int'];
  offset: Scalars['Int'];
};

export type FollowingStatus = {
  __typename?: 'FollowingStatus';
  timestamp: Scalars['String'];
};

export type ProfileInput = {
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

export enum ReactionType {
  Like = 'like',
  Dislike = 'dislike',
  Love = 'love',
  Hate = 'hate'
}

export enum AttachmentType {
  Media = 'media',
  Web = 'web'
}

export type ActionableContent = Post | Idea;

export type Post = {
  __typename?: 'Post';
  id: Scalars['ID'];
  author?: Maybe<UserProfile>;
  publicationStatus: PublicationStatus;
  contentFormat: PostContentFormat;
  title: Scalars['String'];
  summary?: Maybe<Scalars['String']>;
  imageURL?: Maybe<Scalars['String']>;
  content: Scalars['String'];
  replies: Array<Idea>;
  reactions: Array<Reaction>;
  reactionCount: Scalars['Int'];
  replyCount: Scalars['Int'];
  reactionStatus?: Maybe<Reaction>;
  created: Scalars['String'];
  updated: Scalars['String'];
};


export type PostRepliesArgs = {
  limit: Scalars['Int'];
  offset: Scalars['Int'];
};


export type PostReactionsArgs = {
  limit: Scalars['Int'];
  offset: Scalars['Int'];
};

export type Idea = {
  __typename?: 'Idea';
  id: Scalars['ID'];
  author?: Maybe<UserProfile>;
  message: Scalars['String'];
  attachments?: Maybe<Array<Attachment>>;
  replyStatus?: Maybe<Idea>;
  replies?: Maybe<Array<Idea>>;
  reactions: Array<Reaction>;
  reactionCount: Scalars['Int'];
  replyCount: Scalars['Int'];
  reactionStatus?: Maybe<Reaction>;
  created: Scalars['String'];
  updated: Scalars['String'];
};


export type IdeaRepliesArgs = {
  limit: Scalars['Int'];
  offset: Scalars['Int'];
};


export type IdeaReactionsArgs = {
  limit: Scalars['Int'];
  offset: Scalars['Int'];
};

export type Attachment = {
  __typename?: 'Attachment';
  type: AttachmentType;
  url?: Maybe<Scalars['String']>;
};

export type Reaction = {
  __typename?: 'Reaction';
  id: Scalars['ID'];
  from?: Maybe<UserProfile>;
  to: ActionableContent;
  reaction: Scalars['String'];
  timestamp: Scalars['String'];
};

export type PostInput = {
  publicationStatus: PublicationStatus;
  contentFormat: PostContentFormat;
  title: Scalars['String'];
  content?: Maybe<Scalars['String']>;
  summary?: Maybe<Scalars['String']>;
  imageURL?: Maybe<Scalars['String']>;
};

export type IdeaInput = {
  replyStatus?: Maybe<Scalars['ID']>;
  message: Scalars['String'];
};

export type PostFilters = {
  user?: Maybe<Scalars['ID']>;
  query?: Maybe<Scalars['String']>;
  symbols?: Maybe<Array<Scalars['String']>>;
  limit: Scalars['Int'];
  offset: Scalars['Int'];
};

export type Company = {
  __typename?: 'Company';
  id: Scalars['ID'];
  symbol: Scalars['String'];
  companyName: Scalars['String'];
  exchange: Scalars['String'];
  industry: Industry;
  website?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  CEO?: Maybe<Scalars['String']>;
  securityName?: Maybe<Scalars['String']>;
  issueType?: Maybe<Scalars['String']>;
  sector: Sector;
  primarySicCode?: Maybe<Scalars['Int']>;
  employees?: Maybe<Scalars['Int']>;
  tags: Array<Industry>;
  address?: Maybe<Scalars['String']>;
  address2?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  zip?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
};

export type Sector = {
  __typename?: 'Sector';
  name: Scalars['String'];
};

export type Industry = {
  __typename?: 'Industry';
  name: Scalars['String'];
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
  UserAccount: ResolverTypeWrapper<UserAccount>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  UserDevice: ResolverTypeWrapper<UserDevice>;
  AuthCredentials: ResolverTypeWrapper<AuthCredentials>;
  DeviceInput: DeviceInput;
  UserInput: UserInput;
  LoginInput: LoginInput;
  Query: ResolverTypeWrapper<{}>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Mutation: ResolverTypeWrapper<{}>;
  UserProfile: ResolverTypeWrapper<UserProfile>;
  FollowingStatus: ResolverTypeWrapper<FollowingStatus>;
  ProfileInput: ProfileInput;
  PublicationStatus: PublicationStatus;
  PostContentFormat: PostContentFormat;
  ReactionType: ReactionType;
  AttachmentType: AttachmentType;
  ActionableContent: ResolversTypes['Post'] | ResolversTypes['Idea'];
  Post: ResolverTypeWrapper<Post>;
  Idea: ResolverTypeWrapper<Idea>;
  Attachment: ResolverTypeWrapper<Attachment>;
  Reaction: ResolverTypeWrapper<Omit<Reaction, 'to'> & { to: ResolversTypes['ActionableContent'] }>;
  PostInput: PostInput;
  IdeaInput: IdeaInput;
  PostFilters: PostFilters;
  Company: ResolverTypeWrapper<Company>;
  Sector: ResolverTypeWrapper<Sector>;
  Industry: ResolverTypeWrapper<Industry>;
  Watchlist: ResolverTypeWrapper<Watchlist>;
  WatchlistInput: WatchlistInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  UserAccount: UserAccount;
  ID: Scalars['ID'];
  String: Scalars['String'];
  Boolean: Scalars['Boolean'];
  UserDevice: UserDevice;
  AuthCredentials: AuthCredentials;
  DeviceInput: DeviceInput;
  UserInput: UserInput;
  LoginInput: LoginInput;
  Query: {};
  Int: Scalars['Int'];
  Mutation: {};
  UserProfile: UserProfile;
  FollowingStatus: FollowingStatus;
  ProfileInput: ProfileInput;
  ActionableContent: ResolversParentTypes['Post'] | ResolversParentTypes['Idea'];
  Post: Post;
  Idea: Idea;
  Attachment: Attachment;
  Reaction: Omit<Reaction, 'to'> & { to: ResolversParentTypes['ActionableContent'] };
  PostInput: PostInput;
  IdeaInput: IdeaInput;
  PostFilters: PostFilters;
  Company: Company;
  Sector: Sector;
  Industry: Industry;
  Watchlist: Watchlist;
  WatchlistInput: WatchlistInput;
};

export type UserAccountResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserAccount'] = ResolversParentTypes['UserAccount']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  profile?: Resolver<Maybe<ResolversTypes['UserProfile']>, ParentType, ContextType>;
  verified?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  suspended?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updated?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  created?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserDeviceResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserDevice'] = ResolversParentTypes['UserDevice']> = {
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
  refreshToken?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  me?: Resolver<ResolversTypes['UserAccount'], ParentType, ContextType>;
  userProfile?: Resolver<ResolversTypes['UserProfile'], ParentType, ContextType, RequireFields<QueryUserProfileArgs, 'id'>>;
  postByID?: Resolver<ResolversTypes['Post'], ParentType, ContextType, RequireFields<QueryPostByIdArgs, 'id'>>;
  ideaByID?: Resolver<ResolversTypes['Idea'], ParentType, ContextType, RequireFields<QueryIdeaByIdArgs, 'id'>>;
  postDrafts?: Resolver<Array<ResolversTypes['Post']>, ParentType, ContextType>;
  suggestedPosts?: Resolver<Array<ResolversTypes['Post']>, ParentType, ContextType, RequireFields<QuerySuggestedPostsArgs, 'limit' | 'offset'>>;
  suggestedIdeas?: Resolver<Array<ResolversTypes['Idea']>, ParentType, ContextType, RequireFields<QuerySuggestedIdeasArgs, 'limit' | 'offset'>>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createUser?: Resolver<ResolversTypes['AuthCredentials'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'data' | 'device'>>;
  loginUser?: Resolver<ResolversTypes['AuthCredentials'], ParentType, ContextType, RequireFields<MutationLoginUserArgs, 'data' | 'device'>>;
  logoutUser?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationLogoutUserArgs, 'device'>>;
  updateEmail?: Resolver<ResolversTypes['UserAccount'], ParentType, ContextType, RequireFields<MutationUpdateEmailArgs, 'email'>>;
  updatePhone?: Resolver<ResolversTypes['UserAccount'], ParentType, ContextType, RequireFields<MutationUpdatePhoneArgs, 'phone'>>;
  verifyEmail?: Resolver<Maybe<ResolversTypes['AuthCredentials']>, ParentType, ContextType, RequireFields<MutationVerifyEmailArgs, 'code'>>;
  verifyPhone?: Resolver<Maybe<ResolversTypes['AuthCredentials']>, ParentType, ContextType, RequireFields<MutationVerifyPhoneArgs, 'code'>>;
  resetPassword?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationResetPasswordArgs, 'password' | 'confirmPassword'>>;
  refreshToken?: Resolver<ResolversTypes['AuthCredentials'], ParentType, ContextType, RequireFields<MutationRefreshTokenArgs, 'device'>>;
  deactivateAccount?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  followProfile?: Resolver<ResolversTypes['FollowingStatus'], ParentType, ContextType, RequireFields<MutationFollowProfileArgs, 'id'>>;
  unfollowProfile?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationUnfollowProfileArgs, 'id'>>;
  updateProfile?: Resolver<ResolversTypes['UserProfile'], ParentType, ContextType, RequireFields<MutationUpdateProfileArgs, 'data'>>;
  updateProfileImage?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updateCoverImage?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createPost?: Resolver<ResolversTypes['Post'], ParentType, ContextType, RequireFields<MutationCreatePostArgs, 'data'>>;
  updatePost?: Resolver<ResolversTypes['Post'], ParentType, ContextType, RequireFields<MutationUpdatePostArgs, 'id' | 'data'>>;
  deletePost?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationDeletePostArgs, 'id'>>;
  createIdea?: Resolver<ResolversTypes['Idea'], ParentType, ContextType, RequireFields<MutationCreateIdeaArgs, 'data'>>;
  updateIdea?: Resolver<ResolversTypes['Idea'], ParentType, ContextType, RequireFields<MutationUpdateIdeaArgs, 'id' | 'message'>>;
  deleteIdea?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationDeleteIdeaArgs, 'id'>>;
  createReaction?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationCreateReactionArgs, 'to' | 'reaction'>>;
  deleteReaction?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationDeleteReactionArgs, 'id'>>;
  reportContent?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationReportContentArgs, 'id'>>;
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
  posts?: Resolver<Array<ResolversTypes['Post']>, ParentType, ContextType, RequireFields<UserProfilePostsArgs, 'limit' | 'offset'>>;
  ideas?: Resolver<Array<ResolversTypes['Idea']>, ParentType, ContextType, RequireFields<UserProfileIdeasArgs, 'limit' | 'offset'>>;
  followers?: Resolver<Array<ResolversTypes['UserProfile']>, ParentType, ContextType, RequireFields<UserProfileFollowersArgs, 'limit' | 'offset'>>;
  followCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  followStatus?: Resolver<Maybe<ResolversTypes['FollowingStatus']>, ParentType, ContextType>;
  created?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updated?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FollowingStatusResolvers<ContextType = any, ParentType extends ResolversParentTypes['FollowingStatus'] = ResolversParentTypes['FollowingStatus']> = {
  timestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ActionableContentResolvers<ContextType = any, ParentType extends ResolversParentTypes['ActionableContent'] = ResolversParentTypes['ActionableContent']> = {
  __resolveType: TypeResolveFn<'Post' | 'Idea', ParentType, ContextType>;
};

export type PostResolvers<ContextType = any, ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  author?: Resolver<Maybe<ResolversTypes['UserProfile']>, ParentType, ContextType>;
  publicationStatus?: Resolver<ResolversTypes['PublicationStatus'], ParentType, ContextType>;
  contentFormat?: Resolver<ResolversTypes['PostContentFormat'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  summary?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  imageURL?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  replies?: Resolver<Array<ResolversTypes['Idea']>, ParentType, ContextType, RequireFields<PostRepliesArgs, 'limit' | 'offset'>>;
  reactions?: Resolver<Array<ResolversTypes['Reaction']>, ParentType, ContextType, RequireFields<PostReactionsArgs, 'limit' | 'offset'>>;
  reactionCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  replyCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  reactionStatus?: Resolver<Maybe<ResolversTypes['Reaction']>, ParentType, ContextType>;
  created?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updated?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IdeaResolvers<ContextType = any, ParentType extends ResolversParentTypes['Idea'] = ResolversParentTypes['Idea']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  author?: Resolver<Maybe<ResolversTypes['UserProfile']>, ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  attachments?: Resolver<Maybe<Array<ResolversTypes['Attachment']>>, ParentType, ContextType>;
  replyStatus?: Resolver<Maybe<ResolversTypes['Idea']>, ParentType, ContextType>;
  replies?: Resolver<Maybe<Array<ResolversTypes['Idea']>>, ParentType, ContextType, RequireFields<IdeaRepliesArgs, 'limit' | 'offset'>>;
  reactions?: Resolver<Array<ResolversTypes['Reaction']>, ParentType, ContextType, RequireFields<IdeaReactionsArgs, 'limit' | 'offset'>>;
  reactionCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  replyCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  reactionStatus?: Resolver<Maybe<ResolversTypes['Reaction']>, ParentType, ContextType>;
  created?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updated?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AttachmentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Attachment'] = ResolversParentTypes['Attachment']> = {
  type?: Resolver<ResolversTypes['AttachmentType'], ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ReactionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Reaction'] = ResolversParentTypes['Reaction']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  from?: Resolver<Maybe<ResolversTypes['UserProfile']>, ParentType, ContextType>;
  to?: Resolver<ResolversTypes['ActionableContent'], ParentType, ContextType>;
  reaction?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CompanyResolvers<ContextType = any, ParentType extends ResolversParentTypes['Company'] = ResolversParentTypes['Company']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  symbol?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  companyName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  exchange?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  industry?: Resolver<ResolversTypes['Industry'], ParentType, ContextType>;
  website?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  CEO?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  securityName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  issueType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sector?: Resolver<ResolversTypes['Sector'], ParentType, ContextType>;
  primarySicCode?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  employees?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  tags?: Resolver<Array<ResolversTypes['Industry']>, ParentType, ContextType>;
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  address2?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  state?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  city?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  zip?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  country?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SectorResolvers<ContextType = any, ParentType extends ResolversParentTypes['Sector'] = ResolversParentTypes['Sector']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IndustryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Industry'] = ResolversParentTypes['Industry']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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
  UserAccount?: UserAccountResolvers<ContextType>;
  UserDevice?: UserDeviceResolvers<ContextType>;
  AuthCredentials?: AuthCredentialsResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  UserProfile?: UserProfileResolvers<ContextType>;
  FollowingStatus?: FollowingStatusResolvers<ContextType>;
  ActionableContent?: ActionableContentResolvers<ContextType>;
  Post?: PostResolvers<ContextType>;
  Idea?: IdeaResolvers<ContextType>;
  Attachment?: AttachmentResolvers<ContextType>;
  Reaction?: ReactionResolvers<ContextType>;
  Company?: CompanyResolvers<ContextType>;
  Sector?: SectorResolvers<ContextType>;
  Industry?: IndustryResolvers<ContextType>;
  Watchlist?: WatchlistResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
