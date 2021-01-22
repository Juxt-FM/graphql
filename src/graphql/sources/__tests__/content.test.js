/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

const { ContentAPI } = require("../content");

const {
  mockPost,
  mockIdea,
  mockReaction,
} = require("../../../database/__mocks__/content");

const mockContentService = {
  buildReactionLoader: jest.fn(),
  getByID: jest.fn(),
  getByAuthor: jest.fn(),
  getReplies: jest.fn(),
  createPost: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn(),
  createIdea: jest.fn(),
  updateIdea: jest.fn(),
  deleteIdea: jest.fn(),
  createReaction: jest.fn(),
  deleteReaction: jest.fn(),
  reportContent: jest.fn(),
  loadReaction: jest.fn(),
  loadReplyCount: jest.fn(),
  loadReactionCount: jest.fn(),
  getReactions: jest.fn(),
};

const mockContext = {
  user: { id: 1, profile: 2, verified: true },
  contentService: mockContentService,
};

const ds = new ContentAPI();

ds.initialize({ context: mockContext });

test("should have initialized reaction loader", () => {
  const test = new ContentAPI();
  test.initialize({ context: mockContext });

  expect(mockContentService.buildReactionLoader).toBeCalledWith(
    mockContext.user.profile
  );
});

test("getPostByID", async () => {
  mockContentService.getByID.mockReturnValueOnce(mockPost);

  const post = await ds.getPostByID("1");

  expect(mockContentService.getByID).toBeCalledWith("1", "post");
  expect(post).toEqual(mockPost);
});

test("getIdeaByID", async () => {
  mockContentService.getByID.mockReturnValueOnce(mockIdea);

  const post = await ds.getIdeaByID("1");

  expect(mockContentService.getByID).toBeCalledWith("1", "idea");
  expect(post).toEqual(mockIdea);
});

test("getPostsByAuthor", async () => {
  mockContentService.getByAuthor.mockReturnValueOnce([mockPost]);

  const posts = await ds.getPostsByAuthor("1", 10, 0);

  expect(mockContentService.getByAuthor).toBeCalledWith("1", 10, 0, "post");
  expect(posts).toEqual([mockPost]);
});

test("getIdeasByAuthor", async () => {
  mockContentService.getByAuthor.mockReturnValueOnce([mockIdea]);

  const ideas = await ds.getIdeasByAuthor("1", 10, 0);

  expect(mockContentService.getByAuthor).toBeCalledWith("1", 10, 0, "idea");
  expect(ideas).toEqual([mockIdea]);
});

test("getReplies", async () => {
  mockContentService.getReplies.mockReturnValueOnce([mockIdea]);

  const result = await ds.getReplies("1", 100, 0);

  expect(mockContentService.getReplies).toBeCalledWith("1", 100, 0);
  expect(result).toEqual([mockIdea]);
});

test("getReactions", async () => {
  mockContentService.getReactions.mockReturnValueOnce([mockReaction]);

  const result = await ds.getReactions("1", 100, 0);

  expect(mockContentService.getReactions).toBeCalledWith("1", 100, 0);
  expect(result).toEqual([mockReaction]);
});

test("createPost", async () => {
  mockContentService.createPost.mockReturnValueOnce(mockPost);

  const data = {
    publicationStatus: "public",
    contentFormat: "markdown",
    title: "some title",
    summary: "post summary",
    content: "test content",
  };

  const result = await ds.createPost(data);

  expect(mockContentService.createPost).toBeCalledWith(
    mockContext.user.profile,
    data
  );
  expect(result).toEqual(mockPost);
});

test("updatePost", async () => {
  mockContentService.updatePost.mockReturnValueOnce(mockPost);

  const data = {
    publicationStatus: "public",
    contentFormat: "markdown",
    title: "some title",
    summary: "post summary",
    content: "test content",
  };

  const result = await ds.updatePost("1", data);

  expect(mockContentService.updatePost).toBeCalledWith(
    "1",
    mockContext.user.profile,
    data
  );
  expect(result).toEqual(mockPost);
});

test("deletePost", async () => {
  const res = "some success string";
  mockContentService.deletePost.mockReturnValueOnce(res);

  const result = await ds.deletePost("1");

  expect(mockContentService.deletePost).toBeCalledWith(
    "1",
    mockContext.user.profile
  );
  expect(result).toEqual(res);
});

test("createIdea", async () => {
  mockContentService.createIdea.mockReturnValueOnce(mockIdea);

  const data = {
    replyStatus: null,
    message: "some new idea",
  };

  const result = await ds.createIdea(data);

  expect(mockContentService.createIdea).toBeCalledWith(
    mockContext.user.profile,
    data
  );
  expect(result).toEqual(mockIdea);
});

test("updateIdea", async () => {
  mockContentService.updateIdea.mockReturnValueOnce(mockIdea);

  const message = "new message";

  const result = await ds.updateIdea("1", message);

  expect(mockContentService.updateIdea).toBeCalledWith(
    "1",
    mockContext.user.profile,
    message
  );
  expect(result).toEqual(mockIdea);
});

test("deleteIdea", async () => {
  const res = "some success string";
  mockContentService.deleteIdea.mockReturnValueOnce(res);

  const result = await ds.deleteIdea("1");

  expect(mockContentService.deleteIdea).toBeCalledWith(
    "1",
    mockContext.user.profile
  );
  expect(result).toEqual(res);
});

test("createReaction", async () => {
  const reaction = "like";

  mockContentService.createReaction.mockReturnValueOnce(reaction);

  const data = {
    to: "1",
    reaction,
  };

  const result = await ds.createReaction(data);

  expect(mockContentService.createReaction).toBeCalledWith(
    mockContext.user.profile,
    data
  );
  expect(result).toEqual(reaction);
});

test("deleteReaction", async () => {
  const res = "some success string";
  mockContentService.deleteReaction.mockReturnValueOnce(res);

  const result = await ds.deleteReaction("1");

  expect(mockContentService.deleteReaction).toBeCalledWith(
    mockContext.user.profile,
    "1"
  );

  expect(result).toEqual(res);
});

test("reportContent", async () => {
  const res = "some success string";
  mockContentService.reportContent.mockReturnValueOnce(res);

  const result = await ds.reportContent("1");

  expect(mockContentService.reportContent).toBeCalledWith(
    mockContext.user.profile,
    "1"
  );

  expect(result).toEqual(res);
});

test("loadReactionStatus", async () => {
  mockContentService.loadReaction.mockReturnValueOnce(mockReaction);

  const result = await ds.loadReactionStatus("1");

  expect(mockContentService.loadReaction).toBeCalledWith("1");

  expect(result).toEqual(mockReaction);
});

test("loadReplyCount", async () => {
  const count = 2;

  mockContentService.loadReplyCount.mockReturnValueOnce(count);

  const result = await ds.loadReplyCount("1");

  expect(mockContentService.loadReplyCount).toBeCalledWith("1");

  expect(result).toEqual(count);
});

test("loadReactionCount", async () => {
  const count = 2;

  mockContentService.loadReactionCount.mockReturnValueOnce(count);

  const result = await ds.loadReactionCount("1");

  expect(mockContentService.loadReactionCount).toBeCalledWith("1");

  expect(result).toEqual(count);
});

module.exports = { mockContentService };
