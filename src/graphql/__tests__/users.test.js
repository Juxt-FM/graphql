/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

const { createTestClient } = require("apollo-server-testing");
const { gql } = require("apollo-server-express");

const { buildTestServer } = require("./__utils");

const { mockProfile } = require("../../db/__mocks__/users");

const USER_PROFILE = gql`
  query Profile($id: ID!) {
    userProfile(id: $id) {
      id
      name
      location
      summary
      profileImageURL
      coverImageURL
      watchlists {
        id
      }
      posts {
        id
      }
      ideas {
        id
      }
      created
      updated
    }
  }
`;

test("QUERY userProfile", async () => {
  const { server, mockUserService } = await buildTestServer();

  mockUserService.getById.mockReturnValueOnce(mockProfile);

  const { mutate } = createTestClient(server);
  const res = await mutate({
    query: USER_PROFILE,
    variables: { id: mockProfile.id },
  });

  const { userProfile: result } = res.data;

  expect(result.id).toEqual(mockProfile.id);
  expect(result.name).toEqual(mockProfile.name);
  expect(result.summary).toEqual(mockProfile.summary);
  expect(result.location).toEqual(mockProfile.location);
});

const UPDATE_PROFILE = gql`
  mutation UpdateProfile($data: ProfileInput!) {
    updateProfile(data: $data) {
      id
      name
      location
      summary
      coverImageURL
      profileImageURL
      created
      updated
    }
  }
`;

const UPDATE_PROFILE_IMAGE = gql`
  mutation {
    updateProfileImage
  }
`;

const UPDATE_COVER_IMAGE = gql`
  mutation {
    updateCoverImage
  }
`;

test("MUTATION updateProfile", async () => {
  const { server, mockUserService } = await buildTestServer();

  const data = {
    name: "New Name",
    summary: "",
    location: "Charleston, SC",
  };

  const mockResponse = { ...mockProfile, ...data };

  mockUserService.updateProfile.mockReturnValueOnce(mockResponse);

  const { mutate } = createTestClient(server);
  const res = await mutate({
    mutation: UPDATE_PROFILE,
    variables: { data },
  });

  const { updateProfile: result } = res.data;

  expect(result.name).toEqual(data.name);
  expect(result.summary).toEqual(data.summary);
  expect(result.location).toEqual(data.location);
});

test("MUTATION updateProfileImage", async () => {
  const { server, mockMediaService } = await buildTestServer();

  mockMediaService.getSignedProfileUpload.mockReturnValueOnce(mockURLOutput);

  const { mutate } = createTestClient(server);
  const res = await mutate({
    mutation: UPDATE_PROFILE_IMAGE,
  });

  const { updateProfileImage: result } = res.data;

  expect(result).toEqual(JSON.stringify(mockURLOutput));
});

test("MUTATION updateCoverImage", async () => {
  const { server, mockMediaService } = await buildTestServer();

  mockMediaService.getSignedCoverUpload.mockReturnValueOnce(mockURLOutput);

  const { mutate } = createTestClient(server);
  const res = await mutate({
    mutation: UPDATE_COVER_IMAGE,
  });

  const { updateCoverImage: result } = res.data;

  expect(result).toEqual(JSON.stringify(mockURLOutput));
});

const mockURLOutput = {
  url: "https://s3.us-east-1.amazonaws.com/test-bucket",
  fields: {
    key: "test-key",
    bucket: "test-bucket",
  },
};
