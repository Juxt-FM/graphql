/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

const { createTestClient } = require("apollo-server-testing");
const { ValidationError } = require("../../services");

const { buildTestServer } = require("./__utils");

const { mutations, queries } = require("../__mocks__/auth");
const { mockUser } = require("../../database/__mocks__/auth");

const mockDeviceInput = {
  id: "1",
  platform: "ios",
  model: "iPhone X",
};

test("QUERY me", async () => {
  const { server, mockAuthService } = await buildTestServer();

  mockAuthService.getUser.mockReturnValueOnce(mockUser);

  const { query } = createTestClient(server);
  const res = await query({
    query: queries.AUTH_USER,
  });

  expect(res.data.me.id).toEqual(mockUser.id);
});

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
      mutation: mutations.CREATE_USER,
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
      mutation: mutations.CREATE_USER,
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
      mutation: mutations.LOGIN,
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
      mutation: mutations.LOGIN,
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
      mutation: mutations.RESET_PASSWORD,
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
      mutation: mutations.RESET_PASSWORD,
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
    mutation: mutations.REFRESH_TOKEN,
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
    mutation: mutations.LOGOUT,
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
      mutation: mutations.VERIFY_EMAIL,
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
      mutation: mutations.VERIFY_EMAIL,
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
      mutation: mutations.VERIFY_PHONE,
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
      mutation: mutations.VERIFY_PHONE,
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
    mutation: mutations.UPDATE_EMAIL,
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
    mutation: mutations.UPDATE_PHONE,
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
    mutation: mutations.DEACTIVATE_ACCOUNT,
  });

  expect(res.data.deactivateAccount).toEqual(message);
});

const mockCredentials = {
  accessToken: "fdsjkafhdsajklfhdjsakfhjlksadfaf",
  refreshToken: "sadhfkjasdhfadsjkflashfjasldfhlas",
};
