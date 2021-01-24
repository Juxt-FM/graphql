/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

const { createTestClient } = require("apollo-server-testing");

const { buildTestServer } = require("./__utils");

const { mockPost, mockIdea } = require("../../database/__mocks__/content");
const { mockProfile } = require("../../database/__mocks__/users");
const { queries, mutations } = require("../__mocks__/content");

test("QUERY postByID", async () => {
  const {
    server,
    mockContentService,
    mockUserService,
  } = await buildTestServer();

  mockUserService.loadProfile.mockReturnValueOnce(mockProfile);
  mockContentService.getByID.mockReturnValueOnce(mockPost);

  const { query } = createTestClient(server);

  const res = await query({
    query: queries.POST_BY_ID,
    variables: { id: mockPost.id },
  });

  const { postByID: result } = res.data;

  expect(result.id).toEqual(mockPost.id);
  expect(result.title).toEqual(mockPost.title);
  expect(result.summary).toEqual(mockPost.summary);
  expect(result.content).toEqual(mockPost.content);
  expect(result.author.id).toEqual(mockProfile.id);
  expect(result.author.name).toEqual(mockProfile.name);
  expect(result.author.summary).toEqual(mockProfile.summary);
  expect(result.author.location).toEqual(mockProfile.location);
});

test("QUERY ideaByID", async () => {
  const {
    server,
    mockContentService,
    mockUserService,
  } = await buildTestServer();

  mockUserService.loadProfile.mockReturnValueOnce(mockProfile);
  mockContentService.getByID.mockReturnValueOnce(mockIdea);

  const { query } = createTestClient(server);

  const res = await query({
    query: queries.IDEA_BY_ID,
    variables: { id: mockIdea.id },
  });

  const { ideaByID: result } = res.data;

  expect(result.id).toEqual(mockIdea.id);
  expect(result.message).toEqual(mockIdea.message);
  expect(result.author.id).toEqual(mockProfile.id);
  expect(result.author.name).toEqual(mockProfile.name);
  expect(result.author.summary).toEqual(mockProfile.summary);
  expect(result.author.location).toEqual(mockProfile.location);
});

test("MUTATION createPost", async () => {
  const { server, mockContentService } = await buildTestServer();

  const data = {
    publicationStatus: "public",
    contentFormat: "html",
    title: "Post Title",
    summary: "",
    content: "This is some post content!",
  };

  const mockResponse = { ...mockPost, ...data };

  mockContentService.createPost.mockReturnValueOnce(mockResponse);

  const { mutate } = createTestClient(server);

  const res = await mutate({
    mutation: mutations.CREATE_POST,
    variables: { data },
  });

  const { createPost: result } = res.data;

  expect(result.id).toEqual(mockPost.id);
  expect(result.publicationStatus).toEqual(data.publicationStatus);
  expect(result.contentFormat).toEqual(data.contentFormat);
  expect(result.title).toEqual(data.title);
  expect(result.summary).toEqual(data.summary);
  expect(result.content).toEqual(data.content);
});

test("MUTATION updatePost", async () => {
  const { server, mockContentService } = await buildTestServer();

  const data = {
    publicationStatus: "public",
    contentFormat: "html",
    title: "Post Title",
    summary: "",
    content: "This is some post content!",
  };

  const mockResponse = { ...mockPost, ...data };

  mockContentService.updatePost.mockReturnValueOnce(mockResponse);

  const { mutate } = createTestClient(server);

  const res = await mutate({
    mutation: mutations.UPDATE_POST,
    variables: { id: mockPost.id, data },
  });

  const { updatePost: result } = res.data;

  expect(result.id).toEqual(mockPost.id);
  expect(result.publicationStatus).toEqual(data.publicationStatus);
  expect(result.contentFormat).toEqual(data.contentFormat);
  expect(result.title).toEqual(data.title);
  expect(result.summary).toEqual(data.summary);
  expect(result.content).toEqual(data.content);
});

test("MUTATION deletePost", async () => {
  const { server, mockContentService } = await buildTestServer();

  const mockResponse = "deleted post";

  mockContentService.deletePost.mockReturnValueOnce(mockResponse);

  const { mutate } = createTestClient(server);

  const res = await mutate({
    mutation: mutations.DELETE_POST,
    variables: { id: mockPost.id },
  });

  const { deletePost: result } = res.data;

  expect(result).toEqual(mockResponse);
});

test("MUTATION createIdea", async () => {
  const { server, mockContentService } = await buildTestServer();

  const data = {
    replyStatus: null,
    message: "I have an idea!",
  };

  const mockResponse = { ...mockPost, ...data };

  mockContentService.createIdea.mockReturnValueOnce(mockResponse);

  const { mutate } = createTestClient(server);

  const res = await mutate({
    mutation: mutations.CREATE_IDEA,
    variables: { data },
  });

  const { createIdea: result } = res.data;

  expect(result.id).toEqual(mockPost.id);
  expect(result.message).toEqual(data.message);
});

test("MUTATION updateIdea", async () => {
  const { server, mockContentService } = await buildTestServer();

  const message = "updated idea";

  const mockResponse = { ...mockIdea, message };

  mockContentService.updateIdea.mockReturnValueOnce(mockResponse);

  const { mutate } = createTestClient(server);

  const res = await mutate({
    mutation: mutations.UPDATE_IDEA,
    variables: { id: mockIdea.id, message },
  });

  const { updateIdea: result } = res.data;

  expect(result.id).toEqual(mockIdea.id);
  expect(result.message).toEqual(message);
});

test("MUTATION deleteIdea", async () => {
  const { server, mockContentService } = await buildTestServer();

  const mockResponse = "deleted idea";

  mockContentService.deleteIdea.mockReturnValueOnce(mockResponse);

  const { mutate } = createTestClient(server);

  const res = await mutate({
    mutation: mutations.DELETE_IDEA,
    variables: { id: mockIdea.id },
  });

  const { deleteIdea: result } = res.data;

  expect(result).toEqual(mockResponse);
});

test("MUTATION createReaction", async () => {
  const { server, mockContentService } = await buildTestServer();

  const data = {
    to: "1",
    reaction: "like",
  };

  const mockResponse = data.reaction;

  mockContentService.createReaction.mockReturnValueOnce(mockResponse);

  const { mutate } = createTestClient(server);

  const res = await mutate({
    mutation: mutations.CREATE_REACTION,
    variables: data,
  });

  const { createReaction: result } = res.data;

  expect(result).toEqual(data.reaction);
});

test("MUTATION deleteReaction", async () => {
  const { server, mockContentService } = await buildTestServer();

  const mockResponse = "deleted reaction";

  mockContentService.deleteReaction.mockReturnValueOnce(mockResponse);

  const { mutate } = createTestClient(server);

  const res = await mutate({
    mutation: mutations.DELETE_REACTION,
    variables: { id: mockIdea.id },
  });

  const { deleteReaction: result } = res.data;

  expect(result).toEqual(mockResponse);
});

test("MUTATION reportContent", async () => {
  const { server, mockContentService } = await buildTestServer();

  const mockResponse = "reported some content";

  mockContentService.reportContent.mockReturnValueOnce(mockResponse);

  const { mutate } = createTestClient(server);

  const res = await mutate({
    mutation: mutations.REPORT_CONTENT,
    variables: { id: mockIdea.id },
  });

  const { reportContent: result } = res.data;

  expect(result).toEqual(mockResponse);
});
