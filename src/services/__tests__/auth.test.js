/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

const bcrypt = require("bcrypt");
const decodeJWT = require("jwt-decode");

const { AuthService } = require("../auth-service");
const { ServiceError, ValidationError } = require("../utils/errors");

const {
  mockUser,
  mockDevice,
  mockDeviceArgs,
} = require("../../database/mocks/auth");

const mockDbHandler = {
  isUniquePhone: jest.fn(),
  isUniqueEmail: jest.fn(),
  createUser: jest.fn(),
  updateEmail: jest.fn(),
  updatePhone: jest.fn(),
  findUserByID: jest.fn(),
  findUserByAttribute: jest.fn(),
  findUserByAuthStatus: jest.fn(),
  createDevice: jest.fn(),
  deviceLogin: jest.fn(),
  deviceLogout: jest.fn(),
  updateAuthStatus: jest.fn(),
  resetPassword: jest.fn(),
  verifyEmail: jest.fn(),
  verifyPhone: jest.fn(),
  deactivateAccount: jest.fn(),
};

const mockConfig = {
  jwtKey: "some_super_secret_key",
  jwtAudience: "audience",
  jwtIssuer: "issuer",
  jwtSubject: "the subject",
  jwtExpiration: "10 minutes",
  refreshCookie: "refresh_token",
};

const service = new AuthService(mockConfig, mockDbHandler);

test("getDefaultAuthenticationError - should return the default authentication error", () => {
  try {
    service.throwDefaultAuthenticationError();
    throw new Error();
  } catch (err) {
    expect(err instanceof ServiceError).toBe(true);
  }
});

test("signToken - should properly sign a JWT", async () => {
  const token = await service.signToken(mockUser);

  const decoded = decodeJWT(token);

  expect(decoded.id).toEqual(mockUser.id);
  expect(decoded.verified).toBe(mockUser.verified);
  expect(decoded.profile).toBe(mockUser.profile);
  expect(decoded.iss).toEqual(mockConfig.jwtIssuer);
  expect(decoded.sub).toEqual(mockConfig.jwtSubject);
  expect(decoded.aud).toEqual(mockConfig.jwtAudience);
});

describe("validateEmail", () => {
  it("should return valid email address", async () => {
    mockDbHandler.isUniqueEmail.mockReturnValueOnce(true);

    const email = "test@email.com";

    const result = await service.validateEmail(email);

    expect(mockDbHandler.isUniqueEmail).toHaveBeenLastCalledWith(email);
    expect(result).toEqual(email);
  });

  it("should trim email address", async () => {
    mockDbHandler.isUniqueEmail.mockReturnValueOnce(true);

    const email = "test@email.com ";

    const result = await service.validateEmail(email);

    expect(mockDbHandler.isUniqueEmail).toHaveBeenLastCalledWith(email.trim());
    expect(result).toEqual(email.trim());
  });

  it("should throw invalid email error", async () => {
    const email = "test@email";

    return service
      .validateEmail(email)
      .then(() => {
        throw new Error();
      })
      .catch((e) => {
        expect(e instanceof ValidationError).toBe(true);
        expect(e.invalidArgs).toEqual(["email"]);
      });
  });

  it("should throw invalid email error", async () => {
    const email = "testemail.com";

    return service
      .validateEmail(email)
      .then(() => {
        throw new Error();
      })
      .catch((e) => {
        expect(e instanceof ValidationError).toBe(true);
        expect(e.invalidArgs).toEqual(["email"]);
      });
  });

  it("should throw constraint error", async () => {
    mockDbHandler.isUniqueEmail.mockReturnValueOnce(false);

    const email = "test@email.com";

    return service
      .validateEmail(email)
      .then(() => {
        throw new Error();
      })
      .catch((e) => {
        expect(e instanceof ValidationError).toBe(true);
        expect(e.invalidArgs).toEqual(["email"]);
      });
  });
});

describe("validatePhone", () => {
  it("should return valid phone number", async () => {
    mockDbHandler.isUniquePhone.mockReturnValueOnce(true);

    const phone = "+11234567890";

    const result = await service.validatePhone(phone);

    expect(mockDbHandler.isUniquePhone).toHaveBeenLastCalledWith(phone);
    expect(result).toEqual(phone);
  });

  it("should trim phone number", async () => {
    mockDbHandler.isUniquePhone.mockReturnValueOnce(true);

    const phone = "+11234567890 ";

    const result = await service.validatePhone(phone);

    expect(mockDbHandler.isUniquePhone).toHaveBeenLastCalledWith(phone.trim());
    expect(result).toEqual(phone.trim());
  });

  it("should throw invalid phone error", async () => {
    const phone = "+12345";

    return service
      .validatePhone(phone)
      .then(() => {
        throw new Error();
      })
      .catch((e) => {
        expect(e instanceof ValidationError).toBe(true);
        expect(e.invalidArgs).toEqual(["phone"]);
      });
  });

  it("should throw invalid phone error", async () => {
    const phone = "11234567890";

    return service
      .validatePhone(phone)
      .then(() => {
        throw new Error();
      })
      .catch((e) => {
        expect(e instanceof ValidationError).toBe(true);
        expect(e.invalidArgs).toEqual(["phone"]);
      });
  });

  it("should throw constraint error", async () => {
    mockDbHandler.isUniquePhone.mockReturnValueOnce(false);

    const phone = "+11234567890";

    return service
      .validatePhone(phone)
      .then(() => {
        throw new Error();
      })
      .catch((e) => {
        expect(e instanceof ValidationError).toBe(true);
        expect(e.invalidArgs).toEqual(["phone"]);
      });
  });
});

describe("validatePassword", () => {
  it("should return hashed password", async () => {
    const password = "ab12cd34";

    const result = await service.validatePassword(password, password);

    const isMatch = await bcrypt.compare(password, result);

    expect(isMatch).toBe(true);
  });

  it("should throw unmatched password error", async () => {
    const password = "ab12cd34";
    const confirmPassword = "ab12";

    return service
      .validatePassword(password, confirmPassword)
      .then(() => {
        throw new Error();
      })
      .catch((e) => {
        expect(e instanceof ValidationError).toBe(true);
        expect(e.invalidArgs).toEqual(["password", "confirmPassword"]);
      });
  });

  it("should throw password sophistication error", async () => {
    const password = "ab12";
    const confirmPassword = "ab12";

    return service
      .validatePassword(password, confirmPassword)
      .then(() => {
        throw new Error();
      })
      .catch((e) => {
        expect(e instanceof ValidationError).toBe(true);
        expect(e.invalidArgs).toEqual(["password", "confirmPassword"]);
      });
  });
});

test("getCredentials - should retreive credentials", async () => {
  const credentials = await service.getCredentials(mockUser);

  expect(typeof credentials.accessToken).toEqual("string");
  expect(typeof credentials.refreshToken).toEqual("string");
});

describe("authenticate", () => {
  it("should throw authentication error", () => {
    const password = "ab12cd34";

    return service
      .authenticate(mockUser, password, mockDeviceArgs)
      .then(() => {
        throw new Error();
      })
      .catch((e) => {
        expect(e instanceof ServiceError).toBe(true);
      });
  });

  it("should authenticate and return credentials", async () => {
    mockDbHandler.deviceLogin.mockReturnValueOnce({
      device: mockDevice,
      created: false,
    });

    const password = "ab12cd34";

    let user = mockUser;

    user.password = await bcrypt.hash(password, 10);

    const credentials = await service.authenticate(
      user,
      password,
      mockDeviceArgs
    );

    expect(mockDbHandler.deviceLogin).toHaveBeenLastCalledWith(
      user.id,
      credentials.refreshToken,
      mockDeviceArgs
    );

    expect(typeof credentials.accessToken).toEqual("string");
    expect(typeof credentials.refreshToken).toEqual("string");
  });
});

test("authenticationSuccess - should return credentials", async () => {
  mockDbHandler.deviceLogin.mockReturnValueOnce({
    device: mockDevice,
    created: false,
  });

  const credentials = await service.authenticationSuccess(
    mockUser,
    mockDeviceArgs
  );

  expect(mockDbHandler.deviceLogin).toHaveBeenLastCalledWith(
    mockUser.id,
    credentials.refreshToken,
    mockDeviceArgs
  );

  expect(typeof credentials.accessToken).toEqual("string");
  expect(typeof credentials.refreshToken).toEqual("string");
});

test("getUser - should return user", async () => {
  mockDbHandler.findUserByID.mockReturnValueOnce(mockUser);

  const user = await service.getUser(mockUser.id);

  expect(mockDbHandler.findUserByID).toHaveBeenLastCalledWith(mockUser.id);
  expect(user).toEqual(mockUser);
});

test("getUser - should return user", async () => {
  mockDbHandler.findUserByID.mockReturnValueOnce(mockUser);

  const user = await service.getUser(mockUser.id);

  expect(mockDbHandler.findUserByID).toHaveBeenLastCalledWith(mockUser.id);
  expect(user).toEqual(mockUser);
});

test("register - should create a new user", async () => {
  const mockResponse = { code: "ABCDEF", user: mockUser };

  mockDbHandler.isUniqueEmail.mockReturnValueOnce(true);
  mockDbHandler.createUser.mockReturnValueOnce(mockResponse);
  mockDbHandler.deviceLogin.mockReturnValueOnce({
    device: mockDevice,
    created: false,
  });

  const data = {
    email: "test@email.com",
    password: "ab12cd34",
    confirmPassword: "ab12cd34",
  };

  const { user, code, credentials } = await service.register(
    data,
    mockDeviceArgs
  );

  expect(mockDbHandler.createUser).toHaveBeenLastCalledWith({
    email: data.email,
    password: expect.anything(),
  });

  expect(mockDbHandler.deviceLogin).toHaveBeenLastCalledWith(
    mockUser.id,
    credentials.refreshToken,
    mockDeviceArgs
  );

  expect(user).toEqual(mockResponse.user);
  expect(code).toEqual(mockResponse.code);
  expect(typeof credentials.accessToken).toEqual("string");
  expect(typeof credentials.refreshToken).toEqual("string");
});

test("login - should authenticate a user", async () => {
  const password = "ab12cd34";

  let user = mockUser;

  user.password = await bcrypt.hash(password, 10);

  mockDbHandler.findUserByAttribute.mockReturnValueOnce(user);
  mockDbHandler.deviceLogin.mockReturnValueOnce({
    device: mockDevice,
    created: false,
  });

  const data = {
    identifier: "test@email.com",
    password,
  };

  const credentials = await service.login(data, mockDeviceArgs);

  expect(mockDbHandler.findUserByAttribute).toHaveBeenLastCalledWith(
    data.identifier
  );

  expect(mockDbHandler.deviceLogin).toHaveBeenLastCalledWith(
    user.id,
    credentials.refreshToken,
    mockDeviceArgs
  );

  expect(typeof credentials.accessToken).toEqual("string");
  expect(typeof credentials.refreshToken).toEqual("string");
});

test("refresh token - should generate new credentials", async () => {
  const token = "askjdfhsakjfhasdjkfhadsjfjadsf";
  const device = "1";

  mockDbHandler.findUserByAuthStatus.mockReturnValueOnce(mockUser);

  const credentials = await service.refreshToken(device, token);

  expect(mockDbHandler.findUserByAuthStatus).toHaveBeenLastCalledWith(
    device,
    token
  );

  expect(mockDbHandler.updateAuthStatus).toHaveBeenLastCalledWith(
    device,
    mockUser.id,
    credentials.refreshToken
  );

  expect(typeof credentials.accessToken).toEqual("string");
  expect(typeof credentials.refreshToken).toEqual("string");
});

test("logout - should log out of device", async () => {
  const result = await service.logout(mockUser.id, mockDevice.id);

  expect(mockDbHandler.deviceLogout).toHaveBeenLastCalledWith(
    mockUser.id,
    mockDevice.id
  );

  expect(typeof result).toEqual("string");
});

describe("updateEmail", () => {
  it("should validate and update email", async () => {
    mockDbHandler.isUniqueEmail.mockReturnValueOnce(true);
    mockDbHandler.updateEmail.mockReturnValueOnce(mockUser);

    const email = "updated@email.com";

    const result = await service.updateEmail(mockUser.id, email);

    expect(mockDbHandler.updateEmail).toHaveBeenLastCalledWith(
      mockUser.id,
      email
    );
    expect(result).toEqual(mockUser);
  });

  it("should throw validation error", async () => {
    const email = "updated@email";

    return service
      .updateEmail(mockUser.id, email)
      .then(() => {
        throw new Error();
      })
      .catch((e) => {
        expect(e instanceof ValidationError).toBe(true);
        expect(e.invalidArgs).toEqual(["email"]);
      });
  });

  it("should throw validation error", async () => {
    mockDbHandler.isUniqueEmail.mockReturnValueOnce(false);
    const email = "updated@email.com";

    return service
      .updateEmail(mockUser.id, email)
      .then(() => {
        throw new Error();
      })
      .catch((e) => {
        expect(e instanceof ValidationError).toBe(true);
        expect(e.invalidArgs).toEqual(["email"]);
      });
  });
});

describe("updatePhone", () => {
  it("should validate and update phone", async () => {
    mockDbHandler.isUniquePhone.mockReturnValueOnce(true);
    mockDbHandler.updatePhone.mockReturnValueOnce(mockUser);

    const phone = "+11234567890";

    const result = await service.updatePhone(mockUser.id, phone);

    expect(mockDbHandler.updatePhone).toHaveBeenLastCalledWith(
      mockUser.id,
      phone
    );
    expect(result).toEqual(mockUser);
  });

  it("should throw validation error", async () => {
    const phone = "+1234567890";

    return service
      .updatePhone(mockUser.id, phone)
      .then(() => {
        throw new Error();
      })
      .catch((e) => {
        expect(e instanceof ValidationError).toBe(true);
        expect(e.invalidArgs).toEqual(["phone"]);
      });
  });

  it("should throw validation error", async () => {
    mockDbHandler.isUniquePhone.mockReturnValueOnce(false);
    const phone = "+12345678910";

    return service
      .updatePhone(mockUser.id, phone)
      .then(() => {
        throw new Error();
      })
      .catch((e) => {
        expect(e instanceof ValidationError).toBe(true);
        expect(e.invalidArgs).toEqual(["phone"]);
      });
  });
});

describe("verifyEmail", () => {
  it("should verify and reauthenticate", async () => {
    mockDbHandler.verifyEmail.mockReturnValueOnce(mockUser);

    const code = "ABCDEFG";

    const result = await service.verifyEmail(mockUser.id, code, true);

    expect(mockDbHandler.verifyEmail).toHaveBeenLastCalledWith(
      mockUser.id,
      code
    );

    expect(result).toEqual({ accessToken: expect.anything() });
  });

  it("should verify and NOT reauthenticate", async () => {
    mockDbHandler.verifyEmail.mockReturnValueOnce(mockUser);

    const code = "ABCDEFG";

    const result = await service.verifyEmail(mockUser.id, code, false);

    expect(mockDbHandler.verifyEmail).toHaveBeenLastCalledWith(
      mockUser.id,
      code
    );

    expect(result).toEqual(undefined);
  });
});

describe("verifyPhone", () => {
  it("should verify and reauthenticate", async () => {
    mockDbHandler.verifyPhone.mockReturnValueOnce(mockUser);

    const code = "ABCDEFG";

    const result = await service.verifyPhone(mockUser.id, code, true);

    expect(mockDbHandler.verifyPhone).toHaveBeenLastCalledWith(
      mockUser.id,
      code
    );

    expect(result).toEqual({ accessToken: expect.anything() });
  });

  it("should verify and NOT reauthenticate", async () => {
    mockDbHandler.verifyPhone.mockReturnValueOnce(mockUser);

    const code = "ABCDEFG";

    const result = await service.verifyPhone(mockUser.id, code, false);

    expect(mockDbHandler.verifyPhone).toHaveBeenLastCalledWith(
      mockUser.id,
      code
    );

    expect(result).toEqual(undefined);
  });
});

test("deactivateAccount - should deactivate a user's account", async () => {
  const result = await service.deactivateAccount(mockUser.id);

  expect(mockDbHandler.deactivateAccount).toHaveBeenLastCalledWith(mockUser.id);

  expect(typeof result).toEqual("string");
});
