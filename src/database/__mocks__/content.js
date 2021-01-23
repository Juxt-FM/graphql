const mockPost = {
  id: "1",
  label: "post",
  author: "1",
  publicationStatus: "public",
  contentFormat: "markdown",
  title: "post title",
  summary: "post summary",
  imageURL: "https://127.0.0.1/image",
  content: "some content",
  created: new Date(),
  updated: new Date(),
};

const mockIdea = {
  id: "1",
  label: "idea",
  author: "1",
  message: "some content",
  created: new Date(),
  updated: new Date(),
};

const mockReaction = {
  id: "1",
  from: "2",
  to: "3",
  reaction: "like",
  timestamp: new Date(),
};

module.exports = { mockPost, mockIdea, mockReaction };
