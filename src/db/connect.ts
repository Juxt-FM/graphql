/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import gremlin from "gremlin";

import * as settings from "../settings";

let _graph: gremlin.structure.Graph;

export const connect = () => {
  if (_graph) return _graph;
  else {
    const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection;
    const Graph = gremlin.structure.Graph;
    const dc = new DriverRemoteConnection(settings.gremlin.host, {});

    const graph = _graph ?? new Graph();

    return graph.traversal().withRemote(dc);
  }
};

export const useGraph = () => {
  return _graph;
};
