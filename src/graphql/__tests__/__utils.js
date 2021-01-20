/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

const { ApolloServer } = require("apollo-server-express");
const { AuthAPI, UserAPI, UserContentAPI } = require("../sources");
const { default: typeDefs } = require("../schema");
const { default: resolvers } = require("../resolvers");

const {
  mockUserService,
  mockMediaService,
} = require("../sources/__tests__/users.test");
const { mockAuthService } = require("../sources/__tests__/auth.test");
const { mockUserContentService } = require("../sources/__tests__/content.test");
const { NotificationService } = require("../../services");

const buildTestServer = async (options) => {
  const users = new UserAPI();
  const auth = new AuthAPI();
  const content = new UserContentAPI();

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

  const mockNotificationService = new NotificationService({
    from: "test@email.com",
  });

  mockNotificationService.sendEmail = jest.fn();
  mockNotificationService.sendSMS = jest.fn();

  const verifiedUser = options ? options.verified || false : false;

  const context = {
    user: { id: 1, verified: verifiedUser },
    client: { name: "web" },
    userService: mockUserService,
    authService: mockAuthService,
    contentService: mockUserContentService,
    notificationService: mockNotificationService,
    mediaService: mockMediaService,
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
    mockUserContentService,
    mockMediaService,
  };
};

module.exports = { buildTestServer };
