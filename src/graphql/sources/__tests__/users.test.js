const { UserAPI } = require("../users");

const { mockProfile } = require("../../../db/__mocks__/users");

const mockUserService = {
  getById: jest.fn(),
};

const mockContext = {
  user: { id: 1, verified: true },
  host: "127.0.0.1",
  userService: mockUserService,
};

const ds = new UserAPI();

ds.initialize({ context: mockContext });

test("getUserProfile - should return a user's profile", async () => {
  mockUserService.getById.mockReturnValueOnce(mockProfile);

  const result = await ds.getUserProfile("1");

  expect(mockUserService.getById).toBeCalledWith("1");
  expect(result).toEqual(mockProfile);
});
