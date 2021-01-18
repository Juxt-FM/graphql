/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { DataSource, DataSourceConfig } from "apollo-datasource";
import { ApolloError, UserInputError } from "apollo-server-express";

import { ServiceError, ValidationError } from "../../services";
import { ResourceNotFoundError } from "../../db";

import * as logging from "../../logging";

import { IContext } from "../server";

export class BaseAPI extends DataSource {
  context: IContext;

  constructor() {
    super();
  }

  initialize(config: DataSourceConfig<IContext>) {
    this.context = config.context;
  }

  /**
   * Wraps an action the API makes, and reduces the try-catch block
   * mania that ensues. Function names are passed for logging purposes
   * in case of any errors.
   *
   * @param {string} name
   * @param {function} func
   */
  protected async handler(name: string, func: () => any) {
    try {
      return await func();
    } catch (e) {
      if (e instanceof ValidationError)
        return new UserInputError(e.message, { invalidArgs: e.invalidArgs });
      else if (e instanceof ServiceError || e instanceof ResourceNotFoundError)
        return new ApolloError(e.message);
      else {
        logging.logError(`${name} - ${e}`);
        return new ApolloError(
          "An error occurred while processing your request."
        );
      }
    }
  }
}
