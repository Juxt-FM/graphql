const { UserService } = require("../users");
const {
  buildDatabase,
  clearDatabase,
  terminateDatabase,
} = require("./__utils");
const { baseConfig } = require("./base.test");

const { default: UserModel } = require("../models/user");
const { ApolloError } = require("apollo-server-express");

let testUserId;

beforeAll(async () => await buildDatabase());

beforeEach(async () => {
  const user = new UserModel(mockUser);

  await user.save();

  testUserId = user.id;
});

afterEach(async () => await clearDatabase());

afterAll(async () => await terminateDatabase());

const config = {
  apcaKeyCookie: "something",
  apcaSecretCookie: "another thing",
};

const service = new UserService(config, baseConfig);

describe("getById", () => {
  it("should return user document", async () => {
    const user = await service.getById(testUserId);

    expect(user.emailAddress).toEqual(mockUser.email.address);
    expect(user.phoneNumber).toEqual(mockUser.phone.number);
    expect(user.profile.name).toEqual(mockUser.profile.name);
  });

  it("should throw not found error", async () => {
    return service.getById("not_a_real_user").catch((err) => {
      expect(err instanceof ApolloError).toEqual(true);
    });
  });
});

describe("getProfileById", () => {
  it("should return user's profile", async () => {
    const profile = await service.getProfileById(testUserId);

    expect(profile.name).toEqual(mockUser.profile.name);
    expect(profile.summary).toEqual(mockUser.profile.summary);
    expect(profile.location).toEqual(mockUser.profile.location);
  });

  it("should throw not found error", async () => {
    return service.getById("not_a_real_user").catch((err) => {
      expect(err instanceof ApolloError).toEqual(true);
    });
  });
});

describe("update", () => {
  it("should return new user document", async () => {
    const data = {
      name: "Updated User",
      email: "different@email.com",
    };

    const { user } = await service.update(testUserId, data);

    expect(user.profile.name).toEqual(data.name);
    expect(user.email.verified).toBe(false);
  });
});

// mock data

const mockUser = {
  profile: {
    name: "Test User",
    location: "Test City, State",
    summary: "This is my summary!",
  },
  email: { address: "user@email.com", verified: true },
  phone: { number: "+11234567890", verified: true },
  password: "ab12cd34", // test password, not being used here so unhashed is OK
};
