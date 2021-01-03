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

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  email: EmailAddress;
  phone?: Maybe<PhoneNumber>;
  profile: UserProfile;
  verified: Scalars['Boolean'];
  active: Scalars['Boolean'];
  suspended: Scalars['Boolean'];
  lastLogin: Scalars['String'];
  updatedAt: Scalars['String'];
  createdAt: Scalars['String'];
};

export type PhoneNumber = {
  __typename?: 'PhoneNumber';
  number?: Maybe<Scalars['String']>;
  verified?: Maybe<Scalars['Boolean']>;
};

export type EmailAddress = {
  __typename?: 'EmailAddress';
  address: Scalars['String'];
  verified: Scalars['Boolean'];
};

export type UserProfile = {
  __typename?: 'UserProfile';
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  location?: Maybe<Scalars['String']>;
  summary?: Maybe<Scalars['String']>;
  imageURL?: Maybe<Scalars['String']>;
  platforms: UserPlatforms;
  watchlists: Array<Watchlist>;
  posts: Array<BlogPost>;
  comments: Array<Comment>;
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type UserPlatforms = {
  __typename?: 'UserPlatforms';
  twitter?: Maybe<Scalars['String']>;
};

export type AuthCredentials = {
  __typename?: 'AuthCredentials';
  accessToken: Scalars['String'];
};

export type CreateUserInput = {
  name?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  phoneNumber?: Maybe<Scalars['String']>;
  password: Scalars['String'];
  confirmPassword: Scalars['String'];
};

export type LoginUserInput = {
  identifier: Scalars['String'];
  password: Scalars['String'];
};

export type UpdateUserInput = {
  name?: Maybe<Scalars['String']>;
  summary?: Maybe<Scalars['String']>;
  location?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
};

export type PasswordResetInput = {
  password: Scalars['String'];
  confirmPassword: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  me: User;
  userProfile: UserProfile;
  companyProfile: CompanyProfile;
  searchTickers: Array<Stock>;
  latestNews: Array<StockNews>;
  intradayRecords: Array<IntradayRecord>;
  singleBlogPost: BlogPost;
  filterBlogPosts: Array<BlogPost>;
  reactions: Array<Reaction>;
  myDrafts: Array<BlogPost>;
  commentThread: Array<Comment>;
};


export type QueryUserProfileArgs = {
  id: Scalars['ID'];
};


export type QueryCompanyProfileArgs = {
  symbol: Scalars['String'];
};


export type QuerySearchTickersArgs = {
  filters: SearchFilters;
};


export type QueryIntradayRecordsArgs = {
  symbol: Scalars['String'];
  timeframe?: Maybe<Scalars['String']>;
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
  verifyEmail?: Maybe<AuthCredentials>;
  verifyPhone?: Maybe<AuthCredentials>;
  verifyOTP: AuthCredentials;
  forgotPassword: Scalars['String'];
  resetPassword: Scalars['String'];
  refreshToken: AuthCredentials;
  deactivateAccount: Scalars['String'];
  updateUser: User;
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
  data: CreateUserInput;
};


export type MutationLoginUserArgs = {
  data: LoginUserInput;
};


export type MutationVerifyEmailArgs = {
  code: Scalars['String'];
};


export type MutationVerifyPhoneArgs = {
  code: Scalars['String'];
};


export type MutationVerifyOtpArgs = {
  code: Scalars['String'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationResetPasswordArgs = {
  data: PasswordResetInput;
};


export type MutationUpdateUserArgs = {
  data: UpdateUserInput;
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

export type Quote = {
  __typename?: 'Quote';
  price: Scalars['Float'];
  changesPercentage: Scalars['Float'];
  change: Scalars['Float'];
  dayLow: Scalars['Float'];
  dayHigh: Scalars['Float'];
  yearHigh: Scalars['Float'];
  yearLow: Scalars['Float'];
  marketCap: Scalars['Float'];
  priceAvg50: Scalars['Float'];
  priceAvg200: Scalars['Float'];
  volume: Scalars['Float'];
  avgVolume: Scalars['Float'];
  exchange: Scalars['String'];
  open: Scalars['Float'];
  previousClose: Scalars['Float'];
  eps: Scalars['Float'];
  pe: Scalars['Float'];
  earningsAnnouncement?: Maybe<Scalars['String']>;
  sharesOutstanding?: Maybe<Scalars['Int']>;
  timestamp: Scalars['Int'];
};

export type StockNews = {
  __typename?: 'StockNews';
  symbol: Scalars['String'];
  publishedDate: Scalars['String'];
  title: Scalars['String'];
  image: Scalars['String'];
  site: Scalars['String'];
  text: Scalars['String'];
  url: Scalars['String'];
};

export type Stock = {
  __typename?: 'Stock';
  symbol: Scalars['String'];
  name: Scalars['String'];
  currency?: Maybe<Scalars['String']>;
  stockExchange?: Maybe<Scalars['String']>;
  exchangeShortName?: Maybe<Scalars['String']>;
  news: Array<StockNews>;
  quote: Quote;
};

export type CompanyProfile = {
  __typename?: 'CompanyProfile';
  symbol: Scalars['String'];
  beta?: Maybe<Scalars['Float']>;
  volAvg?: Maybe<Scalars['String']>;
  mktCap?: Maybe<Scalars['String']>;
  lastDiv?: Maybe<Scalars['Float']>;
  range?: Maybe<Scalars['String']>;
  changes?: Maybe<Scalars['Float']>;
  companyName?: Maybe<Scalars['String']>;
  currency?: Maybe<Scalars['String']>;
  isin?: Maybe<Scalars['String']>;
  cusip?: Maybe<Scalars['String']>;
  exchange?: Maybe<Scalars['String']>;
  exchangeShortName?: Maybe<Scalars['String']>;
  industry?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  ceo?: Maybe<Scalars['String']>;
  sector?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  fullTimeEmployees?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  address?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  zip?: Maybe<Scalars['String']>;
  dcfDiff?: Maybe<Scalars['Float']>;
  dcf?: Maybe<Scalars['Float']>;
  image?: Maybe<Scalars['String']>;
  ipoDate?: Maybe<Scalars['String']>;
  news: Array<StockNews>;
  quote: Quote;
};

export type IntradayRecord = {
  __typename?: 'IntradayRecord';
  open: Scalars['Float'];
  low: Scalars['Float'];
  high: Scalars['Float'];
  close: Scalars['Float'];
  volume: Scalars['Int'];
  date: Scalars['String'];
  timestamp: Scalars['String'];
};

export type SearchFilters = {
  query: Scalars['String'];
  limit?: Maybe<Scalars['Int']>;
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
  User: ResolverTypeWrapper<User>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  PhoneNumber: ResolverTypeWrapper<PhoneNumber>;
  EmailAddress: ResolverTypeWrapper<EmailAddress>;
  UserProfile: ResolverTypeWrapper<UserProfile>;
  UserPlatforms: ResolverTypeWrapper<UserPlatforms>;
  AuthCredentials: ResolverTypeWrapper<AuthCredentials>;
  CreateUserInput: CreateUserInput;
  LoginUserInput: LoginUserInput;
  UpdateUserInput: UpdateUserInput;
  PasswordResetInput: PasswordResetInput;
  Query: ResolverTypeWrapper<{}>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Mutation: ResolverTypeWrapper<{}>;
  Quote: ResolverTypeWrapper<Quote>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  StockNews: ResolverTypeWrapper<StockNews>;
  Stock: ResolverTypeWrapper<Stock>;
  CompanyProfile: ResolverTypeWrapper<CompanyProfile>;
  IntradayRecord: ResolverTypeWrapper<IntradayRecord>;
  SearchFilters: SearchFilters;
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
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  User: User;
  ID: Scalars['ID'];
  Boolean: Scalars['Boolean'];
  String: Scalars['String'];
  PhoneNumber: PhoneNumber;
  EmailAddress: EmailAddress;
  UserProfile: UserProfile;
  UserPlatforms: UserPlatforms;
  AuthCredentials: AuthCredentials;
  CreateUserInput: CreateUserInput;
  LoginUserInput: LoginUserInput;
  UpdateUserInput: UpdateUserInput;
  PasswordResetInput: PasswordResetInput;
  Query: {};
  Int: Scalars['Int'];
  Mutation: {};
  Quote: Quote;
  Float: Scalars['Float'];
  StockNews: StockNews;
  Stock: Stock;
  CompanyProfile: CompanyProfile;
  IntradayRecord: IntradayRecord;
  SearchFilters: SearchFilters;
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
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['EmailAddress'], ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['PhoneNumber']>, ParentType, ContextType>;
  profile?: Resolver<ResolversTypes['UserProfile'], ParentType, ContextType>;
  verified?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  suspended?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  lastLogin?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PhoneNumberResolvers<ContextType = any, ParentType extends ResolversParentTypes['PhoneNumber'] = ResolversParentTypes['PhoneNumber']> = {
  number?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  verified?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EmailAddressResolvers<ContextType = any, ParentType extends ResolversParentTypes['EmailAddress'] = ResolversParentTypes['EmailAddress']> = {
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  verified?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserProfileResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserProfile'] = ResolversParentTypes['UserProfile']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  summary?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  imageURL?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  platforms?: Resolver<ResolversTypes['UserPlatforms'], ParentType, ContextType>;
  watchlists?: Resolver<Array<ResolversTypes['Watchlist']>, ParentType, ContextType>;
  posts?: Resolver<Array<ResolversTypes['BlogPost']>, ParentType, ContextType>;
  comments?: Resolver<Array<ResolversTypes['Comment']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserPlatformsResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserPlatforms'] = ResolversParentTypes['UserPlatforms']> = {
  twitter?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AuthCredentialsResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthCredentials'] = ResolversParentTypes['AuthCredentials']> = {
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  me?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  userProfile?: Resolver<ResolversTypes['UserProfile'], ParentType, ContextType, RequireFields<QueryUserProfileArgs, 'id'>>;
  companyProfile?: Resolver<ResolversTypes['CompanyProfile'], ParentType, ContextType, RequireFields<QueryCompanyProfileArgs, 'symbol'>>;
  searchTickers?: Resolver<Array<ResolversTypes['Stock']>, ParentType, ContextType, RequireFields<QuerySearchTickersArgs, 'filters'>>;
  latestNews?: Resolver<Array<ResolversTypes['StockNews']>, ParentType, ContextType>;
  intradayRecords?: Resolver<Array<ResolversTypes['IntradayRecord']>, ParentType, ContextType, RequireFields<QueryIntradayRecordsArgs, 'symbol'>>;
  singleBlogPost?: Resolver<ResolversTypes['BlogPost'], ParentType, ContextType, RequireFields<QuerySingleBlogPostArgs, 'id'>>;
  filterBlogPosts?: Resolver<Array<ResolversTypes['BlogPost']>, ParentType, ContextType, RequireFields<QueryFilterBlogPostsArgs, 'filters'>>;
  reactions?: Resolver<Array<ResolversTypes['Reaction']>, ParentType, ContextType, RequireFields<QueryReactionsArgs, 'id' | 'limit' | 'offset'>>;
  myDrafts?: Resolver<Array<ResolversTypes['BlogPost']>, ParentType, ContextType, RequireFields<QueryMyDraftsArgs, never>>;
  commentThread?: Resolver<Array<ResolversTypes['Comment']>, ParentType, ContextType, RequireFields<QueryCommentThreadArgs, 'parent' | 'filters'>>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createUser?: Resolver<ResolversTypes['AuthCredentials'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'data'>>;
  loginUser?: Resolver<ResolversTypes['AuthCredentials'], ParentType, ContextType, RequireFields<MutationLoginUserArgs, 'data'>>;
  logoutUser?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  verifyEmail?: Resolver<Maybe<ResolversTypes['AuthCredentials']>, ParentType, ContextType, RequireFields<MutationVerifyEmailArgs, 'code'>>;
  verifyPhone?: Resolver<Maybe<ResolversTypes['AuthCredentials']>, ParentType, ContextType, RequireFields<MutationVerifyPhoneArgs, 'code'>>;
  verifyOTP?: Resolver<ResolversTypes['AuthCredentials'], ParentType, ContextType, RequireFields<MutationVerifyOtpArgs, 'code'>>;
  forgotPassword?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationForgotPasswordArgs, 'email'>>;
  resetPassword?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationResetPasswordArgs, 'data'>>;
  refreshToken?: Resolver<ResolversTypes['AuthCredentials'], ParentType, ContextType>;
  deactivateAccount?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updateUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'data'>>;
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

export type QuoteResolvers<ContextType = any, ParentType extends ResolversParentTypes['Quote'] = ResolversParentTypes['Quote']> = {
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  changesPercentage?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  change?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  dayLow?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  dayHigh?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  yearHigh?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  yearLow?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  marketCap?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  priceAvg50?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  priceAvg200?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  volume?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  avgVolume?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  exchange?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  open?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  previousClose?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  eps?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  pe?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  earningsAnnouncement?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sharesOutstanding?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StockNewsResolvers<ContextType = any, ParentType extends ResolversParentTypes['StockNews'] = ResolversParentTypes['StockNews']> = {
  symbol?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  publishedDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  image?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  site?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StockResolvers<ContextType = any, ParentType extends ResolversParentTypes['Stock'] = ResolversParentTypes['Stock']> = {
  symbol?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  currency?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  stockExchange?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  exchangeShortName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  news?: Resolver<Array<ResolversTypes['StockNews']>, ParentType, ContextType>;
  quote?: Resolver<ResolversTypes['Quote'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CompanyProfileResolvers<ContextType = any, ParentType extends ResolversParentTypes['CompanyProfile'] = ResolversParentTypes['CompanyProfile']> = {
  symbol?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  beta?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  volAvg?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  mktCap?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  lastDiv?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  range?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  changes?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  companyName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  currency?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isin?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cusip?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  exchange?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  exchangeShortName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  industry?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  website?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ceo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sector?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  country?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  fullTimeEmployees?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  city?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  state?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  zip?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  dcfDiff?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  dcf?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ipoDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  news?: Resolver<Array<ResolversTypes['StockNews']>, ParentType, ContextType>;
  quote?: Resolver<ResolversTypes['Quote'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IntradayRecordResolvers<ContextType = any, ParentType extends ResolversParentTypes['IntradayRecord'] = ResolversParentTypes['IntradayRecord']> = {
  open?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  low?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  high?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  close?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  volume?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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
  PhoneNumber?: PhoneNumberResolvers<ContextType>;
  EmailAddress?: EmailAddressResolvers<ContextType>;
  UserProfile?: UserProfileResolvers<ContextType>;
  UserPlatforms?: UserPlatformsResolvers<ContextType>;
  AuthCredentials?: AuthCredentialsResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Quote?: QuoteResolvers<ContextType>;
  StockNews?: StockNewsResolvers<ContextType>;
  Stock?: StockResolvers<ContextType>;
  CompanyProfile?: CompanyProfileResolvers<ContextType>;
  IntradayRecord?: IntradayRecordResolvers<ContextType>;
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
