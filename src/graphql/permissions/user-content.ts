/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { isAuthenticated } from "./utils";

export default {
  Query: {
    myDrafts: isAuthenticated,
  },
  Mutation: {
    createPost: isAuthenticated,
    updatePost: isAuthenticated,
    deletePost: isAuthenticated,
    createIdea: isAuthenticated,
    updateIdea: isAuthenticated,
    deleteIdea: isAuthenticated,
    createReaction: isAuthenticated,
    updateReaction: isAuthenticated,
    deleteReaction: isAuthenticated,
  },
};
