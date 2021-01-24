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
  LIST: "list",
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
  REPORTED: "reported",
};

interface IVertex {
  id: string;
  label: string;
}

interface IEdge {
  id: string;
}

export interface IUserAccount extends IVertex {
  profile: string;
  email: string;
  phone?: string;
  password: string;
  verified?: boolean;
  created: Date | number;
  updated: Date | number;
  deactivated?: Date | number;
  suspended?: Date | number;
}

export interface IUserDevice extends IVertex {
  identifier: string;
  platform: "ios" | "android" | "web";
  model: string;
  address: string;
  created: Date | number;
  updated: Date | number;
}

export interface IRawProfile extends IVertex {
  name?: string;
  location?: string;
  summary?: string;
  coverImageURL?: string;
  profileImageURL?: string;
  created: number;
  updated: number;
}

export interface IUserProfile extends IVertex {
  name?: string;
  location?: string;
  summary?: string;
  coverImageURL?: string;
  profileImageURL?: string;
  created: Date | number;
  updated: Date | number;
}

export interface ICompany extends IVertex {
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

export interface IBusinessSector extends IVertex {
  name: string;
}

export interface IBusinessIndustry extends IVertex {
  name: string;
}

export interface IPost extends IVertex {
  author: string;
  publicationStatus: "public" | "draft";
  contentFormat: "markdown" | "html";
  title: string;
  summary: string;
  imageURL: string;
  content: string;
  created: number | Date;
  updated: number | Date;
}

export interface IIdea extends IVertex {
  author: string;
  message: string;
  created: number | Date;
  updated: number | Date;
}

export interface IReaction extends IEdge {
  reaction: "like" | "dislike" | "love" | "hate";
  created: number | Date;
}

export interface IList extends IVertex {
  name: string;
  private: boolean;
  created: number | Date;
  updated: number | Date;
}
