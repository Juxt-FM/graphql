/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

const gremlin = require("gremlin");
const { default: GraphDB } = require("../index");

jest.mock("gremlin");

const testHost = "wss://localhost:8182";

const graph = new GraphDB(testHost);

class TestHandler {
  graph;

  constructor(args) {
    this.graph = args;
  }
}

describe("GraphDB Instance", () => {
  it("should attempt to connect to database", () => {
    gremlin.driver.DriverRemoteConnection = jest.fn();
    graph.connect();

    expect(gremlin.driver.DriverRemoteConnection).toBeCalledWith(testHost, {});
  });

  it("should register handler", () => {
    const handler = graph.registerHandler(TestHandler);

    expect(handler.graph.query).toEqual(graph.query);
  });
});
