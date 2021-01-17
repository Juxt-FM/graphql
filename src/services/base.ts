/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { ApolloError } from "apollo-server-express";
import { Request, Response } from "express";
import _ from "lodash";

export interface IBaseConfig {
  req: Request;
  res: Response;
}

/**
 * Base service class
 * @param {IBaseConfig} config
 */
export default class BaseService {
  request: Request;
  response: Response;
  host: string;

  constructor(config: IBaseConfig) {
    this.request = config.req;
    this.response = config.res;
  }

  /**
   * Returns the request host
   */
  protected getHost() {
    return (
      this.request.headers.forwarded || this.request.connection.remoteAddress
    );
  }

  /**
   * Returns a generic fallback error
   */
  protected getDefaultError() {
    return new ApolloError("An error occurred while processing your request.");
  }
}
