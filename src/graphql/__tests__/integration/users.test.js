/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

const { createTestClient } = require("apollo-server-testing");
const { gql } = require("apollo-server-express");

const { buildTestServer } = require("../__utils");

const { mockProfile } = require("../../../db/__mocks__/users");

const USER_PROFILE = gql`
  query Profile($id: ID!) {
    userProfile(id: $id) {
      id
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

  expect(res.data.userProfile.id).toEqual(mockProfile.id);
});
