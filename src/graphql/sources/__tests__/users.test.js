/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

const { UserAPI } = require("../users");

const { mockProfile } = require("../../../db/__mocks__/users");

const mockUserService = {
  getById: jest.fn(),
  getByUser: jest.fn(),
  loadProfile: jest.fn(),
};

const mockContext = {
  user: { id: 1, verified: true },
  host: "127.0.0.1",
  userService: mockUserService,
};

const ds = new UserAPI();

ds.initialize({ context: mockContext });

test("getProfileByID - should return a user's profile", async () => {
  mockUserService.getById.mockReturnValueOnce(mockProfile);

  const result = await ds.getProfileByID("1");

  expect(mockUserService.getById).toBeCalledWith("1");
  expect(result).toEqual(mockProfile);
});

test("loadProfile - should return a user's profile", async () => {
  mockUserService.loadProfile.mockReturnValueOnce(mockProfile);

  const result = await ds.loadProfile("1");

  expect(mockUserService.loadProfile).toBeCalledWith("1");
  expect(result).toEqual(mockProfile);
});

test("getProfileByAccount - should return a user's profile", async () => {
  mockUserService.getByUser.mockReturnValueOnce(mockProfile);

  const result = await ds.getProfileByAccount("1");

  expect(mockUserService.getByUser).toBeCalledWith("1");
  expect(result).toEqual(mockProfile);
});

module.exports = { mockUserService };
