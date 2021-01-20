/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

const { UserAPI } = require("../users");

const { mockProfile } = require("../../../db/__mocks__/users");

const mockUserService = {
  getById: jest.fn(),
  loadProfile: jest.fn(),
  updateProfile: jest.fn(),
  updateProfileImage: jest.fn(),
  updateCoverImage: jest.fn(),
};

const mockMediaService = {
  getSignedProfileUpload: jest.fn(),
  getSignedCoverUpload: jest.fn(),
};

const mockContext = {
  user: { id: "1", profile: "2", verified: true },
  host: "127.0.0.1",
  userService: mockUserService,
  mediaService: mockMediaService,
};

const ds = new UserAPI();

ds.initialize({ context: mockContext });

test("getProfileByID - should return a user's profile", async () => {
  mockUserService.getById.mockReturnValueOnce(mockProfile);

  const result = await ds.getProfileByID("1");

  expect(mockUserService.getById).toBeCalledWith("1");
  expect(result).toEqual(mockProfile);
});

test("updateProfile - should update a user's profile", async () => {
  mockUserService.updateProfile.mockReturnValueOnce(mockProfile);

  const data = {
    name: "new name",
    summary: "new summary",
    location: "Columbia, SC",
  };

  const result = await ds.updateProfile(data);

  expect(mockUserService.updateProfile).toBeCalledWith(
    mockContext.user.profile,
    data
  );
  expect(result).toEqual(mockProfile);
});

test("updateProfileImage - should return a stringified signed request for the client", async () => {
  const key = "some_image_key";

  const mockResponse = {
    fields: { key },
  };

  mockMediaService.getSignedProfileUpload.mockReturnValueOnce(mockResponse);

  const result = await ds.updateProfileImage("1");

  expect(mockMediaService.getSignedProfileUpload).toBeCalledWith(
    mockContext.user.id
  );
  expect(mockUserService.updateProfileImage).toBeCalledWith(
    mockContext.user.profile,
    key
  );
  expect(result).toEqual(JSON.stringify(mockResponse));
});

test("updateCoverImage - should return a stringified signed request for the client", async () => {
  const key = "some_image_key";

  const mockResponse = {
    fields: { key },
  };

  mockMediaService.getSignedCoverUpload.mockReturnValueOnce(mockResponse);

  const result = await ds.updateCoverImage("1");

  expect(mockMediaService.getSignedCoverUpload).toBeCalledWith(
    mockContext.user.id
  );
  expect(mockUserService.updateCoverImage).toBeCalledWith(
    mockContext.user.profile,
    key
  );
  expect(result).toEqual(JSON.stringify(mockResponse));
});

test("loadProfile - should return a user's profile", async () => {
  mockUserService.loadProfile.mockReturnValueOnce(mockProfile);

  const result = await ds.loadProfile("1");

  expect(mockUserService.loadProfile).toBeCalledWith("1");
  expect(result).toEqual(mockProfile);
});

module.exports = { mockUserService };
