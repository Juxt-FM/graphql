/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { S3 } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

import { IResolverContext } from "../../server";

export const userProfile = async (
  parent: undefined,
  args: any,
  context: IResolverContext
) => {
  const { users } = context.dataSources;

  return await users.getProfileByID(args.id);
};

export const imageUploadURL = async (
  parent: undefined,
  args: undefined,
  context: IResolverContext
) => {
  const s3 = new S3();

  const options = {
    Bucket: "images",
    Key: uuidv4(),
    Expires: 60,
  };

  return await s3.getSignedUrlPromise("putObject", options);
};
