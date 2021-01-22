const mockContentService = {
  buildReactionLoader: jest.fn(),
  getByID: jest.fn(),
  getByAuthor: jest.fn(),
  getReplies: jest.fn(),
  createPost: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn(),
  createIdea: jest.fn(),
  updateIdea: jest.fn(),
  deleteIdea: jest.fn(),
  createReaction: jest.fn(),
  deleteReaction: jest.fn(),
  reportContent: jest.fn(),
  loadReaction: jest.fn(),
  loadReplyCount: jest.fn(),
  loadReactionCount: jest.fn(),
  getReactions: jest.fn(),
};

module.exports = {
  ContentService: jest.fn().mockImplementation(() => mockContentService),
  ...mockContentService,
};
