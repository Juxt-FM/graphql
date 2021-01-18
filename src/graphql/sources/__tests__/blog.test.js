const { BlogAPI } = require("../blog");

const mocks = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

const mockContext = {
  user: { id: 1 },
};

const ds = new BlogAPI();

ds.initialize({ context: mockContext });

/**
 * Override request methods to test the response and input
 */
ds.get = mocks.get;
ds.put = mocks.put;
ds.post = mocks.post;
ds.delete = mocks.delete;

describe("blog.createPost", () => {
  it("create a blog post", async () => {
    mocks.post.mockReturnValueOnce(mockPost);

    const data = {
      title: "Some title",
      content: "Some content",
      symbols: ["NVDA", "QQQ", "FB"],
      tags: ["some tag"],
    };

    const res = await ds.createPost(data);

    expect(res).toEqual(mockPost);
    expect(mocks.post).toBeCalledWith("posts", data);
  });
});

describe("blog.updatePost", () => {
  it("update a blog post", async () => {
    mocks.put.mockReturnValueOnce(mockPost);

    const data = {
      title: "Some title",
      content: "Some content",
      symbols: ["NVDA", "QQQ", "FB"],
      tags: ["some tag"],
    };

    const res = await ds.updatePost(1, data);

    expect(res).toEqual(mockPost);
    expect(mocks.put).toBeCalledWith("posts/1", data);
  });
});

describe("blog.deletePost", () => {
  it("delete a blog post", async () => {
    mocks.delete.mockReturnValueOnce(mockPost);

    const res = await ds.deletePost(1);

    expect(typeof res).toEqual("string");
    expect(mocks.delete).toBeCalledWith("posts/1");
  });
});

describe("blog.createComment", () => {
  it("create a comment", async () => {
    mocks.post.mockReturnValueOnce(mockComment);

    const data = {
      post: 1,
      message: "This is a comment!",
    };

    const res = await ds.createComment(data);

    expect(res).toEqual(mockComment);
    expect(mocks.post).toBeCalledWith("comments", data);
  });
});

describe("blog.updateComment", () => {
  it("update a comment", async () => {
    mocks.put.mockReturnValueOnce(mockComment);

    const data = {
      message: "This is an updated comment!",
    };

    const res = await ds.updateComment(1, data);

    expect(res).toEqual(mockComment);
    expect(mocks.put).toBeCalledWith("comments/1", data);
  });
});

describe("blog.deleteComment", () => {
  it("delete a comment", async () => {
    await ds.deleteComment(1);

    expect(mocks.delete).toBeCalledWith("comments/1");
  });
});

describe("blog.createReaction", () => {
  it("create a reaction", async () => {
    mocks.post.mockReturnValueOnce(mockReaction);

    const res = await ds.createReaction(mockReaction);

    expect(res).toEqual(mockReaction);
    expect(mocks.post).toBeCalledWith("reactions", mockReaction);
  });
});

describe("blog.updateReaction", () => {
  it("update a reaction", async () => {
    mocks.put.mockReturnValueOnce(mockReaction);

    const res = await ds.updateReaction(1, mockReaction);

    expect(res).toEqual(mockReaction);
    expect(mocks.put).toBeCalledWith("reactions/1", mockReaction);
  });
});

describe("blog.deleteReaction", () => {
  it("delete a reaction", async () => {
    mocks.delete.mockReturnValueOnce(mockReaction);

    const res = await ds.deleteReaction(1, mockReaction);

    expect(typeof res).toEqual("string");
    expect(mocks.delete).toBeCalledWith("reactions/1");
  });
});

describe("blog.getById", () => {
  it("get blog post by id", async () => {
    mocks.get.mockReturnValueOnce(mockPost);

    const res = await ds.getById(1);

    expect(res).toEqual(mockPost);
    expect(mocks.get).toBeCalledWith(`posts/${1}`);
  });
});

describe("blog.filter", () => {
  it("get blog post by id", async () => {
    mocks.get.mockReturnValueOnce([mockPost]);

    const filters = {
      query: "Tech is awesome",
      symbols: ["NVDA", "QQQ"],
      limit: 10,
      offset: 0,
    };

    const res = await ds.filter(filters);

    expect(res).toEqual([mockPost]);
    expect(mocks.get).toBeCalledWith("posts", {
      ...filters,
      symbols: filters.symbols.join(","),
    });
  });
});

describe("blog.filter", () => {
  it("filter blog posts", async () => {
    mocks.get.mockReturnValueOnce([mockPost]);

    const filters = {
      symbols: ["NVDA", "QQQ"],
      limit: 10,
      offset: 0,
    };

    const res = await ds.filter(filters);

    expect(res).toEqual([mockPost]);
    expect(mocks.get).toBeCalledWith("posts", {
      ...filters,
      symbols: filters.symbols.join(","),
    });
  });
});

describe("blog.drafts", () => {
  it("get a user's drafts", async () => {
    mocks.get.mockReturnValueOnce([mockPost]);

    const filters = {
      limit: 10,
      offset: 0,
    };

    const res = await ds.drafts(filters);

    expect(res).toEqual([mockPost]);
    expect(mocks.get).toBeCalledWith("drafts", filters);
  });
});

describe("blog.getPostComments", () => {
  it("get a post's top-level comment chain", async () => {
    mocks.get.mockReturnValueOnce([mockComment]);

    const filters = {
      depth: 2,
      limit: 10,
      offset: 0,
    };

    const res = await ds.getPostComments(1, filters);

    expect(res).toEqual([mockComment]);
    expect(mocks.get).toBeCalledWith("comments/post/1", filters);
  });
});

describe("blog.getCommentThread", () => {
  it("get a comment's thread", async () => {
    mocks.get.mockReturnValueOnce([mockComment]);

    const filters = {
      depth: 2,
      limit: 10,
      offset: 0,
    };

    const res = await ds.getCommentThread(1, filters);

    expect(res).toEqual([mockComment]);
    expect(mocks.get).toBeCalledWith("comments/thread/1", filters);
  });
});

describe("blog.getReactions", () => {
  it("get reactions for a post or comment", async () => {
    mocks.get.mockReturnValueOnce([mockReaction]);

    const args = {
      id: 1,
      limit: 10,
      offset: 0,
    };

    const res = await ds.getReactions(args);

    expect(res).toEqual([mockReaction]);
    expect(mocks.get).toBeCalledWith("reactions/1", {
      limit: args.limit,
      offset: args.offset,
    });
  });
});

describe("blog.loadReactionCount", () => {
  it("loads the reaction count for a post or comment", async () => {
    mocks.get.mockReturnValueOnce({ id1: 0 });

    const res1 = await ds.loadReactionCount("id1");

    expect(res1).toEqual(0);
    expect(mocks.get).toBeCalledWith("reactions/load/count", {
      ids: "id1",
    });
  });
});

describe("blog.loadUserReaction", () => {
  it("loads the user's reaction to a post or comment", async () => {
    mocks.get.mockReturnValueOnce({ id1: mockReaction });

    const res1 = await ds.loadUserReaction("id1");

    expect(res1).toEqual(mockReaction);
    expect(mocks.get).toBeCalledWith("reactions/load/user", {
      ids: "id1",
    });
  });
});

/**
 * Mock data
 */

const mockPost = {
  id: 1,
  title: "Some title",
  content: "Some content",
  symbols: ["NVDA", "QQQ", "FB"],
  tags: ["some tag"],
  createdAt: "12412834213",
  updatedAt: "12341248261",
};

const mockComment = {
  author: 1,
  post: 1,
  message: "Some reply",
};

const mockReaction = {
  to: "12eufhwefkjewfh93232",
  user: "9328ru2uhf23f32f3f",
  reaction: "like",
};

module.exports = {
  mockPost,
  mockComment,
  mockReaction,
};
