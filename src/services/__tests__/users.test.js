/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

const { UserService } = require("../users");

const { mockProfile } = require("../../database/__mocks__/users");

const mockDbHandler = {
  findById: jest.fn(),
  loadFromIds: jest.fn(),
  loadFollowingStatuses: jest.fn(),
  updateProfile: jest.fn(),
  updateProfileImage: jest.fn(),
  updateCoverImage: jest.fn(),
  followProfile: jest.fn(),
  unfollowProfile: jest.fn(),
  loadFollowerCounts: jest.fn(),
  findFollowers: jest.fn(),
};

const service = new UserService(mockDbHandler);

const mockUserId = "1";

service.buildFollowStatusLoader(mockUserId);

test("getFollowers - should return a user's followers", async () => {
  mockDbHandler.findFollowers.mockReturnValueOnce([mockProfile]);

  const result = await service.getFollowers("1", 10, 0);

  expect(mockDbHandler.findFollowers).toBeCalledWith("1", 10, 0);

  expect(result).toEqual([mockProfile]);
});

test("followProfile - should return a following status", async () => {
  const mockResponse = { timestamp: new Date() };
  mockDbHandler.followProfile.mockReturnValueOnce(mockResponse);

  const result = await service.followProfile(mockProfile.id, "1");

  expect(mockDbHandler.followProfile).toBeCalledWith(mockProfile.id, "1");

  expect(result).toEqual(mockResponse);
});

test("unfollowProfile - should return undefined", async () => {
  const result = await service.unfollowProfile(mockProfile.id, "1");

  expect(mockDbHandler.unfollowProfile).toBeCalledWith(mockProfile.id, "1");

  expect(typeof result).toEqual("string");
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

describe("loadFollowStatus", () => {
  test("should load a user's following status for the profile", async () => {
    mockDbHandler.loadFollowingStatuses.mockReturnValueOnce([
      mockFollowingStatus,
    ]);

    const result = await service.loadFollowStatus(mockFollowingStatus.profile);

    expect(mockDbHandler.loadFollowingStatuses).toBeCalledWith(
      [mockFollowingStatus.profile],
      mockUserId
    );

    expect(result).toEqual(mockFollowingStatus.rel);
  });

  test("should NOT load a user's following status", async () => {
    mockDbHandler.loadFollowingStatuses.mockReturnValueOnce([]);

    const id = "bad_id";

    const result = await service.loadFollowStatus(id);

    expect(mockDbHandler.loadFollowingStatuses).toBeCalledWith(
      [id],
      mockUserId
    );
    expect(result).toEqual(null);
  });
});

describe("loadFollowerCount", () => {
  test("should load an idea's reaction count", async () => {
    const mockResponse = {};

    mockResponse[mockProfile.id] = 500;

    mockDbHandler.loadFollowerCounts.mockReturnValueOnce(mockResponse);

    const result = await service.loadFollowerCount(mockProfile.id);

    expect(mockDbHandler.loadFollowerCounts).toBeCalledWith([mockProfile.id]);
    expect(result).toEqual(mockResponse[mockProfile.id]);
  });

  test("should return 0", async () => {
    mockDbHandler.loadFollowerCounts.mockReturnValueOnce({});

    const id = "bad_id";

    const result = await service.loadFollowerCount(id);

    expect(mockDbHandler.loadFollowerCounts).toBeCalledWith([id]);
    expect(result).toEqual(0);
  });
});

const mockFollowingStatus = {
  profile: "1",
  rel: {
    timestamp: new Date(),
  },
};
