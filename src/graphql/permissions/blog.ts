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
    createBlogPost: isAuthenticated,
    updateBlogPost: isAuthenticated,
    deleteBlogPost: isAuthenticated,
    createComment: isAuthenticated,
    updateComment: isAuthenticated,
    deleteComment: isAuthenticated,
    createReaction: isAuthenticated,
    updateReaction: isAuthenticated,
    deleteReaction: isAuthenticated,
  },
};
