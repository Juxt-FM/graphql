const { createTestClient } = require("apollo-server-testing");
const { gql } = require("apollo-server-express");
const { buildTestServer } = require("../__utils");

const { mockUser } = require("../../sources/__tests__/users.test");

const GET_CURRENT_USER = gql`
  query {
    me {
      id
      email {
        address
        verified
      }
      phone {
        number
        verified
      }
      profile {
        name
      }
      lastLogin
      updatedAt
      createdAt
    }
  }
`;

describe("User Queries", () => {
  it("fetch authenticated user account", async () => {
    const { server, mockUserService } = await buildTestServer();

    mockUserService.getById.mockReturnValueOnce({
      ...mockUser,
      id: mockUser._id,
    });

    const { query } = createTestClient(server);
    const res = await query({ query: GET_CURRENT_USER });

    expect(res).toMatchSnapshot();
  });
});

const UPDATE_USER = gql`
  mutation UpdateUser($data: UpdateUserInput!) {
    updateUser(data: $data) {
      id
      profile {
        name
      }
      email {
        address
        verified
      }
      phone {
        number
        verified
      }
      lastLogin
      updatedAt
      createdAt
    }
  }
`;

describe("User Mutations", () => {
  it("update user account", async () => {
    const { server, mockUserService } = await buildTestServer();

    mockUserService.update.mockReturnValueOnce({
      user: { ...mockUser, id: mockUser._id },
    });

    const { mutate } = createTestClient(server);
    const res = await mutate({
      mutation: UPDATE_USER,
      variables: {
        data: {
          name: "Test User",
          email: "new@email.com",
          phoneNumber: "+11234567890",
        },
      },
    });

    expect(res).toMatchSnapshot();
  });
});
