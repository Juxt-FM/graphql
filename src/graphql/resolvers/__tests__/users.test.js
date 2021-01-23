const {
  default: { Mutation, Query, UserProfile },
} = require("../users");

const mockUserAPI = require("../../sources/__mocks__/users");
const mockContentAPI = require("../../sources/__mocks__/content");
const mockMediaService = require("../../../services/__mocks__/media");
const { mockProfile } = require("../../../database/__mocks__/users");
const { mockPost, mockIdea } = require("../../../database/__mocks__/content");

const context = {
  user: { id: "1", profile: "2", verified: true },
  dataSources: {
    content: mockContentAPI,
    users: mockUserAPI,
  },
  mediaService: mockMediaService,
};

test("MUTATION updateProfile", async () => {
  mockUserAPI.updateProfile.mockReturnValueOnce(mockProfile);

  const args = {
    data: {
      name: "Test User",
    },
  };

  const result = await Mutation.updateProfile(undefined, args, context);

  expect(mockUserAPI.updateProfile).toBeCalledWith(args.data);
  expect(result).toEqual(mockProfile);
});

test("MUTATION followProfile", async () => {
  mockUserAPI.follow.mockReturnValueOnce({ timestamp: "some_timestamp" });

  const args = { id: "1" };

  const result = await Mutation.followProfile(undefined, args, context);

  expect(mockUserAPI.follow).toBeCalledWith(args.id);
  expect(result).toEqual({ timestamp: "some_timestamp" });
});

test("MUTATION unfollowProfile", async () => {
  mockUserAPI.unfollow.mockReturnValueOnce("success");

  const args = { id: "1" };

  const result = await Mutation.unfollowProfile(undefined, args, context);

  expect(mockUserAPI.unfollow).toBeCalledWith(args.id);
  expect(result).toEqual("success");
});

test("MUTATION updateProfileImage", async () => {
  mockUserAPI.updateProfileImage.mockReturnValueOnce("some_upload_url");

  const result = await Mutation.updateProfileImage(
    undefined,
    undefined,
    context
  );

  expect(mockUserAPI.updateProfileImage).toBeCalledWith();
  expect(result).toEqual("some_upload_url");
});

test("MUTATION updateCoverImage", async () => {
  mockUserAPI.updateCoverImage.mockReturnValueOnce("some_upload_url");

  const result = await Mutation.updateCoverImage(undefined, undefined, context);

  expect(mockUserAPI.updateCoverImage).toBeCalledWith();
  expect(result).toEqual("some_upload_url");
});

test("QUERY userProfile", async () => {
  mockUserAPI.loadProfile.mockReturnValueOnce(mockProfile);

  const args = { id: "1" };

  const result = await Query.userProfile(undefined, args, context);

  expect(mockUserAPI.loadProfile).toBeCalledWith(args.id);
  expect(result).toEqual(mockProfile);
});

test("UserProfile followers", async () => {
  mockUserAPI.getFollowers.mockReturnValueOnce([mockProfile]);

  const args = {
    limit: 10,
    offset: 0,
  };

  const result = await UserProfile.followers(mockProfile, args, context);

  expect(mockUserAPI.getFollowers).toBeCalledWith(
    mockProfile.id,
    args.limit,
    args.offset
  );
  expect(result).toEqual([mockProfile]);
});

test("UserProfile followCount", async () => {
  mockUserAPI.loadFollowerCount.mockReturnValueOnce(2);

  const result = await UserProfile.followCount(mockProfile, undefined, context);

  expect(mockUserAPI.loadFollowerCount).toBeCalledWith(mockProfile.id);
  expect(result).toEqual(2);
});

test("UserProfile followStatus", async () => {
  mockUserAPI.loadFollowingStatus.mockReturnValueOnce(2);

  const result = await UserProfile.followStatus(
    mockProfile,
    undefined,
    context
  );

  expect(mockUserAPI.loadFollowingStatus).toBeCalledWith(mockProfile.id);
  expect(result).toEqual(2);
});

test("UserProfile followStatus", async () => {
  mockUserAPI.loadFollowingStatus.mockReturnValueOnce(2);

  const result = await UserProfile.followStatus(
    mockProfile,
    undefined,
    context
  );

  expect(mockUserAPI.loadFollowingStatus).toBeCalledWith(mockProfile.id);
  expect(result).toEqual(2);
});

describe("UserProfile profileImageURL", () => {
  it("should return url", () => {
    mockMediaService.getResourceURL.mockReturnValueOnce("some_url");

    const result = UserProfile.profileImageURL(mockProfile, undefined, context);

    expect(mockMediaService.getResourceURL).toBeCalledWith(
      mockProfile.profileImageURL
    );
    expect(result).toEqual("some_url");
  });

  it("should return null", () => {
    mockMediaService.getResourceURL.mockReturnValueOnce("some_url");

    const result = UserProfile.profileImageURL(
      { ...mockProfile, profileImageURL: undefined },
      undefined,
      context
    );

    expect(mockMediaService.getResourceURL).toBeCalledTimes(0);
    expect(result).toEqual(null);
  });
});

describe("UserProfile coverImageURL", () => {
  it("should return url", () => {
    mockMediaService.getResourceURL.mockReturnValueOnce("some_url");

    const result = UserProfile.coverImageURL(mockProfile, undefined, context);

    expect(mockMediaService.getResourceURL).toBeCalledWith(
      mockProfile.coverImageURL
    );
    expect(result).toEqual("some_url");
  });

  it("should return null", () => {
    mockMediaService.getResourceURL.mockReturnValueOnce("some_url");

    const result = UserProfile.coverImageURL(
      { ...mockProfile, coverImageURL: undefined },
      undefined,
      context
    );

    expect(mockMediaService.getResourceURL).toBeCalledTimes(0);
    expect(result).toEqual(null);
  });
});

test("UserProfile posts", async () => {
  mockContentAPI.getPostsByAuthor.mockReturnValueOnce([mockPost]);

  const args = {
    limit: 10,
    offset: 0,
  };

  const result = await UserProfile.posts(mockProfile, args, context);

  expect(mockContentAPI.getPostsByAuthor).toBeCalledWith(
    mockProfile.id,
    args.limit,
    args.offset
  );
  expect(result).toEqual([mockPost]);
});

test("UserProfile ideas", async () => {
  mockContentAPI.getIdeasByAuthor.mockReturnValueOnce([mockIdea]);

  const args = {
    limit: 10,
    offset: 0,
  };

  const result = await UserProfile.ideas(mockProfile, args, context);

  expect(mockContentAPI.getIdeasByAuthor).toBeCalledWith(
    mockProfile.id,
    args.limit,
    args.offset
  );
  expect(result).toEqual([mockIdea]);
});
