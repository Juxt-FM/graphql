/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

export const labels = {
  UserAccount: "user_account",
  UserProfile: "user_profile",
  UserDevice: "user_device",
  Company: "company",
  BusinessSector: "business_sector",
  BusinessIndustry: "business_industry",
};

export const relationships = {
  LoggedIn: "logged_in",
  UsesDevice: "uses_device",
  HasProfile: "has_profile",
  Verification: "needs_verification",
  InSector: "in_sector",
  InIndustry: "in_industry",
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

export interface IUserDevice {
  id: string;
  identifier: string;
  platform: "ios" | "android" | "web";
  model: string;
  address: string;
  created: Date;
  updated: Date;
}

export interface IRawProfile {
  id: string;
  name?: string;
  location?: string;
  summary?: string;
  coverImageURL?: string;
  profileImageURL?: string;
  created: number;
  updated: number;
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

export interface ICompany {
  id: string;
  symbol: string;
  companyName: string;
  exchange: string;
  industry: string;
  website: string;
  description: string;
  CEO: string;
  securityName: string;
  issueType: string;
  sector: string;
  primarySicCode: number;
  employees: number;
  tags: string[];
  address: string;
  address2?: string;
  state: string;
  city: string;
  zip: string;
  country: string;
  phone: string;
}

export interface IBusinessSector {
  id: string;
  name: string;
}

export interface IBusinessIndustry {
  id: string;
  name: string;
}
