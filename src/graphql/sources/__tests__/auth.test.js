const { AuthAPI } = require("../auth");

const mockService = {
  register: jest.fn(),
  login: jest.fn(),
  resetPassword: jest.fn(),
  refreshAccessToken: jest.fn(),
  forgotPassword: jest.fn(),
  logout: jest.fn(),
  verifyEmail: jest.fn(),
  verifyPhone: jest.fn(),
  authenticateOTP: jest.fn(),
  deactivateAccount: jest.fn(),
};

const mockMailService = {
  sendEmail: jest.fn(),
};

const mockVerificationService = {
  createCode: jest.fn(),
  email: jest.fn(),
  phone: jest.fn(),
  otp: jest.fn(),
};

const mockContext = {
  user: { id: 1, verified: true },
  authService: mockService,
  notificationService: mockMailService,
  verificationService: mockVerificationService,
};

const ds = new AuthAPI();

ds.initialize({ context: mockContext });

describe("auth.register", () => {
  it("register a new user account", async () => {
    mockVerificationService.createCode.mockReturnValueOnce(mockCode);
    mockService.register.mockReturnValueOnce({
      user: { email: "some@email.com" },
      credentials: mockAuthCredentials,
    });

    const data = {
      email: "test@email.com",
      firstName: "Test",
      lastName: "User",
      password: "ab12cd34",
      confirmPassword: "ab12cd34",
    };

    const res = await ds.registerUser(data);

    expect(res).toEqual(mockAuthCredentials);
    expect(mockService.register).toBeCalledWith(data);
  });
});

describe("auth.login", () => {
  it("log in a user", async () => {
    mockService.login.mockReturnValueOnce(mockAuthCredentials);

    const data = {
      email: "test@email.com",
      password: "ab12cd34",
    };

    const res = await ds.loginUser(data);

    expect(res).toEqual(mockAuthCredentials);
    expect(mockService.login).toBeCalledWith(data);
  });
});

describe("auth.loginOTP", () => {
  it("log in a user with a one time password", async () => {
    const mockVerification = {
      user: { id: 1 },
      populate: jest.fn(),
    };

    mockVerification.populate.mockReturnValueOnce({
      execPopulate: jest.fn(),
    });
    mockVerificationService.otp.mockReturnValueOnce(mockVerification);
    mockService.authenticateOTP.mockReturnValueOnce(mockAuthCredentials);

    const code = "ABCDEFG";

    const res = await ds.loginOTP(code);

    expect(res).toEqual(mockAuthCredentials);
    expect(mockVerificationService.otp).toBeCalledWith(code);
    expect(mockService.authenticateOTP).toBeCalledWith({ id: 1 });
  });
});

describe("auth.resetPassword", () => {
  it("resets a user's password", async () => {
    mockService.resetPassword.mockReturnValueOnce("Success return string.");

    const data = {
      password: "ab12cd34",
      confirmPassword: "ab12cd34",
    };

    const res = await ds.resetPassword(data);

    expect(typeof res).toEqual("string");
    expect(mockService.resetPassword).toBeCalledWith(mockContext.user.id, data);
  });
});

describe("auth.refreshToken", () => {
  it("refreshes a user's access token", async () => {
    mockService.refreshAccessToken.mockReturnValueOnce(mockAuthCredentials);

    const res = await ds.refreshToken();

    expect(res).toEqual(mockAuthCredentials);
  });

  describe("auth.logout", () => {
    it("clears credentials from any cookies", async () => {
      mockService.logout.mockReturnValueOnce("success string");

      const res = await ds.logoutUser();

      expect(typeof res).toEqual("string");
    });
  });
});

describe("auth.verifyEmail", () => {
  it("verifies a user's identity", async () => {
    mockVerificationService.email.mockReturnValueOnce(null);
    mockService.verifyEmail.mockReturnValueOnce(mockAuthCredentials);

    const code = "ABCDEFG";

    const res = await ds.verifyEmail(code);

    expect(res).toEqual(mockAuthCredentials);
    expect(mockVerificationService.email).toBeCalledWith(
      mockContext.user.id,
      code
    );
    expect(mockService.verifyEmail).toBeCalledWith(mockContext.user.id, false);
  });
});

describe("auth.verifyPhone", () => {
  it("verifies a user's identity", async () => {
    mockVerificationService.phone.mockReturnValueOnce(null);
    mockService.verifyPhone.mockReturnValueOnce(mockAuthCredentials);

    const code = "ABCDEFG";

    const res = await ds.verifyPhone(code);

    expect(res).toEqual(mockAuthCredentials);
    expect(mockVerificationService.phone).toBeCalledWith(
      mockContext.user.id,
      code
    );
    expect(mockService.verifyPhone).toBeCalledWith(mockContext.user.id, false);
  });
});

describe("auth.deactivateAccount", () => {
  it("deactivates a user's account", async () => {
    mockService.deactivateAccount.mockReturnValueOnce("Done.");

    const res = await ds.deactivateAccount();

    expect(res).toEqual("Done.");
    expect(mockService.deactivateAccount).toBeCalledWith(mockContext.user.id);
  });
});

/**
 * Mock data
 */

const mockAuthCredentials = {
  accessToken:
    "thisisaverylongtokengeneratedbyajwtsigningfunctioninmyauthservice",
};

const mockCode = {
  type: "email_verification",
  user: 1,
  code: "ABCDEF",
  issuedBy: "http://127.0.0.1",
  issuedAt: new Date(),
  expiresAt: new Date(Date.now() + 5 * 60 * 1000),
};

module.exports = {
  mockAuthCredentials,
  mockCode,
  mockAuthService: mockService,
  mockVerificationService,
};
