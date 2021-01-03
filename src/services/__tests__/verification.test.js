const { VerificationService } = require("../verification");
const {
  buildDatabase,
  clearDatabase,
  terminateDatabase,
} = require("./__utils");
const { baseConfig } = require("./base.test");

const { default: UserModel } = require("../models/user");
const { default: CodeModel } = require("../models/verification-code");
const { ApolloError } = require("apollo-server-express");

let testUser;
let testCode;

beforeAll(async () => await buildDatabase());

beforeEach(async () => {
  const user = new UserModel(mockUser);
  await user.save();
  testUser = user;

  const codes = await CodeModel.create([
    {
      user: user.id,
      type: "email_verification",
      issuedAt: new Date(),
      issuedBy: "some_addr",
    },
  ]);

  testCode = codes[0];
});

afterEach(async () => await clearDatabase());

afterAll(async () => await terminateDatabase());

const service = new VerificationService(baseConfig);

describe("createCode", () => {
  it("should create a new code", async () => {
    const code = await service.createCode(testUser, "email_verification");
    expect(code.type).toEqual("email_verification");
    expect(code.user.toString()).toEqual(testUser.id.toString());
  });
});

describe("verify code", () => {
  it("should verify a code", async () => {
    const code = await service.email(testUser.id, testCode.code);
    expect(code.revokedReason).toEqual("verified");
  });

  it("should expire the code the throw error", async () => {
    testCode.expiresAt = new Date();
    await testCode.save();

    return service.email(testUser.id, testCode.code).catch((err) => {
      expect(err instanceof ApolloError).toEqual(true);
      expect(err.message).toEqual("Code expired.");
    });
  });

  it("should throw error for previously expired code", async () => {
    testCode.revokedReason = "expired";
    testCode.revokedAt = new Date();
    await testCode.save();

    return service.email(testUser.id, testCode.code).catch((err) => {
      expect(err instanceof ApolloError).toEqual(true);
      expect(err.message).toEqual("Code expired.");
    });
  });

  it("should throw error for invalid code", async () => {
    return service.email(testUser.id, "wrongcode").catch((err) => {
      expect(err instanceof ApolloError).toEqual(true);
      expect(err.message).toEqual("Invalid code.");
    });
  });
});

const mockUser = {
  profile: {
    firstName: "Test",
    lastName: "User",
  },
  email: {
    address: "user@email.com",
  },
  phone: {
    number: "+11234567890",
  },
  password: "ab12cd34",
};
