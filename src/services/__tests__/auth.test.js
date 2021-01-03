const { AuthService } = require("../auth");
const {
  buildDatabase,
  clearDatabase,
  terminateDatabase,
} = require("./__utils");
const { baseConfig } = require("./base.test");
const bcrypt = require("bcrypt");

const { default: UserModel } = require("../models/user");
const { UserInputError } = require("apollo-server-express");

let testUserId;

beforeAll(async () => {
  await buildDatabase();
});

beforeEach(async () => {
  const user = new UserModel(mockUser);
  await user.save();

  testUserId = user.id;
});

afterEach(async () => await clearDatabase());

afterAll(async () => await terminateDatabase());

const config = {
  jwtKey: "test_secret_key",
  jwtAudience: "test audience",
  jwtIssuer: "test issuer",
  jwtSubject: "test subject",
  jwtExpiration: "1h",
  refreshCookie: "x-refresh-token",
  apca: {
    apcaKeyCookie: "something",
    apcaSecretCookie: "another thing",
  },
};

const service = new AuthService(config, baseConfig);
service.logout = jest.fn();

describe("registration", () => {
  it("should return authentication credentials", async () => {
    const data = {
      email: "ReGIster@user.com",
      phoneNumber: "+12345341235",
      name: "Registered User",
      password: "ab12cd34",
      confirmPassword: "ab12cd34",
    };

    const { credentials, user } = await service.register(data);

    expect(user.email.address).toEqual(data.email.toLowerCase());
    expect(typeof credentials.accessToken).toEqual("string");
  });

  it("should throw email validation error", async () => {
    const badData = {
      email: "register@user",
      phoneNumber: "+12345341235",
      name: "Registered User",
      password: "ab12cd34",
      confirmPassword: "ab12cd34",
    };

    return service.register(badData).catch((err) => {
      expect(err instanceof UserInputError).toEqual(true);
      expect(err.invalidArgs).toEqual(["email.address", "email"]);
    });
  });

  it("should throw email validation error", async () => {
    const badData = {
      phoneNumber: "+12345341235",
      name: "Registered User",
      password: "ab12cd34",
      confirmPassword: "ab12cd34",
    };

    return service.register(badData).catch((err) => {
      expect(err instanceof UserInputError).toEqual(true);
      expect(err.invalidArgs).toEqual(["email.address", "email"]);
    });
  });

  it("should throw phone validation error", async () => {
    const badData = {
      email: "register@user.com",
      phoneNumber: "+2345341235", // too short
      name: "Registered User",
      password: "ab12cd34",
      confirmPassword: "ab12cd34",
    };

    return service.register(badData).catch((err) => {
      expect(err instanceof UserInputError).toEqual(true);
      expect(err.invalidArgs).toEqual(["phone.number", "phone"]);
    });
  });

  it("should throw password validation error - don't match", async () => {
    const badData = {
      email: "register@user.com",
      phoneNumber: "+12345341235",
      name: "Registered User",

      // don't match
      password: "ab12cd3",
      confirmPassword: "ab12cd34",
    };

    return service.register(badData).catch((err) => {
      expect(err instanceof UserInputError).toEqual(true);
      expect(err.invalidArgs).toEqual(["password", "confirmPassword"]);
    });
  });

  it("should throw password validation error - too short", async () => {
    const badData = {
      email: "register@user.com",
      phoneNumber: "+12345341235",
      name: "Registered User",

      // too short
      password: "ab12",
      confirmPassword: "ab12",
    };

    return service.register(badData).catch((err) => {
      expect(err instanceof UserInputError).toEqual(true);
      expect(err.invalidArgs).toEqual(["password", "confirmPassword"]);
    });
  });
});

describe("login", () => {
  it("should return authentication credentials - email", async () => {
    const credentials = await service.login({
      identifier: mockUser.email.address,
      // un-hashed password
      password: "ab12cd34",
    });

    expect(typeof credentials.accessToken).toEqual("string");
  });

  it("should return authentication credentials - phone", async () => {
    const credentials = await service.login({
      identifier: mockUser.phone.number,
      // un-hashed password
      password: "ab12cd34",
    });

    expect(typeof credentials.accessToken).toEqual("string");
  });

  it("should throw login error - wrong password", async () => {
    return service
      .login({
        identifier: mockUser.email.address,
        password: "wrong_password",
      })
      .then((res) => {
        expect(res).toEqual(undefined);
      })
      .catch((err) => {
        expect(err instanceof UserInputError).toEqual(true);
        expect(err.invalidArgs).toEqual(["identifier", "password"]);
      });
  });

  it("should throw login error - not a real user", async () => {
    return service
      .login({
        identifier: "notauser@email.com",
        password: "ab12cd34",
      })
      .then((res) => {
        expect(res).toEqual(undefined);
      })
      .catch((err) => {
        expect(err instanceof UserInputError).toEqual(true);
        expect(err.invalidArgs).toEqual(["identifier", "password"]);
      });
  });
});

describe("reset password", () => {
  it("should update a user's password", async () => {
    const data = {
      password: "newpassword123",
      confirmPassword: "newpassword123",
    };

    const res = await service.resetPassword(testUserId, data);

    expect(typeof res).toEqual("string");
  });

  it("should throw password validation error - don't match", async () => {
    const badData = {
      password: "ab12cd3",
      confirmPassword: "ab12cd34",
    };

    return service.resetPassword(testUserId, badData).catch((err) => {
      expect(err instanceof UserInputError).toEqual(true);
      expect(err.invalidArgs).toEqual(["password", "confirmPassword"]);
    });
  });

  it("should throw password validation error - too short", async () => {
    const badData = {
      password: "ab12",
      confirmPassword: "ab12",
    };

    return service.resetPassword(testUserId, badData).catch((err) => {
      expect(err instanceof UserInputError).toEqual(true);
      expect(err.invalidArgs).toEqual(["password", "confirmPassword"]);
    });
  });
});

describe("verify email", () => {
  it("should verify a user's email", async () => {
    const res = await service.verifyEmail(testUserId, true);

    expect(typeof res.accessToken).toBe("string");
  });
});

describe("verify phone", () => {
  it("should verify a user's phone", async () => {
    const res = await service.verifyPhone(testUserId, true);

    expect(typeof res.accessToken).toBe("string");
  });
});

describe("deactivate account", () => {
  it("should deactivate a user's account", async () => {
    service.logout.mockReturnValueOnce("Done.");
    const res = await service.deactivateAccount(testUserId);

    const user = await UserModel.findById(testUserId);

    expect(user.deactivated).toBe(true);
    expect(typeof res).toEqual("string");
  });
});

// mock data

const mockUser = {
  profile: {
    name: "Test User",
  },
  email: { address: "user@email.com", verified: true },
  phone: { number: "+11234567890", verified: true },
  password: bcrypt.hashSync("ab12cd34", 10),
};
