/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

const { gql } = require("apollo-server-express");

const SECTORS = gql`
  query Sectors($limit: Int!, $offset: Int!) {
    sectors(limit: $limit, offset: $offset) {
      name
    }
  }
`;

const INDUSTRIES = gql`
  query Industries($limit: Int!, $offset: Int!) {
    industries(limit: $limit, offset: $offset) {
      name
    }
  }
`;

const CREATE_LIST = gql`
  mutation CreateList($data: ListInput!) {
    createList(data: $data) {
      id
      name
      private
      created
      updated
    }
  }
`;

const UPDATE_LIST = gql`
  mutation UpdateList($id: ID!, $data: ListInput!) {
    updateList(id: $id, data: $data) {
      id
      name
      private
      created
      updated
    }
  }
`;

const DELETE_LIST = gql`
  mutation DeleteList($id: ID!) {
    deleteList(id: $id)
  }
`;

module.exports = {
  queries: {
    SECTORS,
    INDUSTRIES,
  },
  mutations: {
    CREATE_LIST,
    UPDATE_LIST,
    DELETE_LIST,
  },
};
