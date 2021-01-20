/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

const { UserContentAPI } = require("../user-content");

const { mockPost, mockIdea } = require("../../../db/__mocks__/user-content");

const mockUserContentService = {
  buildReactionLoader: jest.fn(),
  getByID: jest.fn(),
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
};

const mockContext = {
  user: { id: 1, profile: 2, verified: true },
  userContentService: mockUserContentService,
};

const ds = new UserContentAPI();

ds.initialize({ context: mockContext });

test("should have initialized reaction loader", () => {
  const test = new UserContentAPI();
  test.initialize({ context: mockContext });

  expect(mockUserContentService.buildReactionLoader).toBeCalledWith(
    mockContext.user.profile
  );
});

test("getPostByID", async () => {
  mockUserContentService.getByID.mockReturnValueOnce(mockPost);

  const post = await ds.getPostByID("1");

  expect(mockUserContentService.getByID).toBeCalledWith("1", "post");
  expect(post).toEqual(mockPost);
});

test("getIdeaByID", async () => {
  mockUserContentService.getByID.mockReturnValueOnce(mockIdea);

  const post = await ds.getIdeaByID("1");

  expect(mockUserContentService.getByID).toBeCalledWith("1", "idea");
  expect(post).toEqual(mockIdea);
});

test("getReplies", async () => {
  mockUserContentService.getReplies.mockReturnValueOnce([mockIdea]);

  const result = await ds.getReplies("1", 100, 0);

  expect(mockUserContentService.getReplies).toBeCalledWith("1", 100, 0);
  expect(result).toEqual([mockIdea]);
});

test("createPost", async () => {
  mockUserContentService.createPost.mockReturnValueOnce(mockPost);

  const data = {
    publicationStatus: "public",
    contentFormat: "markdown",
    title: "some title",
    summary: "post summary",
    content: "test content",
  };

  const result = await ds.createPost(data);

  expect(mockUserContentService.createPost).toBeCalledWith(
    mockContext.user.profile,
    data
  );
  expect(result).toEqual(mockPost);
});

test("updatePost", async () => {
  mockUserContentService.updatePost.mockReturnValueOnce(mockPost);

  const data = {
    publicationStatus: "public",
    contentFormat: "markdown",
    title: "some title",
    summary: "post summary",
    content: "test content",
  };

  const result = await ds.updatePost("1", data);

  expect(mockUserContentService.updatePost).toBeCalledWith(
    "1",
    mockContext.user.profile,
    data
  );
  expect(result).toEqual(mockPost);
});

test("deletePost", async () => {
  const res = "some success string";
  mockUserContentService.deletePost.mockReturnValueOnce(res);

  const result = await ds.deletePost("1");

  expect(mockUserContentService.deletePost).toBeCalledWith(
    "1",
    mockContext.user.profile
  );
  expect(result).toEqual(res);
});

test("createIdea", async () => {
  mockUserContentService.createIdea.mockReturnValueOnce(mockIdea);

  const data = {
    replyStatus: null,
    message: "some new idea",
  };

  const result = await ds.createIdea(data);

  expect(mockUserContentService.createIdea).toBeCalledWith(
    mockContext.user.profile,
    data
  );
  expect(result).toEqual(mockIdea);
});

test("updateIdea", async () => {
  mockUserContentService.updateIdea.mockReturnValueOnce(mockIdea);

  const message = "new message";

  const result = await ds.updateIdea("1", message);

  expect(mockUserContentService.updateIdea).toBeCalledWith(
    "1",
    mockContext.user.profile,
    message
  );
  expect(result).toEqual(mockIdea);
});

test("deleteIdea", async () => {
  const res = "some success string";
  mockUserContentService.deleteIdea.mockReturnValueOnce(res);

  const result = await ds.deleteIdea("1");

  expect(mockUserContentService.deleteIdea).toBeCalledWith(
    "1",
    mockContext.user.profile
  );
  expect(result).toEqual(res);
});

test("createReaction", async () => {
  const reaction = "like";

  mockUserContentService.createReaction.mockReturnValueOnce(reaction);

  const data = {
    to: "1",
    reaction,
  };

  const result = await ds.createReaction(data);

  expect(mockUserContentService.createReaction).toBeCalledWith(
    mockContext.user.profile,
    data
  );
  expect(result).toEqual(reaction);
});

test("deleteReaction", async () => {
  const res = "some success string";
  mockUserContentService.deleteReaction.mockReturnValueOnce(res);

  const result = await ds.deleteReaction("1");

  expect(mockUserContentService.deleteReaction).toBeCalledWith(
    mockContext.user.profile,
    "1"
  );

  expect(result).toEqual(res);
});

test("reportContent", async () => {
  const res = "some success string";
  mockUserContentService.reportContent.mockReturnValueOnce(res);

  const result = await ds.reportContent("1");

  expect(mockUserContentService.reportContent).toBeCalledWith(
    mockContext.user.profile,
    "1"
  );

  expect(result).toEqual(res);
});

test("reportContent", async () => {
  const res = "some success string";
  mockUserContentService.reportContent.mockReturnValueOnce(res);

  const result = await ds.reportContent("1");

  expect(mockUserContentService.reportContent).toBeCalledWith(
    mockContext.user.profile,
    "1"
  );

  expect(result).toEqual(res);
});

test("loadReactionStatus", async () => {
  const reaction = "like";
  mockUserContentService.loadReaction.mockReturnValueOnce(reaction);

  const result = await ds.loadReactionStatus("1");

  expect(mockUserContentService.loadReaction).toBeCalledWith("1");

  expect(result).toEqual(reaction);
});

test("loadReplyCount", async () => {
  const count = 2;

  mockUserContentService.loadReplyCount.mockReturnValueOnce(count);

  const result = await ds.loadReplyCount("1");

  expect(mockUserContentService.loadReplyCount).toBeCalledWith("1");

  expect(result).toEqual(count);
});

test("loadReactionCount", async () => {
  const count = 2;

  mockUserContentService.loadReactionCount.mockReturnValueOnce(count);

  const result = await ds.loadReactionCount("1");

  expect(mockUserContentService.loadReactionCount).toBeCalledWith("1");

  expect(result).toEqual(count);
});
