/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

const { UserContentService } = require("../user-content");

const { mockIdea } = require("../../db/__mocks__/user-content");

const mockDbHandler = {
  loadReactionCounts: jest.fn(),
  loadReplyCounts: jest.fn(),
};

const service = new UserContentService(mockDbHandler);

describe("loadReactionCount", () => {
  test("should load an idea's reaction count", async () => {
    const mockResponse = [{ id: mockIdea.id, count: 500 }];

    mockDbHandler.loadReactionCounts.mockReturnValueOnce(mockResponse);

    const result = await service.loadReactionCount(mockIdea.id);

    expect(mockDbHandler.loadReactionCounts).toHaveBeenLastCalledWith([
      mockIdea.id,
    ]);
    expect(result).toEqual(mockResponse[0].count);
  });

  test("should return 0", async () => {
    mockDbHandler.loadReactionCounts.mockReturnValueOnce([]);

    const id = "bad_id";

    const result = await service.loadReactionCount(id);

    expect(mockDbHandler.loadReactionCounts).toHaveBeenLastCalledWith([id]);
    expect(result).toEqual(0);
  });
});

describe("loadReplyCount", () => {
  test("should load an idea's reaction count", async () => {
    const mockResponse = [{ id: mockIdea.id, count: 500 }];

    mockDbHandler.loadReplyCounts.mockReturnValueOnce(mockResponse);

    const result = await service.loadReplyCount(mockIdea.id);

    expect(mockDbHandler.loadReplyCounts).toHaveBeenLastCalledWith([
      mockIdea.id,
    ]);
    expect(result).toEqual(mockResponse[0].count);
  });

  test("should return 0", async () => {
    mockDbHandler.loadReplyCounts.mockReturnValueOnce([]);

    const id = "bad_id";

    const result = await service.loadReplyCount(id);

    expect(mockDbHandler.loadReplyCounts).toHaveBeenLastCalledWith([id]);
    expect(result).toEqual(0);
  });
});
