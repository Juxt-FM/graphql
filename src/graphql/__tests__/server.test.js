/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

const express = require("express");

const { buildServer } = require("..");
const { default: GraphDB } = require("../../db");

const startServer = async () => {
  const app = express();
  const db = new GraphDB("some_host");
  const server = buildServer({ db });

  server.applyMiddleware({ app });

  return await app.listen(0);
};

test("should start server", async () => {
  const server = await startServer();

  server.close();
});
