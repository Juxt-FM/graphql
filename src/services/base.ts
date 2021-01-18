/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { ApolloError } from "apollo-server-express";
/**
 * Base service class
 */
export default class BaseService {
  /**
   * Returns a generic fallback error
   */
  protected getDefaultError() {
    return new ApolloError("An error occurred while processing your request.");
  }
}
