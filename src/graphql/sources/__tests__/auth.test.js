const { ApolloError, UserInputError } = require("apollo-server-express");
const { AuthAPI } = require("../auth");
const { ServiceError, ValidationError } = require("../../../services");

const {
  mockUser,
  mockDevice,
  mockDeviceArgs,
} = require("../../../db/__mocks__/auth");

const mockAuthService = {
  getUser: jest.fn(),
  login: jest.fn(),
  register: jest.fn(),
  updateEmail: jest.fn(),
  updatePhone: jest.fn(),
  logout: jest.fn(),
  refreshToken: jest.fn(),
  resetPassword: jest.fn(),
  verifyEmail: jest.fn(),
  verifyPhone: jest.fn(),
  deactivateAccount: jest.fn(),
};

const mockNotificationService = {
  sendEmail: jest.fn(),
  sendSMS: jest.fn(),
};

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

const mockContext = {
  user: { id: 1, verified: true },
  host: "127.0.0.1",
  authService: mockAuthService,
  notificationService: mockNotificationService,
  expressCtx: mockExpressContext,
};

const ds = new AuthAPI();

ds.initialize({ context: mockContext });

test("getRefreshToken - should retrieve refresh token", () => {
  const token = ds.getRefreshToken();

  expect(token).toEqual(mockExpressContext.req.signedCookies.device_token);
});

test("setRefreshCookie - should put the refresh token in a cookie", () => {
  const token = "fjaskflhasddfafd";
  ds.setRefreshCookie(token);

  expect(mockExpressContext.res.cookie).toBeCalledWith("device_token", token, {
    expires: expect.anything(),
    httpOnly: true,
    path: "/",
    signed: true,
  });
});

test("clearRefreshCookie - should clear the refresh token cookie", () => {
  ds.clearRefreshCookie();

  expect(mockExpressContext.res.cookie).toBeCalledWith(
    "device_token",
    undefined,
    {
      expires: expect.anything(),
      httpOnly: true,
      path: "/",
      signed: true,
    }
  );
});

test("getCurrentUser - should return the logged in user", async () => {
  mockAuthService.getUser.mockReturnValueOnce(mockUser);

  const result = await ds.getCurrentUser();

  expect(mockAuthService.getUser).toBeCalledWith(mockContext.user.id);
  expect(result).toEqual(mockUser);
});

test("loginUser - should authenticate the user", async () => {
  const cookieSetter = jest.spyOn(ds, "setRefreshCookie");

  mockAuthService.login.mockReturnValueOnce(mockCredentials);

  const expectedCredentials = Object.assign({}, mockCredentials);

  const data = {
    identifier: "test@email.com",
    password: "ab12cd34",
  };

  const result = await ds.loginUser(data, mockDeviceArgs);

  expect(mockAuthService.login).toBeCalledWith(data, {
    ...mockDeviceArgs,
    address: mockContext.host,
  });
  expect(cookieSetter).toBeCalledTimes(1);
  expect(cookieSetter).toBeCalledWith(expectedCredentials.refreshToken);
  expect(result.accessToken).toEqual(expectedCredentials.accessToken);
});

test("registerUser - should create and authenticate the user", async () => {
  const cookieSetter = jest.spyOn(ds, "setRefreshCookie");

  const mockResponse = {
    user: mockUser,
    credentials: mockCredentials,
    code: "ABCDEFG",
  };

  mockAuthService.register.mockReturnValueOnce(mockResponse);

  const data = {
    email: "test@email.com",
    password: "ab12cd34",
    confirmPassword: "ab12cd34",
  };

  const result = await ds.registerUser(data, mockDeviceArgs);

  expect(mockAuthService.register).toBeCalledWith(data, {
    ...mockDeviceArgs,
    address: mockContext.host,
  });

  expect(mockNotificationService.sendEmail).toBeCalledWith(
    [mockResponse.user.email],
    expect.any(String),
    expect.stringContaining(mockResponse.code)
  );

  expect(cookieSetter).toBeCalledTimes(1);
  expect(cookieSetter).toBeCalledWith(mockCredentials.refreshToken);
  expect(result.accessToken).toEqual(mockCredentials.accessToken);
});

test("updateEmail - should the user's email address", async () => {
  const mockResponse = { user: mockUser, code: "ABCDEFG" };

  mockAuthService.updateEmail.mockReturnValueOnce(mockResponse);

  const email = "updated@email.com";

  const result = await ds.updateEmail(email);

  expect(mockAuthService.updateEmail).toBeCalledWith(
    mockContext.user.id,
    email
  );

  expect(mockNotificationService.sendEmail).toBeCalledWith(
    [mockResponse.user.email],
    expect.any(String),
    expect.stringContaining(mockResponse.code)
  );

  expect(result).toEqual(mockResponse.user);
});

test("updatePhone - should the user's phone number", async () => {
  const mockResponse = { user: mockUser, code: "ABCDEFG" };

  mockAuthService.updatePhone.mockReturnValueOnce(mockResponse);

  const phone = "+11234567890";

  const result = await ds.updatePhone(phone);

  expect(mockAuthService.updatePhone).toBeCalledWith(
    mockContext.user.id,
    phone
  );

  expect(mockNotificationService.sendSMS).toBeCalledWith(
    [mockResponse.user.phone],
    expect.stringContaining(mockResponse.code)
  );

  expect(result).toEqual(mockResponse.user);
});

test("logoutUser - should log out", async () => {
  const clearCookie = jest.spyOn(ds, "clearRefreshCookie");
  const message = "logout success";

  mockAuthService.logout.mockReturnValueOnce(message);

  const result = await ds.logoutUser(mockDevice.id);

  expect(mockAuthService.logout).toBeCalledWith(
    mockContext.user.id,
    mockDevice.id
  );

  expect(clearCookie).toBeCalledTimes(1);
  expect(result).toEqual(message);
});

test("refreshToken - should return new credentials", async () => {
  const cookieSetter = jest.spyOn(ds, "setRefreshCookie");

  mockAuthService.refreshToken.mockReturnValueOnce(mockCredentials);

  const result = await ds.refreshToken(mockDevice.id);

  expect(mockAuthService.refreshToken).toBeCalledWith(
    mockDevice.id,
    mockExpressContext.req.signedCookies.device_token
  );

  expect(cookieSetter).toBeCalledTimes(1);
  expect(cookieSetter).toBeCalledWith(mockCredentials.refreshToken);
  expect(result.accessToken).toEqual(mockCredentials.accessToken);
});

test("resetPassword - should reset a user's password", async () => {
  const message = "password reset success";

  mockAuthService.resetPassword.mockReturnValueOnce(message);

  const args = { password: "ab12cd34", confirmPassword: "ab12cd34" };

  const result = await ds.resetPassword(args);

  expect(mockAuthService.resetPassword).toBeCalledWith(
    mockContext.user.id,
    args
  );

  expect(result).toEqual(message);
});

describe("verifyEmail", () => {
  it("should verify a user's email and return undefiend", async () => {
    const code = "ABCDEFG";

    const result = await ds.verifyEmail(code);

    expect(mockAuthService.verifyEmail).toBeCalledWith(
      mockContext.user.id,
      code,
      !mockContext.user.verified
    );

    expect(result).toEqual(undefined);
  });

  it("should verify a user's email and reauthenticate", async () => {
    mockAuthService.verifyEmail.mockReturnValueOnce(mockCredentials);

    const code = "ABCDEFG";

    const ds = new AuthAPI();

    ds.initialize({
      context: {
        ...mockContext,
        user: { ...mockContext.user, verified: false },
      },
    });

    const result = await ds.verifyEmail(code);

    expect(mockAuthService.verifyEmail).toBeCalledWith(
      mockContext.user.id,
      code,
      true
    );

    expect(result.accessToken).toEqual(mockCredentials.accessToken);
  });
});

describe("verifyPhone", () => {
  it("should verify a user's phone and return undefined", async () => {
    const code = "ABCDEFG";

    const result = await ds.verifyPhone(code);

    expect(mockAuthService.verifyPhone).toBeCalledWith(
      mockContext.user.id,
      code,
      !mockContext.user.verified
    );

    expect(result).toEqual(undefined);
  });

  it("should verify a user's phone and reauthenticate", async () => {
    mockAuthService.verifyPhone.mockReturnValueOnce(mockCredentials);

    const code = "ABCDEFG";

    const ds = new AuthAPI();

    ds.initialize({
      context: {
        ...mockContext,
        user: { ...mockContext.user, verified: false },
      },
    });

    const result = await ds.verifyPhone(code);

    expect(mockAuthService.verifyPhone).toBeCalledWith(
      mockContext.user.id,
      code,
      true
    );

    expect(result.accessToken).toEqual(mockCredentials.accessToken);
  });
});

test("deactivateAccount - should deactivate a user's account", async () => {
  const message = "account deactivated";

  mockAuthService.deactivateAccount.mockReturnValueOnce(message);

  const result = await ds.deactivateAccount();

  expect(mockAuthService.deactivateAccount).toBeCalledWith(mockContext.user.id);

  expect(result).toEqual(message);
});

const mockCredentials = {
  accessToken: "fdsjkafhdsajklfhdjsakfhjlksadfaf",
  refreshToken: "sadhfkjasdhfadsjkflashfjasldfhlas",
};

module.exports = { mockCredentials, mockAuthService };
