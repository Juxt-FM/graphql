/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { IResolverContext } from "../../server";
import {
  MutationCreateUserArgs,
  MutationForgotPasswordArgs,
  MutationLoginUserArgs,
  MutationResetPasswordArgs,
  MutationVerifyEmailArgs,
  MutationVerifyOtpArgs,
  MutationVerifyPhoneArgs,
} from "../../types";

export const createUser = async (
  parent: undefined,
  args: MutationCreateUserArgs,
  context: IResolverContext
) => {
  const { auth } = context.dataSources;

  return await auth.registerUser(args.data);
};

export const loginUser = async (
  parent: undefined,
  args: MutationLoginUserArgs,
  context: IResolverContext
) => {
  const { auth } = context.dataSources;

  return await auth.loginUser(args.data);
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
  args: undefined,
  context: IResolverContext
) => {
  const { auth } = context.dataSources;

  return await auth.logoutUser();
};

export const resetPassword = async (
  parent: undefined,
  args: MutationResetPasswordArgs,
  context: IResolverContext
) => {
  const { auth } = context.dataSources;

  return await auth.resetPassword(args.data);
};

export const forgotPassword = async (
  parent: undefined,
  args: MutationForgotPasswordArgs,
  context: IResolverContext
) => {
  const { auth } = context.dataSources;

  return await auth.forgotPassword(args.email);
};

export const verifyOTP = async (
  parent: undefined,
  args: MutationVerifyOtpArgs,
  context: IResolverContext
) => {
  const { auth } = context.dataSources;

  return await auth.loginOTP(args.code);
};

export const verifyEmail = async (
  parent: undefined,
  args: MutationVerifyEmailArgs,
  context: IResolverContext
) => {
  const { auth } = context.dataSources;

  return await auth.verifyEmail(args.code);
};

export const verifyPhone = async (
  parent: undefined,
  args: MutationVerifyPhoneArgs,
  context: IResolverContext
) => {
  const { auth } = context.dataSources;

  return await auth.verifyPhone(args.code);
};

export const deactivateAccount = async (
  parent: undefined,
  args: undefined,
  context: IResolverContext
) => {
  const { auth } = context.dataSources;

  return await auth.deactivateAccount();
};
