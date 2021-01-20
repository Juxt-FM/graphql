/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

const { UserService } = require("../users");

const { mockProfile } = require("../../db/__mocks__/users");

const mockDbHandler = {
  findById: jest.fn(),
  loadFromIds: jest.fn(),
  updateProfile: jest.fn(),
  updateProfileImage: jest.fn(),
  updateCoverImage: jest.fn(),
};

const service = new UserService(mockDbHandler);

test("getById - should return a user's profile", async () => {
  mockDbHandler.findById.mockReturnValueOnce(mockProfile);

  const result = await service.getById(mockProfile.id);

  expect(mockDbHandler.findById).toBeCalledWith(mockProfile.id);
  expect(result).toEqual(mockProfile);
});

test("updateProfile - should return a user's profile", async () => {
  mockDbHandler.updateProfile.mockReturnValueOnce(mockProfile);

  const data = {
    name: "New Name",
    summary: "just an updated summary",
    location: "Columbia, SC",
  };

  const result = await service.updateProfile(mockProfile.id, data);

  expect(mockDbHandler.updateProfile).toBeCalledWith(mockProfile.id, data);
  expect(result).toEqual(mockProfile);
});

test("updateProfileImage - should update user profile image", async () => {
  const key = "some_image_key";

  await service.updateProfileImage(mockProfile.id, key);

  expect(mockDbHandler.updateProfileImage).toBeCalledWith(mockProfile.id, key);
});

test("updateCoverImage - should update user cover image", async () => {
  const key = "some_image_key";

  await service.updateCoverImage(mockProfile.id, key);

  expect(mockDbHandler.updateCoverImage).toBeCalledWith(mockProfile.id, key);
});

describe("loadProfile", () => {
  test("should load a user's profile", async () => {
    mockDbHandler.loadFromIds.mockReturnValueOnce([mockProfile]);

    const result = await service.loadProfile(mockProfile.id);

    expect(mockDbHandler.loadFromIds).toBeCalledWith([mockProfile.id]);
    expect(result).toEqual(mockProfile);
  });

  test("should NOT load a user's profile", async () => {
    mockDbHandler.loadFromIds.mockReturnValueOnce([]);

    const id = "bad_id";

    const result = await service.loadProfile(id);

    expect(mockDbHandler.loadFromIds).toBeCalledWith([id]);
    expect(result).toEqual(null);
  });
});
