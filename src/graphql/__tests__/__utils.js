/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

const { ApolloServer } = require("apollo-server-express");
const { AuthAPI, UserAPI, ContentAPI } = require("../sources");
const { default: typeDefs } = require("../schema");
const { default: resolvers } = require("../resolvers");

const {
  UserService,
  ...mockUserService
} = require("../../services/__mocks__/user-service");
const {
  AuthService,
  ...mockAuthService
} = require("../../services/__mocks__/auth-service");
const {
  MediaService,
  ...mockMediaService
} = require("../../services/__mocks__/media-service");
const {
  ContentService,
  ...mockContentService
} = require("../../services/__mocks__/content-service");
const {
  NotificationService,
  ...mockNotificationService
} = require("../../services/__mocks__/notification-service");

const buildTestServer = async (options) => {
  const users = new UserAPI();
  const auth = new AuthAPI();
  const content = new ContentAPI();

  const mockExpressContext = {
    req: {
      signedCookies: {
        device_token: "fhjasdljkfhasjkfhadslkjfhklajsfhkladsfjfs",
      },
    },
    res: {
      cookie: jest.fn(),
    },
  };

  const verifiedUser = options ? options.verified : false;

  const context = {
    user: { id: 1, verified: verifiedUser },
    client: { name: "web" },
    userService: mockUserService,
    authService: mockAuthService,
    contentService: mockContentService,
    mediaService: mockMediaService,
    notificationService: mockNotificationService,
    expressCtx: mockExpressContext,
  };

  const dataSources = () => ({
    users,
    auth,
    content,
  });

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
    dataSources,
  });

  return {
    server,
    mockUserService,
    mockAuthService,
    mockNotificationService,
    mockContentService,
    mockMediaService,
  };
};

module.exports = { buildTestServer };
