const gremlin = require("gremlin");

const _ = require("lodash");
const faker = require("faker");
const bcrypt = require("bcrypt");
const moment = require("moment");

const traversal = gremlin.process.AnonymousTraversalSource.traversal;
const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection;

const labels = {
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

const relationships = {
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

const mockImageURL = faker.image.imageUrl();

const query = traversal().withRemote(
  new DriverRemoteConnection(
    process.env.GREMLIN_HOST || "ws://localhost:8182/gremlin"
  )
);

const getMockUsers = (count = 30) =>
  _.range(0, count).map(() => ({
    email: faker.internet.email(),
    phone: faker.phone.phoneNumber("+1##########"),
    profile: {
      name: faker.name.findName(),
      summary: faker.lorem.paragraph(),
      location: `${faker.address.city()}, ${faker.address.stateAbbr()}`,
      profileImageURL: mockImageURL,
      coverImageURL: mockImageURL,
    },
    password: bcrypt.hashSync("ab12cd34", 1),
    verified: Math.random() > 0.33,
    created: moment().valueOf(),
    updated: moment().valueOf(),
  }));

const getMockPosts = (count = 60) =>
  _.range(0, count).map(() => ({
    publicationStatus: "public",
    contentFormat: "markdown",
    title: faker.lorem.sentence(),
    summary: faker.lorem.paragraph(),
    imageURL: mockImageURL,
    content: faker.lorem.paragraphs(),
    created: moment().valueOf(),
    updated: moment().valueOf(),
  }));

const getMockIdeas = (count = 100) =>
  _.range(0, count).map(() => ({
    message: faker.lorem.paragraph(),
    created: moment().valueOf(),
    updated: moment().valueOf(),
  }));

const createUsers = async (users) => {
  const create = async (user) => {
    const result = await query
      .addV(labels.USER_ACCOUNT)
      .property("email", user.email)
      .property("phone", user.phone)
      .property("password", user.password)
      .property("verified", user.verified)
      .property("created", user.created)
      .property("updated", user.updated)
      .as("user")
      .addV(labels.USER_PROFILE)
      .property("name", user.profile.name)
      .property("summary", user.profile.summary)
      .property("location", user.profile.location)
      .property("created", user.created)
      .property("updated", user.updated)
      .as("profile")
      .addE(relationships.HAS_PROFILE)
      .from_("user")
      .to("profile")
      .select("profile")
      .id()
      .next();

    return result.value;
  };

  return Promise.all(users.map(create));
};

const createPosts = async (posts) => {
  const create = async (post) => {
    const result = await query
      .addV(labels.POST)
      .property("publicationStatus", post.publicationStatus)
      .property("contentFormat", post.contentFormat)
      .property("title", post.title)
      .property("summary", post.summary)
      .property("content", post.content)
      .property("imageURL", post.imageURL)
      .property("created", post.created)
      .property("updated", post.updated)
      .id()
      .next();

    return result.value;
  };

  return Promise.all(posts.map(create));
};

const createIdeas = async (ideas) => {
  const create = async (idea) => {
    const result = await query
      .addV(labels.IDEA)
      .property("message", idea.message)
      .property("created", idea.created)
      .property("updated", idea.updated)
      .id()
      .next();

    return result.value;
  };

  return Promise.all(ideas.map(create));
};

const createAuthors = async (users, posts, ideas) => {
  const postChunks = _.chunk(posts, Math.floor(posts.length / users.length));
  const ideaChunks = _.chunk(ideas, Math.floor(ideas.length / users.length));

  const create = async (user, content) => {
    try {
      await query
        .V(user)
        .as("user")
        .V(content)
        .as("content")
        .addE(relationships.AUTHORED)
        .from_("user")
        .to("content")
        .next();
    } catch (e) {
      console.log(user, content, e.message);
    }
  };

  return Promise.all(
    users.map((user, index) => {
      const content = [...postChunks[index], ...ideaChunks[index]];

      return Promise.all(content.map((item) => create(user, item)));
    })
  );
};

const createReactions = async (users, posts, ideas) => {
  const create = async (user, content) => {
    const reactionTypes = ["like", "dislike", "love", "hate"];
    try {
      const reaction = reactionTypes[Math.ceil(Math.random() * 3)];

      await query
        .V(user)
        .as("user")
        .V(content)
        .as("content")
        .addE(relationships.REACTED_TO)
        .property("reaction", reaction)
        .property("timestamp", moment().valueOf())
        .from_("user")
        .to("content")
        .next();
    } catch (e) {
      console.log(user, content, e.message);
    }
  };

  return Promise.all(
    users.map((user) => {
      const postSamples = _.sampleSize(posts, Math.ceil(posts.length / 2));
      const ideaSamples = _.sampleSize(ideas, Math.ceil(ideas.length / 2));

      const content = [...postSamples, ...ideaSamples];

      return Promise.all(content.map((item) => create(user, item)));
    })
  );
};

const createFollowers = async (users) => {
  const create = async (a, b) => {
    try {
      await query
        .V(a)
        .as("a")
        .V(b)
        .as("b")
        .addE(relationships.FOLLOWING)
        .property("timestamp", moment().valueOf())
        .from_("a")
        .to("b")
        .next();
    } catch (e) {
      console.log(a, b, e.message);
    }
  };

  return Promise.all(
    users.map((user) => {
      const sample = _.sampleSize(users, Math.ceil(users.length / 2)).filter(
        (other) => other !== user
      );

      return Promise.all(sample.map((item) => create(user, item)));
    })
  );
};

async function main() {
  console.log("generating mock users");
  const mockUsers = getMockUsers();

  console.log("generating mock posts");
  const mockPosts = getMockPosts();

  console.log("generating mock ideas");
  const mockIdeas = getMockIdeas();

  console.log("creating users");
  const users = await createUsers(mockUsers);

  console.log("creating posts");
  const posts = await createPosts(mockPosts);

  console.log("creating ideas");
  const ideas = await createIdeas(mockIdeas);

  console.log("creating author relationships");
  await createAuthors(users, posts, ideas);

  console.log("creating reaction relationships");
  await createReactions(users, posts, ideas);

  console.log("creating follower relationships");
  await createFollowers(users);
}

main().then(() => process.exit(0));
