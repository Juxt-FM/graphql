/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

const { ApolloError, UserInputError } = require("apollo-server-express");

const { AuthAPI } = require("../auth");
const { ServiceError, ValidationError } = require("../../../services");

const { mockDeviceArgs } = require("../../../database/__mocks__/auth");

const mockAuthService = {
  login: jest.fn(),
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
  client: { name: "web" },
  host: "127.0.0.1",
  authService: mockAuthService,
  expressCtx: mockExpressContext,
};

const ds = new AuthAPI();

ds.initialize({ context: mockContext });

describe("base API (using login action)", () => {
  it("should authenticate the user", async () => {
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

  it("should handle service error - bad input", async () => {
    const errorMsg = "some error";

    mockAuthService.login.mockImplementationOnce(() => {
      const err = new ValidationError(errorMsg);
      err.invalidArgs = ["identifier", "password"];

      throw err;
    });

    const data = {
      identifier: "test@email.com",
      password: "ab12cd34",
    };

    const result = await ds.loginUser(data, mockDeviceArgs);

    expect(result instanceof UserInputError).toEqual(true);
    expect(result.message).toEqual(errorMsg);
    expect(result.invalidArgs).toEqual(["identifier", "password"]);
  });

  it("should handle service error - other", async () => {
    const errorMsg = "some error";

    mockAuthService.login.mockImplementationOnce(() => {
      throw new ServiceError(errorMsg);
    });

    const data = {
      identifier: "test@email.com",
      password: "ab12cd34",
    };

    const result = await ds.loginUser(data, mockDeviceArgs);

    expect(result instanceof ApolloError).toEqual(true);
    expect(result.message).toEqual(errorMsg);
  });

  it("should handle unknown error", async () => {
    mockAuthService.login.mockImplementationOnce(() => {
      throw new Error("unknown error");
    });

    const data = {
      identifier: "test@email.com",
      password: "ab12cd34",
    };

    const result = await ds.loginUser(data, mockDeviceArgs);

    expect(result instanceof ApolloError).toEqual(true);
    expect(result.message).toEqual(
      "An error occurred while processing your request."
    );
  });
});

const mockCredentials = {
  accessToken: "fdsjkafhdsajklfhdjsakfhjlksadfaf",
  refreshToken: "sadhfkjasdhfadsjkflashfjasldfhlas",
};
