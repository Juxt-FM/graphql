/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

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
  const { uploadService } = context;

  return await uploadService.getFileUploadURL("images", uuidv4());
};
