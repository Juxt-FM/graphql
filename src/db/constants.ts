/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

export const labels = {
  UserAccount: "user_account",
  UserProfile: "user_profile",
  UserDevice: "user_device",
};

export const relationships = {
  LoggedIn: "logged_in",
  UsesDevice: "uses_device",
  HasProfile: "has_profile",
  Verification: "needs_verification",
};

export interface IRawUser {
  id: string;
  label: string;
  password: string;
  email: string;
  phone: string;
  created: number;
  updated: number;
  verified?: boolean;
  deactivated?: number;
  suspended?: number;
}

export interface IUserAccount {
  id: string;
  email: string;
  phone?: string;
  password: string;
  verified?: boolean;
  created: Date;
  updated: Date;
  deactivated?: Date;
  suspended?: Date;
}

export interface IUserProfile {
  id: string;
  name?: string;
  location?: string;
  summary?: string;
  coverImageURL?: string;
  profileImageURL?: string;
  created: Date;
  updated: Date;
}

export interface IUserDevice {
  id: string;
  identifier: string;
  platform: "ios" | "android" | "web";
  model: string;
  address: string;
  created: Date;
  updated: Date;
}
