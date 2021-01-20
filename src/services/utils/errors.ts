/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

export class ServiceError extends Error {
  constructor(message = "An error occurred while processing your request.") {
    super(message);

    this.name = "ServiceError";
  }
}

export class ValidationError extends ServiceError {
  invalidArgs: string[];

  constructor(message = "Invalid arguments.", invalidArgs: string[]) {
    super(message);

    this.name = "ValidationError";
    this.invalidArgs = invalidArgs;
  }
}
