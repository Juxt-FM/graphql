/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { IResolverContext } from "src/graphql/server";

export const me = async (
  parent: undefined,
  args: undefined,
  context: IResolverContext
) => {
  const { auth } = context.dataSources;

  return await auth.getCurrentUser();
};
