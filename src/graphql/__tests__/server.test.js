/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

const express = require("express");

const { buildGraph } = require("..");
const { default: GraphDB } = require("../../db");

const startServer = () => {
  const app = express();
  const db = new GraphDB("some_host");
  const server = buildGraph({ db });

  server.applyMiddleware({ app });

  return app.listen(0);
};

test("should start server", () => {
  const server = startServer();

  server.close();
});
