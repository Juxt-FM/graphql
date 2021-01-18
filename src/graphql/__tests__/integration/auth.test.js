const { createTestClient } = require("apollo-server-testing");
const { gql } = require("apollo-server-express");
const { ValidationError } = require("../../../services");

const { buildTestServer } = require("../__utils");

const { mockCredentials } = require("../../sources/__tests__/auth.test");
const { mockUser } = require("../../../db/__mocks__/auth");

const mockDeviceInput = {
  id: "1",
  platform: "ios",
  model: "iPhone X",
};

const AUTH_USER = gql`
  query {
    me {
      id
    }
  }
`;

test("QUERY me", async () => {
  const { server, mockAuthService } = await buildTestServer();

  mockAuthService.getUser.mockReturnValueOnce(mockUser);

  const { mutate } = createTestClient(server);
  const res = await mutate({
    query: AUTH_USER,
  });

  expect(res.data.me.id).toEqual(mockUser.id);
});

const CREATE_USER = gql`
  mutation CreateUser($data: UserInput!, $device: DeviceInput!) {
    createUser(data: $data, device: $device) {
      accessToken
    }
  }
`;

const LOGIN = gql`
  mutation Login($data: LoginInput!, $device: DeviceInput!) {
    loginUser(data: $data, device: $device) {
      accessToken
    }
  }
`;

const UPDATE_EMAIL = gql`
  mutation UpdateEmail($email: String!) {
    updateEmail(email: $email) {
      id
    }
  }
`;

const UPDATE_PHONE = gql`
  mutation UpdatePhone($phone: String!) {
    updatePhone(phone: $phone) {
      id
    }
  }
`;

const RESET_PASSWORD = gql`
  mutation ResetPassword($password: String!, $confirmPassword: String!) {
    resetPassword(password: $password, confirmPassword: $confirmPassword)
  }
`;

const REFRESH_TOKEN = gql`
  mutation Refresh($device: ID!) {
    refreshToken(device: $device) {
      accessToken
    }
  }
`;

const LOGOUT = gql`
  mutation Logout($device: ID!) {
    logoutUser(device: $device)
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

describe("MUTATION createUser", () => {
  it("should create a user's account", async () => {
    const { server, mockAuthService } = await buildTestServer();

    const mockResponse = {
      user: mockUser,
      credentials: mockCredentials,
      code: "ABCDEFG",
    };

    mockAuthService.register.mockReturnValueOnce(mockResponse);

    const { mutate } = createTestClient(server);
    const res = await mutate({
      mutation: CREATE_USER,
      variables: {
        data: {
          email: "new@email.com",
          password: "ab12cd34",
          confirmPassword: "ab12cd34",
        },
        device: mockDeviceInput,
      },
    });

    expect(res.data.createUser.accessToken).toEqual(
      mockResponse.credentials.accessToken
    );
  });

  it("should throw validation error", async () => {
    const { server, mockAuthService } = await buildTestServer();

    const errorMsg = "some validation error";

    mockAuthService.register.mockImplementationOnce(() => {
      const err = new ValidationError(errorMsg);
      err.invalidArgs = ["password", "identifier"];
      throw err;
    });

    const { mutate } = createTestClient(server);
    const res = await mutate({
      mutation: CREATE_USER,
      variables: {
        data: {
          email: "new@email.com",
          password: "ab12cd34",
          confirmPassword: "ab12cd34",
        },
        device: mockDeviceInput,
      },
    });

    expect(res.errors).toMatchSnapshot();
  });
});

describe("MUTATION loginUser", () => {
  it("should authenticate the user", async () => {
    const { server, mockAuthService } = await buildTestServer();

    mockAuthService.login.mockReturnValueOnce(mockCredentials);

    const { mutate } = createTestClient(server);

    const res = await mutate({
      mutation: LOGIN,
      variables: {
        data: {
          identifier: "new@email.com",
          password: "ab12cd34",
        },
        device: mockDeviceInput,
      },
    });

    expect(res.data.loginUser.accessToken).toEqual(mockCredentials.accessToken);
  });

  it("should throw validation error", async () => {
    const { server, mockAuthService } = await buildTestServer();

    const errorMsg = "some validation error";

    mockAuthService.login.mockImplementationOnce(() => {
      const err = new ValidationError(errorMsg);
      err.invalidArgs = ["password", "identifier"];
      throw err;
    });

    const { mutate } = createTestClient(server);

    const res = await mutate({
      mutation: LOGIN,
      variables: {
        data: {
          identifier: "new@email.com",
          password: "ab12cd34",
        },
        device: mockDeviceInput,
      },
    });

    expect(res.errors).toMatchSnapshot();
  });
});

describe("MUTATION resetPassword", () => {
  it("should reset the current user's password", async () => {
    const { server, mockAuthService } = await buildTestServer();

    const message = "some success string";

    mockAuthService.resetPassword.mockReturnValueOnce(message);

    const { mutate } = createTestClient(server);
    const res = await mutate({
      mutation: RESET_PASSWORD,
      variables: {
        password: "ab12cd34",
        confirmPassword: "ab12cd34",
      },
    });

    expect(res.data.resetPassword).toEqual(message);
  });

  it("should throw validation error", async () => {
    const { server, mockAuthService } = await buildTestServer();

    const errorMsg = "some validation error";

    mockAuthService.resetPassword.mockImplementationOnce(() => {
      const err = new ValidationError(errorMsg);
      err.invalidArgs = ["password", "confirmPassword"];
      throw err;
    });

    const { mutate } = createTestClient(server);
    const res = await mutate({
      mutation: RESET_PASSWORD,
      variables: {
        password: "ab12cd34",
        confirmPassword: "ab12cd34",
      },
    });

    expect(res.errors).toMatchSnapshot();
  });
});

test("MUTATION refreshToken", async () => {
  const { server, mockAuthService } = await buildTestServer();

  mockAuthService.refreshToken.mockReturnValueOnce(mockCredentials);

  const { mutate } = createTestClient(server);
  const res = await mutate({
    mutation: REFRESH_TOKEN,
    variables: { device: "1" },
  });

  expect(res.data.refreshToken.accessToken).toEqual(
    mockCredentials.accessToken
  );
});

test("MUTATION logoutUser", async () => {
  const { server, mockAuthService } = await buildTestServer();

  const message = "some success string";

  mockAuthService.logout.mockReturnValueOnce(message);

  const { mutate } = createTestClient(server);
  const res = await mutate({
    mutation: LOGOUT,
    variables: { device: "1" },
  });

  expect(res.data.logoutUser).toEqual(message);
});

describe("MUTATION verifyEmail", () => {
  it("should verify and reauthenticate", async () => {
    const { server, mockAuthService } = await buildTestServer({
      verified: false,
    });

    mockAuthService.verifyEmail.mockReturnValueOnce(mockCredentials);

    const { mutate } = createTestClient(server);
    const res = await mutate({
      mutation: VERIFY_EMAIL,
      variables: {
        code: "AB12CD",
      },
    });

    expect(res.data.verifyEmail.accessToken).toEqual(
      mockCredentials.accessToken
    );
  });

  it("should verify and return null", async () => {
    const { server, mockAuthService } = await buildTestServer({
      verified: true,
    });

    mockAuthService.verifyEmail.mockReturnValueOnce(undefined);

    const { mutate } = createTestClient(server);
    const res = await mutate({
      mutation: VERIFY_EMAIL,
      variables: {
        code: "AB12CD",
      },
    });

    expect(res.data.verifyEmail).toEqual(null);
  });
});

describe("MUTATION verifyPhone", () => {
  it("should verify and reauthenticate", async () => {
    const { server, mockAuthService } = await buildTestServer({
      verified: false,
    });

    mockAuthService.verifyPhone.mockReturnValueOnce(mockCredentials);

    const { mutate } = createTestClient(server);
    const res = await mutate({
      mutation: VERIFY_PHONE,
      variables: {
        code: "AB12CD",
      },
    });

    expect(res.data.verifyPhone.accessToken).toEqual(
      mockCredentials.accessToken
    );
  });

  it("should verify and return null", async () => {
    const { server, mockAuthService } = await buildTestServer({
      verified: true,
    });

    mockAuthService.verifyPhone.mockReturnValueOnce(undefined);

    const { mutate } = createTestClient(server);
    const res = await mutate({
      mutation: VERIFY_PHONE,
      variables: {
        code: "AB12CD",
      },
    });

    expect(res.data.verifyPhone).toEqual(null);
  });
});

test("MUTATION updateEmail", async () => {
  const { server, mockAuthService } = await buildTestServer();

  const mockResponse = {
    user: mockUser,
    code: "ABCDEFG",
  };

  mockAuthService.updateEmail.mockReturnValueOnce(mockResponse);

  const { mutate } = createTestClient(server);
  const res = await mutate({
    mutation: UPDATE_EMAIL,
    variables: { email: "updated@email.com" },
  });

  expect(res.data.updateEmail.id).toEqual(mockUser.id);
});

test("MUTATION updatePhone", async () => {
  const { server, mockAuthService } = await buildTestServer();

  const mockResponse = {
    user: mockUser,
    code: "ABCDEFG",
  };

  mockAuthService.updatePhone.mockReturnValueOnce(mockResponse);

  const { mutate } = createTestClient(server);
  const res = await mutate({
    mutation: UPDATE_PHONE,
    variables: { phone: "+11234567890" },
  });

  expect(res.data.updatePhone.id).toEqual(mockUser.id);
});

test("MUTATION deactivateAccount", async () => {
  const { server, mockAuthService } = await buildTestServer();

  const message = "some success string";

  mockAuthService.deactivateAccount.mockReturnValueOnce(message);

  const { mutate } = createTestClient(server);
  const res = await mutate({
    mutation: DEACTIVATE_ACCOUNT,
  });

  expect(res.data.deactivateAccount).toEqual(message);
});
