/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { IResolverContext } from "../../server";
import {
  MutationCreateUserArgs,
  MutationLoginUserArgs,
  MutationResetPasswordArgs,
  MutationVerifyEmailArgs,
  MutationVerifyPhoneArgs,
  MutationLogoutUserArgs,
} from "../../types";

export const createUser = async (
  parent: undefined,
  args: MutationCreateUserArgs,
  context: IResolverContext
) => {
  const { auth } = context.dataSources;

  return await auth.registerUser(args.data, args.device);
};

export const loginUser = async (
  parent: undefined,
  args: MutationLoginUserArgs,
  context: IResolverContext
) => {
  const { auth } = context.dataSources;

  return await auth.loginUser(args.data, args.device);
};

export const refreshToken = async (
  parent: undefined,
  args: undefined,
  context: IResolverContext
) => {
  const { auth } = context.dataSources;

  return await auth.refreshToken();
};

export const logoutUser = async (
  parent: undefined,
  args: MutationLogoutUserArgs,
  context: IResolverContext
) => {
  const { auth } = context.dataSources;

  return await auth.logoutUser(args.device);
};

export const resetPassword = async (
  parent: undefined,
  args: MutationResetPasswordArgs,
  context: IResolverContext
) => {
  const { auth } = context.dataSources;

  return await auth.resetPassword(args.data);
};

export const verifyEmail = async (
  parent: undefined,
  args: MutationVerifyEmailArgs,
  context: IResolverContext
) => {
  const { auth } = context.dataSources;

  return await auth.verifyEmail(args.email, args.code);
};

export const verifyPhone = async (
  parent: undefined,
  args: MutationVerifyPhoneArgs,
  context: IResolverContext
) => {
  const { auth } = context.dataSources;

  return await auth.verifyPhone(args.phone, args.code);
};

export const deactivateAccount = async (
  parent: undefined,
  args: undefined,
  context: IResolverContext
) => {
  const { auth } = context.dataSources;

  return await auth.deactivateAccount();
};
