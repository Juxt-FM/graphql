/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

const { createTestClient } = require("apollo-server-testing");
const { gql } = require("apollo-server-express");

const { buildTestServer } = require("./__utils");

const { mockPost, mockIdea } = require("../../db/__mocks__/content");
const { mockProfile } = require("../../db/__mocks__/users");

const POST_BY_ID = gql`
  query Post($id: ID!) {
    postByID(id: $id) {
      id
      author {
        id
        name
        summary
        location
        profileImageURL
        coverImageURL
        created
        updated
      }
      title
      summary
      content
      created
      updated
    }
  }
`;

const IDEA_BY_ID = gql`
  query Idea($id: ID!) {
    ideaByID(id: $id) {
      id
      author {
        id
        name
        summary
        location
        profileImageURL
        coverImageURL
        created
        updated
      }
      replyStatus {
        id
      }
      message
      created
      updated
    }
  }
`;

test("QUERY postByID", async () => {
  const {
    server,
    mockContentService,
    mockUserService,
  } = await buildTestServer();

  mockUserService.loadProfile.mockReturnValueOnce(mockProfile);
  mockContentService.getByID.mockReturnValueOnce(mockPost);

  const { mutate } = createTestClient(server);

  const res = await mutate({
    query: POST_BY_ID,
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

  const { mutate } = createTestClient(server);

  const res = await mutate({
    query: IDEA_BY_ID,
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

const CREATE_POST = gql`
  mutation CreatePost($data: PostInput!) {
    createPost(data: $data) {
      id
      publicationStatus
      contentFormat
      title
      summary
      content
      created
      updated
    }
  }
`;

const UPDATE_POST = gql`
  mutation UpdatePost($id: ID!, $data: PostInput!) {
    updatePost(id: $id, data: $data) {
      id
      publicationStatus
      contentFormat
      title
      summary
      content
      created
      updated
    }
  }
`;

const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id)
  }
`;

const CREATE_IDEA = gql`
  mutation CreateIdea($data: IdeaInput!) {
    createIdea(data: $data) {
      id
      message
      created
      updated
    }
  }
`;

const UPDATE_IDEA = gql`
  mutation UpdateIdea($id: ID!, $message: String!) {
    updateIdea(id: $id, message: $message) {
      id
      message
      created
      updated
    }
  }
`;

const DELETE_IDEA = gql`
  mutation DeleteIdea($id: ID!) {
    deleteIdea(id: $id)
  }
`;

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
    mutation: CREATE_POST,
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
    mutation: UPDATE_POST,
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
    mutation: DELETE_POST,
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
    mutation: CREATE_IDEA,
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
    mutation: UPDATE_IDEA,
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
    mutation: DELETE_IDEA,
    variables: { id: mockIdea.id },
  });

  const { deleteIdea: result } = res.data;

  expect(result).toEqual(mockResponse);
});
