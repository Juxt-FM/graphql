/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

export * from "./handlers";

import gremlin from "gremlin";

export default class GraphDB {
  host: string;
  graph: gremlin.structure.Graph;
  conn: gremlin.driver.DriverRemoteConnection;

  constructor(host: string) {
    this.host = host;
    this.query = this.query.bind(this);
  }

  /**
   * Injects a query parameter into any handlers used
   * @param Handler
   */
  registerHandler(Handler: any) {
    return new Handler({ query: this.query });
  }

  /**
   * Returns a new query
   */
  query() {
    return this.graph.traversal().withRemote(this.conn);
  }

  /**
   * Establish a connection to the graph
   */
  connect() {
    try {
      this.conn = new gremlin.driver.DriverRemoteConnection(this.host, {});
      this.graph = new gremlin.structure.Graph();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log("Socket error connecting to remote graph.");
    }
  }
}
