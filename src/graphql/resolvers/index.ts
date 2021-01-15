/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import _ from "lodash";

import auth from "./auth";
import profiles from "./profiles";
import market from "./market";
import blog from "./blog";

export default _.merge(auth, profiles, market, blog);
