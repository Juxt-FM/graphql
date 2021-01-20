/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

const { isUser, hasCredentials, hasVerifiedStatus } = require("../utils");

const mockUser = { id: "1", verified: true, profile: "2" };
const mockClient = { name: "web", version: "1.0" };

const buildContext = ({ user, client, cookies = {} }) => {
  return {
    user,
    client,
    expressCtx: { req: { signedCookies: cookies } },
  };
};

describe("isUser", () => {
  it("should return true", () => {
    const context = buildContext({ user: mockUser, client: mockClient });

    const result = isUser(undefined, {}, context);

    expect(result).toEqual(true);
  });

  it("should return false", () => {
    const context = buildContext({ user: undefined });

    const result = isUser(undefined, {}, context);

    expect(result).toEqual(false);
  });
});

describe("hasVerifiedStatus", () => {
  it("should return true", () => {
    const context = buildContext({ user: mockUser, client: mockClient });

    const result = hasVerifiedStatus(undefined, {}, context);

    expect(result).toEqual(true);
  });

  it("should return false", () => {
    const context = buildContext({
      user: { ...mockUser, verified: false },
      client: mockClient,
    });

    const result = hasVerifiedStatus(undefined, {}, context);

    expect(result).toEqual(false);
  });
});

describe("hasCredentials", () => {
  it("should return true - web client", () => {
    const context = buildContext({
      user: mockUser,
      client: mockClient,
      cookies: { device_token: "some_token" },
    });

    const result = hasCredentials(undefined, {}, context);

    expect(result).toEqual(true);
  });

  it("should return true - mobile client", () => {
    const context = buildContext({
      user: mockUser,
      client: { name: "mobile", version: "1.0" },
    });

    const result = hasCredentials(
      undefined,
      { token: "some_refresh_token" },
      context
    );

    expect(result).toEqual(true);
  });

  it("should return false - web client", () => {
    const context = buildContext({ user: mockUser, client: mockClient });

    const result = hasCredentials(undefined, {}, context);

    expect(result).toEqual(false);
  });

  it("should return false - mobile client", () => {
    const context = buildContext({
      user: mockUser,
      client: { name: "mobile", version: "1.0" },
    });

    const result = hasCredentials(undefined, {}, context);

    expect(result).toEqual(false);
  });
});
