/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { isAuthenticated } from "./utils";

export default {
  Mutation: {
    createWatchlist: isAuthenticated,
    updateWatchlist: isAuthenticated,
    deleteWatchlist: isAuthenticated,
  },
};
