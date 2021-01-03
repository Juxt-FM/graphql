/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

export const jwtKey = process.env.JWT_KEY || "test_key";

export const refreshKey = process.env.REFRESH_KEY || "refresh_key";

export const jwtAudience = process.env.JWT_AUDIENCE || "hedger:api";

export const jwtIssuer =
  process.env.JWT_ISSUER || "http://localhost:4000/graphql";

export const jwtSubject = process.env.JWT_SUBJECT || "Hedger core API";

export const jwtExpiration = process.env.JWT_EXPIRATION || "15 minutes";

export const refreshCookie = process.env.REFRESH_TOKEN_COOKIE || "device_token";
