const {
  default: { Mutation, Query, Post, Idea },
} = require("../users");

const mockUserAPI = require("../../sources/__mocks__/users");
const mockContentAPI = require("../../sources/__mocks__/content");
const { mockProfile } = require("../../../database/__mocks__/users");
const {
  mockPost,
  mockIdea,
  mockReaction,
} = require("../../../database/__mocks__/content");

const context = {
  dataSources: {
    content: mockContentAPI,
    users: mockUserAPI,
  },
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
