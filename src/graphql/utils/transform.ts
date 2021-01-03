/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { camelCase, snakeCase } from "lodash";

/**
 * Coverts an array of objects or object keys to camelCase
 * @param obj
 */
export const toCamel = (obj: object | object[]): object | object[] => {
  if (Array.isArray(obj)) return obj.map(toCamel);
  else if (obj === Object(obj)) {
    const result = {};

    Object.keys(obj).forEach((k) => {
      // @ts-ignore
      result[camelCase(k)] = toCamel(obj[k]);
    });

    return result;
  }
  return obj;
};

/**
 * Coverts an array of objects or object keys to snake_case
 * @param obj
 */
export const toSnake = (obj: object | object[]): object | object[] => {
  if (Array.isArray(obj)) return obj.map(toSnake);
  else if (obj === Object(obj)) {
    const result = {};

    Object.keys(obj).forEach((k) => {
      // @ts-ignore
      result[snakeCase(k)] = toSnake(obj[k]);
    });

    return result;
  }
  return obj;
};
