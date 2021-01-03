const { UserAPI } = require("../users");

const mockService = {
  getById: jest.fn(),
  getProfileById: jest.fn(),
  getByEmail: jest.fn(),
  getByPhone: jest.fn(),
  update: jest.fn(),
  verifyEmail: jest.fn(),
  verifyPhone: jest.fn(),
};

const mockAuthService = {
  signToken: jest.fn(),
};

const mockMailService = {
  sendEmail: jest.fn(),
};

const mockVerificationService = {
  createCode: jest.fn(),
  email: jest.fn(),
  phone: jest.fn(),
};

const mockContext = {
  user: { id: 1, verified: false },
  userService: mockService,
  verificationService: mockVerificationService,
  authService: mockAuthService,
  notificationService: mockMailService,
};

const ds = new UserAPI();
ds.initialize({ context: mockContext });

describe("users.getCurrentUser", () => {
  it("get current user account", async () => {
    mockService.getById.mockReturnValueOnce(mockUser);

    const res = await ds.getCurrentUser();

    expect(res).toEqual(mockUser);
    expect(mockService.getById).toBeCalledWith(mockContext.user.id);
  });
});

describe("users.getUserProfile", () => {
  it("get a user's profile", async () => {
    mockService.getProfileById.mockReturnValueOnce(mockUser.profile);

    const res = await ds.getUserProfile(mockUser._id);

    expect(res).toEqual(mockUser.profile);
    expect(mockService.getProfileById).toBeCalledWith(mockUser._id);
  });
});

describe("users.update", () => {
  it("update user account", async () => {
    mockService.update.mockReturnValueOnce({ user: mockUser });

    const data = {
      name: "another name",
    };

    const user = await ds.updateUser(data);

    expect(user).toEqual(mockUser);
    expect(mockService.update).toBeCalledWith(mockContext.user.id, data);
  });
});

/**
 * Mock data
 */

const mockUser = {
  _id: 1,
  profile: {
    name: "Test User",
  },
  email: {
    address: "user@email.com",
    verified: true,
  },
  phoneNumber: {
    number: "+11234567890",
    verified: true,
  },
  lastLogin: "1604465235451",
  updatedAt: "1604465235451",
  createdAt: "1604465235451",
};

module.exports = {
  mockUser,
  mockUserService: mockService,
};
