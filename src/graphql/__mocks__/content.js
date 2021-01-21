/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

const { gql } = require("apollo-server-express");

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

const CREATE_REACTION = gql`
  mutation CreateReaction($to: ID!, $reaction: ReactionType!) {
    createReaction(to: $to, reaction: $reaction)
  }
`;

const DELETE_REACTION = gql`
  mutation DeleteReaction($id: ID!) {
    deleteReaction(id: $id)
  }
`;

const REPORT_CONTENT = gql`
  mutation ReportContent($id: ID!) {
    reportContent(id: $id)
  }
`;

module.exports = {
  queries: {
    IDEA_BY_ID,
    POST_BY_ID,
  },
  mutations: {
    CREATE_POST,
    UPDATE_POST,
    DELETE_POST,
    CREATE_IDEA,
    UPDATE_IDEA,
    DELETE_IDEA,
    CREATE_REACTION,
    DELETE_REACTION,
    REPORT_CONTENT,
  },
};
