const gremlin = require("gremlin");

const traversal = gremlin.process.AnonymousTraversalSource.traversal;
const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection;

const query = traversal().withRemote(
  new DriverRemoteConnection(
    new DriverRemoteConnection(
      process.env.GREMLIN_HOST || "ws://localhost:8182/gremlin"
    )
  )
);

async function main() {
  await query.V().drop().next();
  await query.E().drop().next();
}

main().then(() => process.exit(0));
