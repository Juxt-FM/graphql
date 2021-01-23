const {
  default: { Mutation, Query, Post, Idea },
} = require("../content");

const mockUserAPI = require("../../sources/__mocks__/users");
const mockContentAPI = require("../../sources/__mocks__/content");
const { mockProfile } = require("../../../database/__mocks__/users");
const {
  mockPost,
  mockIdea,
  mockReaction,
} = require("../../../database/__mocks__/content");

const context = {
  user: { id: "1", profile: "2", verified: true },
  dataSources: {
    content: mockContentAPI,
    users: mockUserAPI,
  },
};

test("MUTATION createPost", async () => {
  mockContentAPI.createPost.mockReturnValueOnce(mockPost);

  const args = {
    data: {
      publicationStatus: "public",
    },
  };

  const result = await Mutation.createPost(undefined, args, context);

  expect(mockContentAPI.createPost).toBeCalledWith(args.data);
  expect(result).toEqual(mockPost);
});

test("MUTATION updatePost", async () => {
  mockContentAPI.updatePost.mockReturnValueOnce(mockPost);

  const args = {
    id: "1",
    data: {
      publicationStatus: "public",
    },
  };

  const result = await Mutation.updatePost(undefined, args, context);

  expect(mockContentAPI.updatePost).toBeCalledWith(args.id, args.data);
  expect(result).toEqual(mockPost);
});

test("MUTATION deletePost", async () => {
  mockContentAPI.deletePost.mockReturnValueOnce("success");

  const args = {
    id: "1",
  };

  const result = await Mutation.deletePost(undefined, args, context);

  expect(mockContentAPI.deletePost).toBeCalledWith(args.id);
  expect(result).toEqual("success");
});

test("MUTATION createIdea", async () => {
  mockContentAPI.createIdea.mockReturnValueOnce(mockIdea);

  const args = {
    data: {
      message: "some idea",
    },
  };

  const result = await Mutation.createIdea(undefined, args, context);

  expect(mockContentAPI.createIdea).toBeCalledWith(args.data);
  expect(result).toEqual(mockIdea);
});

test("MUTATION updateIdea", async () => {
  mockContentAPI.updateIdea.mockReturnValueOnce(mockIdea);

  const args = {
    id: "1",
    message: "updated message",
  };

  const result = await Mutation.updateIdea(undefined, args, context);

  expect(mockContentAPI.updateIdea).toBeCalledWith(args.id, args.message);
  expect(result).toEqual(mockIdea);
});

test("MUTATION deleteIdea", async () => {
  mockContentAPI.deleteIdea.mockReturnValueOnce("success");

  const args = {
    id: "1",
  };

  const result = await Mutation.deleteIdea(undefined, args, context);

  expect(mockContentAPI.deleteIdea).toBeCalledWith(args.id);
  expect(result).toEqual("success");
});

test("MUTATION createReaction", async () => {
  mockContentAPI.createReaction.mockReturnValueOnce(mockReaction);

  const args = {
    to: "1",
    reaction: "like",
  };

  const result = await Mutation.createReaction(undefined, args, context);

  expect(mockContentAPI.createReaction).toBeCalledWith(args);
  expect(result).toEqual(mockReaction);
});

test("MUTATION deleteReaction", async () => {
  mockContentAPI.deleteReaction.mockReturnValueOnce("success");

  const args = {
    id: "1",
  };

  const result = await Mutation.deleteReaction(undefined, args, context);

  expect(mockContentAPI.deleteReaction).toBeCalledWith(args.id);
  expect(result).toEqual("success");
});

test("MUTATION reportContent", async () => {
  mockContentAPI.reportContent.mockReturnValueOnce("success");

  const args = {
    id: "1",
  };

  const result = await Mutation.reportContent(undefined, args, context);

  expect(mockContentAPI.reportContent).toBeCalledWith(args.id);
  expect(result).toEqual("success");
});

test("QUERY postByID", async () => {
  mockContentAPI.getPostByID.mockReturnValueOnce(mockPost);

  const args = {
    id: "1",
  };

  const result = await Query.postByID(undefined, args, context);

  expect(mockContentAPI.getPostByID).toBeCalledWith(args.id);
  expect(result).toEqual(mockPost);
});

test("QUERY ideaByID", async () => {
  mockContentAPI.getIdeaByID.mockReturnValueOnce(mockIdea);

  const args = {
    id: "1",
  };

  const result = await Query.ideaByID(undefined, args, context);

  expect(mockContentAPI.getIdeaByID).toBeCalledWith(args.id);
  expect(result).toEqual(mockIdea);
});

test("POST author", async () => {
  mockUserAPI.loadProfile.mockReturnValueOnce(mockProfile);

  const result = await Post.author(mockPost, undefined, context);

  expect(mockUserAPI.loadProfile).toBeCalledWith(mockPost.author);
  expect(result).toEqual(mockProfile);
});

test("POST replies", async () => {
  mockContentAPI.getReplies.mockReturnValueOnce([mockIdea]);

  const args = {
    limit: 10,
    offset: 0,
  };

  const result = await Post.replies(mockPost, args, context);

  expect(mockContentAPI.getReplies).toBeCalledWith(
    mockPost.id,
    args.limit,
    args.offset
  );
  expect(result).toEqual([mockIdea]);
});

test("POST reactions", async () => {
  mockContentAPI.getReactions.mockReturnValueOnce([mockReaction]);

  const args = {
    limit: 10,
    offset: 0,
  };

  const result = await Post.reactions(mockPost, args, context);

  expect(mockContentAPI.getReactions).toBeCalledWith(
    mockPost.id,
    args.limit,
    args.offset
  );
  expect(result).toEqual([mockReaction]);
});

test("POST reactionCount", async () => {
  const reactionCount = 5;

  mockContentAPI.loadReactionCount.mockReturnValueOnce(reactionCount);

  const result = await Post.reactionCount(mockPost, undefined, context);

  expect(mockContentAPI.loadReactionCount).toBeCalledWith(mockPost.id);
  expect(result).toEqual(reactionCount);
});

test("POST replyCount", async () => {
  const replyCount = 5;

  mockContentAPI.loadReplyCount.mockReturnValueOnce(replyCount);

  const result = await Post.replyCount(mockPost, undefined, context);

  expect(mockContentAPI.loadReplyCount).toBeCalledWith(mockPost.id);
  expect(result).toEqual(replyCount);
});

test("POST reactionStatus", async () => {
  mockContentAPI.loadReactionStatus.mockReturnValueOnce(mockReaction);

  const result = await Post.reactionStatus(mockPost, undefined, context);

  expect(mockContentAPI.loadReactionStatus).toBeCalledWith(mockPost.id);
  expect(result).toEqual(mockReaction);
});

test("POST reactionStatus - unauthenticated", async () => {
  mockContentAPI.loadReactionStatus.mockReturnValueOnce(mockReaction);

  const result = await Post.reactionStatus(mockPost, undefined, {
    ...context,
    user: undefined,
  });

  expect(mockContentAPI.loadReactionStatus).toBeCalledTimes(0);
  expect(result).toEqual(null);
});

test("IDEA author", async () => {
  mockUserAPI.loadProfile.mockReturnValueOnce(mockProfile);

  const result = await Idea.author(mockIdea, undefined, context);

  expect(mockUserAPI.loadProfile).toBeCalledWith(mockIdea.author);
  expect(result).toEqual(mockProfile);
});

test("IDEA replies", async () => {
  mockContentAPI.getReplies.mockReturnValueOnce([mockIdea]);

  const args = {
    limit: 10,
    offset: 0,
  };

  const result = await Idea.replies(mockIdea, args, context);

  expect(mockContentAPI.getReplies).toBeCalledWith(
    mockIdea.id,
    args.limit,
    args.offset
  );
  expect(result).toEqual([mockIdea]);
});

test("IDEA reactions", async () => {
  mockContentAPI.getReactions.mockReturnValueOnce([mockReaction]);

  const args = {
    limit: 10,
    offset: 0,
  };

  const result = await Idea.reactions(mockIdea, args, context);

  expect(mockContentAPI.getReactions).toBeCalledWith(
    mockIdea.id,
    args.limit,
    args.offset
  );
  expect(result).toEqual([mockReaction]);
});

test("IDEA reactionCount", async () => {
  const reactionCount = 5;

  mockContentAPI.loadReactionCount.mockReturnValueOnce(reactionCount);

  const result = await Idea.reactionCount(mockIdea, undefined, context);

  expect(mockContentAPI.loadReactionCount).toBeCalledWith(mockIdea.id);
  expect(result).toEqual(reactionCount);
});

test("IDEA replyCount", async () => {
  const replyCount = 5;

  mockContentAPI.loadReplyCount.mockReturnValueOnce(replyCount);

  const result = await Idea.replyCount(mockIdea, undefined, context);

  expect(mockContentAPI.loadReplyCount).toBeCalledWith(mockIdea.id);
  expect(result).toEqual(replyCount);
});

test("IDEA reactionStatus", async () => {
  mockContentAPI.loadReactionStatus.mockReturnValueOnce(mockReaction);

  const result = await Idea.reactionStatus(mockIdea, undefined, context);

  expect(mockContentAPI.loadReactionStatus).toBeCalledWith(mockIdea.id);
  expect(result).toEqual(mockReaction);
});

test("IDEA reactionStatus - unauthenticated", async () => {
  mockContentAPI.loadReactionStatus.mockReturnValueOnce(mockReaction);

  const result = await Idea.reactionStatus(mockIdea, undefined, {
    ...context,
    user: undefined,
  });

  expect(mockContentAPI.loadReactionStatus).toBeCalledTimes(0);
  expect(result).toEqual(null);
});

test("IDEA replyStatus", async () => {
  mockContentAPI.loadReplyStatus.mockReturnValueOnce(mockPost);

  const result = await Idea.replyStatus(mockIdea, undefined, context);

  expect(mockContentAPI.loadReplyStatus).toBeCalledWith(mockIdea.id);
  expect(result).toEqual(mockPost);
});
