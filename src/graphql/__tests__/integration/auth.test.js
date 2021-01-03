const { createTestClient } = require("apollo-server-testing");
const { gql } = require("apollo-server-express");
const { buildTestServer } = require("../__utils");

const {
  mockAuthCredentials,
  mockCode,
} = require("../../sources/__tests__/auth.test");
const { mockUser } = require("../../sources/__tests__/users.test");

const CREATE_USER = gql`
  mutation CreateUser($data: CreateUserInput!) {
    createUser(data: $data) {
      accessToken
    }
  }
`;

const LOGIN = gql`
  mutation Login($data: LoginUserInput!) {
    loginUser(data: $data) {
      accessToken
    }
  }
`;

const RESET_PASSWORD = gql`
  mutation ResetPassword($data: PasswordResetInput!) {
    resetPassword(data: $data)
  }
`;

const REFRESH_TOKEN = gql`
  mutation {
    refreshToken {
      accessToken
    }
  }
`;

const LOGOUT = gql`
  mutation {
    logoutUser
  }
`;

const FORGOT_PASSWORD = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email)
  }
`;

const VERIFY_OTP = gql`
  mutation VerifyOTP($code: String!) {
    verifyOTP(code: $code) {
      accessToken
    }
  }
`;

const VERIFY_EMAIL = gql`
  mutation VerifyEmail($code: String!) {
    verifyEmail(code: $code) {
      accessToken
    }
  }
`;

const VERIFY_PHONE = gql`
  mutation VerifyPhone($code: String!) {
    verifyPhone(code: $code) {
      accessToken
    }
  }
`;

const DEACTIVATE_ACCOUNT = gql`
  mutation {
    deactivateAccount
  }
`;

describe("Auth Mutations", () => {
  it("create user account", async () => {
    const {
      server,
      mockAuthService,
      mockVerificationService,
    } = await buildTestServer();

    mockAuthService.register.mockReturnValueOnce({
      user: mockUser,
      credentials: mockAuthCredentials,
    });
    mockVerificationService.createCode.mockReturnValueOnce(mockCode);

    const { mutate } = createTestClient(server);
    const res = await mutate({
      mutation: CREATE_USER,
      variables: {
        data: {
          name: "Test User",
          email: "new@email.com",
          phoneNumber: "+11234567890",
          password: "ab12cd34",
          confirmPassword: "ab12cd34",
        },
      },
    });

    expect(res).toMatchSnapshot();
  });

  it("log in user", async () => {
    const { server, mockAuthService } = await buildTestServer();

    mockAuthService.login.mockReturnValueOnce(mockAuthCredentials);

    const { mutate } = createTestClient(server);
    const res = await mutate({
      mutation: LOGIN,
      variables: {
        data: {
          identifier: "new@email.com",
          password: "ab12cd34",
        },
      },
    });

    expect(res).toMatchSnapshot();
  });

  it("reset current user's password", async () => {
    const { server, mockAuthService } = await buildTestServer();

    mockAuthService.resetPassword.mockReturnValueOnce(
      "Successful password reset"
    );

    const { mutate } = createTestClient(server);
    const res = await mutate({
      mutation: RESET_PASSWORD,
      variables: {
        data: {
          password: "ab12cd34",
          confirmPassword: "ab12cd34",
        },
      },
    });

    expect(typeof res.data.resetPassword).toEqual("string");
  });

  it("refresh a user's access token", async () => {
    const { server, mockAuthService } = await buildTestServer();

    mockAuthService.refreshAccessToken.mockReturnValueOnce(mockAuthCredentials);

    const { mutate } = createTestClient(server);
    const res = await mutate({
      mutation: REFRESH_TOKEN,
    });

    expect(res).toMatchSnapshot();
  });

  it("logout a user", async () => {
    const { server, mockAuthService } = await buildTestServer();

    mockAuthService.logout.mockReturnValueOnce("some success string");

    const { mutate } = createTestClient(server);
    const res = await mutate({
      mutation: LOGOUT,
    });

    expect(typeof res.data.logoutUser).toEqual("string");
  });

  it("forgot password", async () => {
    const {
      server,
      mockUserService,
      mockVerificationService,
      mockNotificationService,
    } = await buildTestServer();

    mockUserService.getByEmail.mockReturnValueOnce(mockUser);
    mockVerificationService.createCode.mockReturnValueOnce({ code: "ABCCDEF" });
    mockNotificationService.sendEmail.mockReturnValueOnce(null);

    const { mutate } = createTestClient(server);
    const res = await mutate({
      mutation: FORGOT_PASSWORD,
      variables: {
        email: "test@email.com",
      },
    });

    expect(typeof res.data.forgotPassword).toEqual("string");
  });

  it("forgot password", async () => {
    const {
      server,
      mockUserService,
      mockVerificationService,
      mockNotificationService,
    } = await buildTestServer();

    mockUserService.getByEmail.mockReturnValueOnce(mockUser);
    mockVerificationService.createCode.mockReturnValueOnce({ code: "ABCCDEF" });
    mockNotificationService.sendEmail.mockReturnValueOnce(null);

    const { mutate } = createTestClient(server);
    const res = await mutate({
      mutation: FORGOT_PASSWORD,
      variables: {
        email: "test@email.com",
      },
    });

    expect(typeof res.data.forgotPassword).toEqual("string");
  });

  it("verify OTP", async () => {
    const {
      server,
      mockAuthService,
      mockVerificationService,
    } = await buildTestServer();

    const mockVerification = {
      user: { id: 1 },
      populate: jest.fn(),
    };

    mockVerification.populate.mockReturnValueOnce({
      execPopulate: jest.fn(),
    });
    mockVerificationService.otp.mockReturnValueOnce(mockVerification);
    mockAuthService.authenticateOTP.mockReturnValueOnce(mockAuthCredentials);

    const { mutate } = createTestClient(server);
    const res = await mutate({
      mutation: VERIFY_OTP,
      variables: {
        code: "AB12CD",
      },
    });

    expect(res).toMatchSnapshot();
  });

  it("verify email", async () => {
    const {
      server,
      mockAuthService,
      mockVerificationService,
    } = await buildTestServer();

    mockVerificationService.email.mockReturnValueOnce();
    mockAuthService.verifyEmail.mockReturnValueOnce(mockAuthCredentials);

    const { mutate } = createTestClient(server);
    const res = await mutate({
      mutation: VERIFY_EMAIL,
      variables: {
        code: "AB12CD",
      },
    });

    expect(res).toMatchSnapshot();
  });

  it("verify phone", async () => {
    const {
      server,
      mockAuthService,
      mockVerificationService,
    } = await buildTestServer();

    mockVerificationService.phone.mockReturnValueOnce();
    mockAuthService.verifyPhone.mockReturnValueOnce(mockAuthCredentials);

    const { mutate } = createTestClient(server);
    const res = await mutate({
      mutation: VERIFY_PHONE,
      variables: {
        code: "AB12CD",
      },
    });

    expect(res).toMatchSnapshot();
  });

  it("deactivate account", async () => {
    const { server, mockAuthService } = await buildTestServer();

    mockAuthService.deactivateAccount.mockReturnValueOnce("some string");

    const { mutate } = createTestClient(server);
    const res = await mutate({
      mutation: DEACTIVATE_ACCOUNT,
    });

    expect(typeof res.data.deactivateAccount).toEqual("string");
  });
});
