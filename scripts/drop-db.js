const gremlin = require("gremlin");

const { database } = require("../src/settings");

const traversal = gremlin.process.AnonymousTraversalSource.traversal;
const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection;

const query = traversal().withRemote(new DriverRemoteConnection(database.host));

async function main() {
  await query.V().drop().next();
  await query.E().drop().next();
}

main().then(() => process.exit(0));
