/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { ApolloError, UserInputError } from "apollo-server-express";
import { Error as MongooseError } from "mongoose";
import { Request, Response } from "express";
import _ from "lodash";

export interface IBaseConfig {
  req: Request;
  res: Response;
}

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

  /**
   * Generic handler for a mongoose validation error
   * @param err
   */
  private handleValidationError(err: MongooseError.ValidationError) {
    const errors: any[] = [];

    Object.keys(err.errors).forEach((path) => {
      const error = err.errors[path];

      let message = error.message;

      if (error.kind === "required") {
        const result = path.replace(/([A-Z])/g, " $1").toLowerCase();

        const final = result.charAt(0).toUpperCase() + result.slice(1);

        message = `${final} is required.`;
      } else if (error.kind === "enum") {
        const result = path.replace(/([A-Z])/g, " $1");

        const final = result.toLowerCase();
        message = `Please enter a valid ${final}.`;
      }

      errors.push({ message, invalidArgs: [path] });
    });

    throw new UserInputError(errors[0].message, {
      invalidArgs: Object.keys(err.errors),
    });
  }

  /**
   * Generic handler for a MongoDB constraint error
   * @param err
   */
  private handleConstraintError(err: any) {
    const key = Object.keys(err.keyValue)[0];
    throw new UserInputError(`This ${_.lowerCase(key)} is already in use.`, {
      invalidArgs: [key],
    });
  }

  /**
   * Generic handler for mutating MongoDB documents
   * @param err
   */
  protected handleMutationError(err: any) {
    if (err instanceof MongooseError.ValidationError)
      this.handleValidationError(err);
    else if (err.code === 11000) this.handleConstraintError(err);
    else if (!(err instanceof ApolloError)) throw this.getDefaultError();

    throw err;
  }
}
