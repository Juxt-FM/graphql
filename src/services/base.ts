/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

export const SERVER_ERROR = "server_error";
export const INPUT_ERROR = "bad_input";
export const NOT_FOUND = "not_found";

export class ServiceError {
  message: string;
  invalidArgs: string[];
  name:
    | typeof SERVER_ERROR
    | typeof INPUT_ERROR
    | typeof NOT_FOUND = SERVER_ERROR;

  constructor(message = "An error occurred while processing your request.") {
    this.message = message;
  }
}

export default class BaseService {
  protected throwServerError() {
    throw new ServiceError();
  }

  protected throwNotFound() {
    const err = new ServiceError("Not found.");
    err.name = NOT_FOUND;
    throw err;
  }

  protected throwInputError(msg: string, invalidArgs: string[]) {
    const err = new ServiceError(msg);
    err.name = INPUT_ERROR;
    err.invalidArgs = invalidArgs;

    throw err;
  }
}
