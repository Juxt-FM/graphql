/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { S3 } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

import { IResolverContext } from "../../server";
import { QueryUserProfileArgs } from "../../types";

export const userProfile = async (
  parent: undefined,
  args: QueryUserProfileArgs,
  context: IResolverContext
) => {
  const { users } = context.dataSources;

  return await users.getProfileByID(args.id);
};

export const imageUploadURL = async () => {
  const s3 = new S3();

  const options = {
    Bucket: "images",
    Key: uuidv4(),
    Expires: 60,
  };

  return await s3.getSignedUrlPromise("putObject", options);
};
