/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

const { createTestClient } = require("apollo-server-testing");

const { buildTestServer } = require("./__utils");

const { mockProfile } = require("../../database/__mocks__/users");
const { queries, mutations } = require("../__mocks__/users");

test("QUERY userProfile", async () => {
  const {
    server,
    mockUserService,
    mockContentService,
    mockMarketService,
  } = await buildTestServer();

  mockMarketService.getListsByAuthor.mockReturnValueOnce([]);
  mockUserService.loadProfile.mockReturnValueOnce(mockProfile);
  mockUserService.loadFollowStatus.mockReturnValueOnce({
    timestamp: new Date(),
  });

  mockContentService.getByAuthor.mockReturnValue([]);

  const { query } = createTestClient(server);
  const res = await query({
    query: queries.USER_PROFILE,
    variables: {
      id: mockProfile.id,
      postLimit: 10,
      postOffset: 0,
      ideaLimit: 10,
      ideaOffset: 0,
      listLimit: 10,
      listOffset: 0,
    },
  });

  const { userProfile: result } = res.data;

  expect(result.id).toEqual(mockProfile.id);
  expect(result.name).toEqual(mockProfile.name);
  expect(result.summary).toEqual(mockProfile.summary);
  expect(result.location).toEqual(mockProfile.location);
  expect(result.followStatus.timestamp).toEqual(expect.any(String));
  expect(Array.isArray(result.lists)).toBe(true);
  expect(Array.isArray(result.ideas)).toBe(true);
  expect(Array.isArray(result.posts)).toBe(true);
});

test("MUTATION updateProfile", async () => {
  const { server, mockUserService } = await buildTestServer();

  const data = {
    name: "New Name",
    summary: "",
    location: "Charleston, SC",
  };

  const mockResponse = { ...mockProfile, ...data };

  mockUserService.updateProfile.mockReturnValueOnce(mockResponse);

  const { mutate } = createTestClient(server);
  const res = await mutate({
    mutation: mutations.UPDATE_PROFILE,
    variables: { data },
  });

  const { updateProfile: result } = res.data;

  expect(result.name).toEqual(data.name);
  expect(result.summary).toEqual(data.summary);
  expect(result.location).toEqual(data.location);
});

test("MUTATION updateProfileImage", async () => {
  const { server, mockMediaService } = await buildTestServer();

  mockMediaService.getSignedProfileUpload.mockReturnValueOnce(mockURLOutput);

  const { mutate } = createTestClient(server);
  const res = await mutate({
    mutation: mutations.UPDATE_PROFILE_IMAGE,
  });

  const { updateProfileImage: result } = res.data;

  expect(result).toEqual(JSON.stringify(mockURLOutput));
});

test("MUTATION updateCoverImage", async () => {
  const { server, mockMediaService } = await buildTestServer();

  mockMediaService.getSignedCoverUpload.mockReturnValueOnce(mockURLOutput);

  const { mutate } = createTestClient(server);
  const res = await mutate({
    mutation: mutations.UPDATE_COVER_IMAGE,
  });

  const { updateCoverImage: result } = res.data;

  expect(result).toEqual(JSON.stringify(mockURLOutput));
});

test("MUTATION followProfile", async () => {
  const { server, mockUserService } = await buildTestServer();

  const mockResponse = { timestamp: new Date() };

  mockUserService.followProfile.mockReturnValueOnce(mockResponse);

  const { mutate } = createTestClient(server);

  const res = await mutate({
    mutation: mutations.FOLLOW_PROFILE,
    variables: { id: mockProfile.id },
  });

  const { followProfile: result } = res.data;

  expect(result).toEqual({ timestamp: expect.any(String) });
});

test("MUTATION unfollowProfile", async () => {
  const { server, mockUserService } = await buildTestServer();

  const mockResponse = "unfollowed user";

  mockUserService.unfollowProfile.mockReturnValueOnce(mockResponse);

  const { mutate } = createTestClient(server);

  const res = await mutate({
    mutation: mutations.UNFOLLOW_PROFILE,
    variables: { id: mockProfile.id },
  });

  const { unfollowProfile: result } = res.data;

  expect(result).toEqual(mockResponse);
});

const mockURLOutput = {
  url: "https://s3.us-east-1.amazonaws.com/test-bucket",
  fields: {
    key: "test-key",
    bucket: "test-bucket",
  },
};
