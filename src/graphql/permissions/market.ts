/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { isAuthenticated } from "./utils";

export default {
  Mutation: {
    createList: isAuthenticated,
    updateList: isAuthenticated,
    deleteList: isAuthenticated,
  },
};
