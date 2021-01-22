/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

const { UserAPI } = require("../users");
const {
  MediaService,
  ...mockMediaService
} = require("../../../services/__mocks__/media-service");
const {
  UserService,
  ...mockUserService
} = require("../../../services/__mocks__/user-service");

const { mockProfile } = require("../../../database/mocks/users");

const mockContext = {
  user: { id: "1", profile: "2", verified: true },
  host: "127.0.0.1",
  userService: new UserService(),
  mediaService: new MediaService(),
};

const ds = new UserAPI();

ds.initialize({ context: mockContext });

test("should have initialized follow status loader", () => {
  const test = new UserAPI();
  test.initialize({ context: mockContext });

  expect(mockUserService.buildFollowStatusLoader).toBeCalledWith(
    mockContext.user.profile
  );
});

test("getFollowers - should return a user's followers", async () => {
  mockUserService.getFollowers.mockReturnValueOnce([mockProfile]);

  const result = await ds.getFollowers("1", 10, 0);

  expect(mockUserService.getFollowers).toBeCalledWith("1", 10, 0);
  expect(result).toEqual([mockProfile]);
});

test("follow - should follow a user's profile", async () => {
  mockUserService.followProfile.mockReturnValueOnce(undefined);

  const result = await ds.follow("1");

  expect(mockUserService.followProfile).toBeCalledWith(
    mockContext.user.profile,
    "1"
  );
  expect(result).toEqual(undefined);
});

test("unfollow - should unfollow a user's profile", async () => {
  const message = "success string";
  mockUserService.unfollowProfile.mockReturnValueOnce(message);

  const result = await ds.unfollow("1");

  expect(mockUserService.unfollowProfile).toBeCalledWith(
    mockContext.user.profile,
    "1"
  );
  expect(result).toEqual(message);
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

test("loadFollowingStatus - should return a followingStatus", async () => {
  const mockResponse = { timestamp: new Date() };

  mockUserService.loadFollowStatus.mockReturnValueOnce(mockResponse);

  const result = await ds.loadFollowingStatus("1");

  expect(mockUserService.loadFollowStatus).toBeCalledWith("1");
  expect(result).toEqual(mockResponse);
});

test("loadProfile - should return a user's profile", async () => {
  mockUserService.loadProfile.mockReturnValueOnce(mockProfile);

  const result = await ds.loadProfile("1");

  expect(mockUserService.loadProfile).toBeCalledWith("1");
  expect(result).toEqual(mockProfile);
});

test("loadFollowerCount", async () => {
  const count = 2;

  mockUserService.loadFollowerCount.mockReturnValueOnce(count);

  const result = await ds.loadFollowerCount("1");

  expect(mockUserService.loadFollowerCount).toBeCalledWith("1");

  expect(result).toEqual(count);
});
