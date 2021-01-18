/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

const { HttpLink } = require("apollo-link-http");
const fetch = require("node-fetch");
const { execute } = require("apollo-link");

const { default: application } = require("../app");

const startServer = () => {
  const httpServer = application.listen({ port: 0 });

  const link = new HttpLink({
    uri: `http://localhost:${httpServer.port}`,
    fetch,
  });

  const executeOperation = ({ query, variables = {} }) =>
    execute(link, { query, variables });

  return {
    link,
    stop: () => httpServer.server.close(),
    graphql: executeOperation,
  };
};

module.exports = { startServer };
