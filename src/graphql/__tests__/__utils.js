/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

const { ApolloServer } = require("apollo-server-express");
const { AuthAPI, UserAPI, ContentAPI, MarketAPI } = require("../sources");
const { default: typeDefs } = require("../schema");
const { default: resolvers } = require("../resolvers");

const mockUserService = require("../../services/__mocks__/users");
const mockAuthService = require("../../services/__mocks__/auth");
const mockMediaService = require("../../services/__mocks__/media");
const mockContentService = require("../../services/__mocks__/content");
const mockMarketService = require("../../services/__mocks__/market");
const mockNotificationService = require("../../services/__mocks__/notifications");

const buildTestServer = async (options) => {
  const users = new UserAPI();
  const auth = new AuthAPI();
  const market = new MarketAPI();
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
    marketService: mockMarketService,
    mediaService: mockMediaService,
    notificationService: mockNotificationService,
    expressCtx: mockExpressContext,
  };

  const dataSources = () => ({
    users,
    auth,
    content,
    market,
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
    mockMarketService,
  };
};

module.exports = { buildTestServer };
