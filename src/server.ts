/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import application, { db } from "./app";
import * as logging from "./logging";

/**
 * Start the application
 *
 * Our GraphQL server runs behind an Express application
 * so we can take advantage of the open-source middleware
 * and plugins that are available.
 */

const port = process.env.PORT || 4000;

application.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server started at http://localhost:${port}`);
});

/**
 * The logging service in use is Sematext. You can find
 * the configuration in it's module. If Sematext is unavailable
 * (eg. in development), all logs are written to stdout.
 */

logging.start();

/**
 * Connect to the remote database. The database in use can be
 * any property graph that uses Gremlin. In production we will
 * be using AWS Neptune, but because this is a cloud-only service,
 * Apache Tinkerpop is used in the local docker deployment.
 */

db.connect();
