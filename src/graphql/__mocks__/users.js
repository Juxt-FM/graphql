/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

const { gql } = require("apollo-server-express");

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
      followStatus {
        timestamp
      }
      created
      updated
    }
  }
`;

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

const FOLLOW_PROFILE = gql`
  mutation Follow($id: ID!) {
    followProfile(id: $id) {
      timestamp
    }
  }
`;

const UNFOLLOW_PROFILE = gql`
  mutation Unfollow($id: ID!) {
    unfollowProfile(id: $id)
  }
`;

module.exports = {
  queries: {
    USER_PROFILE,
  },
  mutations: {
    UPDATE_PROFILE,
    UPDATE_PROFILE_IMAGE,
    UPDATE_COVER_IMAGE,
    FOLLOW_PROFILE,
    UNFOLLOW_PROFILE,
  },
};
