/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { RESTDataSource } from "apollo-datasource-rest";

import { IContext } from "../server";

interface IAnalysisAPI {
  uri?: string;
}

export class AnalysisAPI extends RESTDataSource<IContext> {
  constructor(options: IAnalysisAPI = {}) {
    super();
    this.baseURL = options.uri || "http://localhost:6066/";
  }
}
