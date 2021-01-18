/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

export const auth = {
  jwtKey: process.env.JWT_KEY || "test_key",
  refreshKey: process.env.REFRESH_KEY || "refresh_key",
  jwtAudience: process.env.JWT_AUDIENCE || "hedger:api",
  jwtIssuer: process.env.JWT_ISSUER || "http://localhost:4000/graphql",
  jwtSubject: process.env.JWT_SUBJECT || "Hedger core API",
  jwtExpiration: process.env.JWT_EXPIRATION || "15 minutes",
};

export const database = {
  host: process.env.GREMLIN_HOST || "ws://localhost:8182/gremlin",
};

export const mail = {
  fromEmail: "test@email.com",
};
