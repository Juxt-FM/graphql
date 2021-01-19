/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

const { UserContentService } = require("../user-content");

const { mockIdea, mockPost } = require("../../db/__mocks__/user-content");
const { ValidationError } = require("../errors");

const mockDbHandler = {
  loadReactionCounts: jest.fn(),
  loadReplyCounts: jest.fn(),
  findById: jest.fn(),
  findReplies: jest.fn(),
  createPost: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn(),
  createIdea: jest.fn(),
  updateIdea: jest.fn(),
  deleteIdea: jest.fn(),
  createReaction: jest.fn(),
  updateReaction: jest.fn(),
  deleteReaction: jest.fn(),
  reportContent: jest.fn(),
};

const service = new UserContentService(mockDbHandler);

describe("validatePost", () => {
  it("should validate and return post data", () => {
    const validated = service.validatePost(mockPostInput);

    expect(validated).toEqual(mockPostInput);
  });

  it("should throw validation error - title too short", () => {
    const data = {
      publicationStatus: "public",
      contentFormat: "markdown",
      title: "post",
      summary: "post summary",
      imageURL: "https://127.0.0.1/image",
      content: new Array(1001).join("a"),
    };

    try {
      service.validatePost(data);
      throw new Error();
    } catch (e) {
      expect(e instanceof ValidationError).toEqual(true);
      expect(e.invalidArgs).toEqual(["title"]);
    }
  });

  it("should throw validation error - title too long", () => {
    const data = {
      publicationStatus: "public",
      contentFormat: "markdown",
      title:
        "super long title that we should throw an error for, titles need to be short and sweet",
      summary: "post summary",
      imageURL: "https://127.0.0.1/image",
      content: new Array(1001).join("a"),
    };

    try {
      service.validatePost(data);
      throw new Error();
    } catch (e) {
      expect(e instanceof ValidationError).toEqual(true);
      expect(e.invalidArgs).toEqual(["title"]);
    }
  });

  it("should throw validation error - content too short", () => {
    const data = {
      publicationStatus: "public",
      contentFormat: "markdown",
      title: "this is a good title",
      summary: "post summary",
      imageURL: "https://127.0.0.1/image",
      content: "some content",
    };

    try {
      service.validatePost(data);
      throw new Error();
    } catch (e) {
      expect(e instanceof ValidationError).toEqual(true);
      expect(e.invalidArgs).toEqual(["title"]);
    }
  });

  it("should throw validation error - summary too long", () => {
    const data = {
      publicationStatus: "public",
      contentFormat: "markdown",
      title: "this is a good title",
      summary: new Array(1001).join("a"),
      imageURL: "https://127.0.0.1/image",
      content: new Array(1001).join("a"),
    };

    try {
      service.validatePost(data);
      throw new Error();
    } catch (e) {
      expect(e instanceof ValidationError).toEqual(true);
      expect(e.invalidArgs).toEqual(["summary"]);
    }
  });
});

describe("validateIdeaMessage", () => {
  it("should validate and return message", () => {
    const message = "Stocks only go uppppppp!";

    const validated = service.validateIdeaMessage(message);

    expect(validated).toEqual(message);
  });

  it("should throw validation error - message too short", () => {
    const message = "S";

    try {
      service.validateIdeaMessage(message);
      throw new Error();
    } catch (e) {
      expect(e instanceof ValidationError).toEqual(true);
      expect(e.invalidArgs).toEqual(["message"]);
    }
  });

  it("should throw validation error - message too long", () => {
    const message = new Array(1000).join("a");

    try {
      service.validateIdeaMessage(message);
      throw new Error();
    } catch (e) {
      expect(e instanceof ValidationError).toEqual(true);
      expect(e.invalidArgs).toEqual(["message"]);
    }
  });
});

test("getById - should return an idea", async () => {
  mockDbHandler.findById.mockReturnValueOnce(mockIdea);

  const result = await service.getById(mockIdea.id);

  expect(mockDbHandler.findById).toBeCalledWith(mockIdea.id);
  expect(result).toEqual(mockIdea);
});

test("getReplies - should return an idea's replies", async () => {
  mockDbHandler.findReplies.mockReturnValueOnce([mockIdea]);

  const limit = 10;
  const offset = 0;

  const result = await service.getReplies(mockIdea.id, limit, offset);

  expect(mockDbHandler.findReplies).toBeCalledWith(mockIdea.id, limit, offset);
  expect(result).toEqual([mockIdea]);
});

test("createPost - should create and return a post", async () => {
  mockDbHandler.createPost.mockReturnValueOnce(mockPost);

  const result = await service.createPost("1", mockPostInput);

  expect(mockDbHandler.createPost).toBeCalledWith("1", mockPostInput);
  expect(result).toEqual(mockPost);
});

test("updatePost - should update and return a post", async () => {
  mockDbHandler.updatePost.mockReturnValueOnce(mockPost);

  const result = await service.updatePost("1", "1", mockPostInput);

  expect(mockDbHandler.updatePost).toBeCalledWith("1", "1", mockPostInput);
  expect(result).toEqual(mockPost);
});

test("deletePost - should delete a post", async () => {
  const result = await service.deletePost("1", "1");

  expect(mockDbHandler.deletePost).toBeCalledWith("1", "1");
  expect(typeof result).toEqual("string");
});

test("createIdea - should create and return an idea", async () => {
  mockDbHandler.createIdea.mockReturnValueOnce(mockIdea);

  const result = await service.createIdea("1", mockIdeaInput);

  expect(mockDbHandler.createIdea).toBeCalledWith("1", mockIdeaInput);
  expect(result).toEqual(mockIdea);
});

test("updateIdea - should update and return an idea", async () => {
  mockDbHandler.updateIdea.mockReturnValueOnce(mockIdea);

  const result = await service.updateIdea("1", "1", "mock updated message");

  expect(mockDbHandler.updateIdea).toBeCalledWith(
    "1",
    "1",
    "mock updated message"
  );
  expect(result).toEqual(mockIdea);
});

test("deleteIdea - should delete an idea", async () => {
  const result = await service.deleteIdea("1", "1");

  expect(mockDbHandler.deleteIdea).toBeCalledWith("1", "1");
  expect(typeof result).toEqual("string");
});

test("createReaction - should create and return a reaction", async () => {
  mockDbHandler.createReaction.mockReturnValueOnce(mockReactionInput.reaction);

  const result = await service.createReaction("1", mockReactionInput);

  expect(mockDbHandler.createReaction).toBeCalledWith("1", mockReactionInput);
  expect(result).toEqual(mockReactionInput.reaction);
});

test("deleteReaction - should delete a reaction", async () => {
  const result = await service.deleteReaction("1", "1");

  expect(mockDbHandler.deleteReaction).toBeCalledWith("1", "1");
  expect(typeof result).toEqual("string");
});

test("reportContent - should report content", async () => {
  const result = await service.reportContent("1", "1");

  expect(mockDbHandler.reportContent).toBeCalledWith("1", "1");
  expect(typeof result).toEqual("string");
});

describe("loadReactionCount", () => {
  test("should load an idea's reaction count", async () => {
    const mockResponse = [{ id: mockIdea.id, count: 500 }];

    mockDbHandler.loadReactionCounts.mockReturnValueOnce(mockResponse);

    const result = await service.loadReactionCount(mockIdea.id);

    expect(mockDbHandler.loadReactionCounts).toBeCalledWith([mockIdea.id]);
    expect(result).toEqual(mockResponse[0].count);
  });

  test("should return 0", async () => {
    mockDbHandler.loadReactionCounts.mockReturnValueOnce([]);

    const id = "bad_id";

    const result = await service.loadReactionCount(id);

    expect(mockDbHandler.loadReactionCounts).toBeCalledWith([id]);
    expect(result).toEqual(0);
  });
});

describe("loadReplyCount", () => {
  test("should load an idea's reaction count", async () => {
    const mockResponse = [{ id: mockIdea.id, count: 500 }];

    mockDbHandler.loadReplyCounts.mockReturnValueOnce(mockResponse);

    const result = await service.loadReplyCount(mockIdea.id);

    expect(mockDbHandler.loadReplyCounts).toBeCalledWith([mockIdea.id]);
    expect(result).toEqual(mockResponse[0].count);
  });

  test("should return 0", async () => {
    mockDbHandler.loadReplyCounts.mockReturnValueOnce([]);

    const id = "bad_id";

    const result = await service.loadReplyCount(id);

    expect(mockDbHandler.loadReplyCounts).toBeCalledWith([id]);
    expect(result).toEqual(0);
  });
});

const mockIdeaInput = {
  replyStatus: "1",
  message: "some message about stonks",
};

const mockPostInput = {
  publicationStatus: "public",
  contentFormat: "markdown",
  title: "post title",
  summary: "post summary",
  imageURL: "https://127.0.0.1/image",
  content: new Array(1001).join("a"),
};

const mockReactionInput = {
  to: "1",
  reaction: "like",
};
