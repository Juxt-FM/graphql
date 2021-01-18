/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

const { MarketAPI } = require("../market");
const moment = require("moment");

const mocks = {
  get: jest.fn(),
  put: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
};

const mockContext = {
  user: { id: 1 },
};

const ds = new MarketAPI();
ds.initialize({ context: mockContext });

ds.get = mocks.get;
ds.put = mocks.put;
ds.post = mocks.post;
ds.delete = mocks.delete;

describe("market.getUserWatchlists", () => {
  it("get a user's watchlists", async () => {
    mocks.get.mockReturnValueOnce([mockWatchlist]);

    const res = await ds.getUserWatchlists(mockContext.user.id);

    expect(res).toEqual([mockWatchlist]);
    expect(mocks.get).toBeCalledWith(`watchlists/user/${mockContext.user.id}`);
  });
});

describe("market.createWatchlist", () => {
  it("creates a new watchlist", async () => {
    mocks.post.mockReturnValueOnce(mockWatchlist);

    const res = await ds.createWatchlist(mockWatchlist);

    expect(res).toEqual(mockWatchlist);
    expect(mocks.post).toBeCalledWith("watchlists", mockWatchlist);
  });
});

describe("market.updateWatchlist", () => {
  it("updates a watchlist", async () => {
    mocks.put.mockReturnValueOnce(mockWatchlist);

    const data = { name: "Updated watchlist" };

    const res = await ds.updateWatchlist(1, data);

    expect(res).toEqual(mockWatchlist);
    expect(mocks.put).toBeCalledWith("watchlists/1", data);
  });
});

describe("market.deleteWatchlist", () => {
  it("deletes a watchlist", async () => {
    mocks.delete.mockReturnValueOnce(null);

    await ds.deleteWatchlist(1);

    expect(mocks.delete).toBeCalledWith("watchlists/1");
  });
});

/**
 * Mock data
 */

const mockWatchlist = {
  name: "Test",
  symbols: ["QQQ", "NVDA"],
};
