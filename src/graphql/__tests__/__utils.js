const { ApolloServer } = require("apollo-server-express");
const { AuthAPI, UserAPI } = require("../sources");
const { default: typeDefs } = require("../schema");
const { default: resolvers } = require("../resolvers");

const { mockUserService } = require("../sources/__tests__/users.test");
const {
  mockAuthService,
  mockVerificationService,
} = require("../sources/__tests__/auth.test");
const { NotificationService } = require("../../services");

const buildTestServer = async () => {
  const users = new UserAPI();
  const auth = new AuthAPI();
  const mockNotificationService = new NotificationService({
    from: "test@email.com",
  });

  mockNotificationService.sendEmail = jest.fn();
  mockNotificationService.sendSMS = jest.fn();

  const context = {
    user: { id: 1, verified: false },
    userService: mockUserService,
    authService: mockAuthService,
    verificationService: mockVerificationService,
    notificationService: mockNotificationService,
    apcaKeyId: "some_alpaca_key_id",
    apcaSecretKey: "some_alpaca_secret_key",
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
    mockVerificationService,
    mockNotificationService,
  };
};

module.exports = { buildTestServer };
