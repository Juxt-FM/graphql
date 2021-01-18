const { ApolloServer } = require("apollo-server-express");
const { AuthAPI, UserAPI } = require("../sources");
const { default: typeDefs } = require("../schema");
const { default: resolvers } = require("../resolvers");

const { mockUserService } = require("../sources/__tests__/users.test");
const { mockAuthService } = require("../sources/__tests__/auth.test");
const { NotificationService } = require("../../services");

const buildTestServer = async (options) => {
  const users = new UserAPI();
  const auth = new AuthAPI();

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
    userService: mockUserService,
    authService: mockAuthService,
    notificationService: mockNotificationService,
    expressCtx: mockExpressContext,
  };

  const dataSources = () => ({
    users,
    auth,
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
  };
};

module.exports = { buildTestServer };
