/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

export class ResourceNotFoundError extends Error {
  constructor(message = "Not found.") {
    super(message);

    this.name = "ResourceNotFoundError";
  }
}
