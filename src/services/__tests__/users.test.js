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
};

const service = new UserService(mockDbHandler);

test("getById - should return a user's profile", async () => {
  mockDbHandler.findById.mockReturnValueOnce(mockProfile);

  const result = await service.getById(mockProfile.id);

  expect(mockDbHandler.findById).toHaveBeenLastCalledWith(mockProfile.id);
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

  expect(mockDbHandler.updateProfile).toHaveBeenLastCalledWith(
    mockProfile.id,
    data
  );
  expect(result).toEqual(mockProfile);
});

describe("loadProfile", () => {
  test("should load a user's profile", async () => {
    mockDbHandler.loadFromIds.mockReturnValueOnce([mockProfile]);

    const result = await service.loadProfile(mockProfile.id);

    expect(mockDbHandler.loadFromIds).toHaveBeenLastCalledWith([
      mockProfile.id,
    ]);
    expect(result).toEqual(mockProfile);
  });

  test("should NOT load a user's profile", async () => {
    mockDbHandler.loadFromIds.mockReturnValueOnce([]);

    const id = "bad_id";

    const result = await service.loadProfile(id);

    expect(mockDbHandler.loadFromIds).toHaveBeenLastCalledWith([id]);
    expect(result).toEqual(null);
  });
});
