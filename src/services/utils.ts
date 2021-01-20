/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { S3 } from "aws-sdk";

/**
 * A promisified version of the s3 SDK's method.
 *
 * We return a stringified version of the JSON response
 * so its format isn't enforced by a GraphQL schema
 * @param options
 */
export const createPresignedPost = (options: any): Promise<string> =>
  new Promise((resolve, reject) => {
    const s3 = new S3();

    s3.createPresignedPost(options, (err, res) => {
      if (err) reject(err);
      resolve(JSON.stringify(res));
    });
  });
