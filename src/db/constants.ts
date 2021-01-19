/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

export const labels = {
  USER_ACCOUNT: "user_account",
  USER_PROFILE: "user_profile",
  USER_DEVICE: "user_device",
  COMPANY: "company",
  BUSINESS_SECTOR: "business_sector",
  BUSINESS_INDUSTRY: "business_industry",
  USER_CREATED_LIST: "user_created_list",
  POST: "post",
  IDEA: "idea",
};

export const relationships = {
  LOGGED_IN: "logged_in",
  USES_DEVICE: "uses_device",
  HAS_PROFILE: "has_profile",
  IN_SECTOR: "in_sector",
  IN_INDUSTRY: "in_industry",
  CREATED_LIST: "created_list",
  IN_LIST: "in_list",
  FOLLOWING: "following",
  AUTHORED: "authored",
  REPLY_TO: "reply_to",
  REACTED_TO: "reacted_to",
};

interface IGraphObject {
  label: string;
}

export interface IUserAccount extends IGraphObject {
  id: string;
  email: string;
  phone?: string;
  password: string;
  verified?: boolean;
  created: Date | number;
  updated: Date | number;
  deactivated?: Date | number;
  suspended?: Date | number;
}

export interface IUserDevice extends IGraphObject {
  id: string;
  identifier: string;
  platform: "ios" | "android" | "web";
  model: string;
  address: string;
  created: Date | number;
  updated: Date | number;
}

export interface IRawProfile extends IGraphObject {
  id: string;
  name?: string;
  location?: string;
  summary?: string;
  coverImageURL?: string;
  profileImageURL?: string;
  created: number;
  updated: number;
}

export interface IUserProfile extends IGraphObject {
  id: string;
  name?: string;
  location?: string;
  summary?: string;
  coverImageURL?: string;
  profileImageURL?: string;
  created: Date | number;
  updated: Date | number;
}

export interface ICompany extends IGraphObject {
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

export interface IBusinessSector extends IGraphObject {
  id: string;
  name: string;
}

export interface IBusinessIndustry extends IGraphObject {
  id: string;
  name: string;
}

export interface IPost extends IGraphObject {
  author: string;
  publicationStatus: "public" | "draft";
  contentFormat: "markdown" | "html";
  title: string;
  summary: String;
  imageURL: String;
  content: string;
  created: number | Date;
  updated: number | Date;
}

export interface IIdea extends IGraphObject {
  author: string;
  message: string;
  created: number | Date;
  updated: number | Date;
}
