const mockUserService = {
  buildFollowStatusLoader: jest.fn(),
  loadProfile: jest.fn(),
  updateProfile: jest.fn(),
  updateProfileImage: jest.fn(),
  updateCoverImage: jest.fn(),
  followProfile: jest.fn(),
  unfollowProfile: jest.fn(),
  loadFollowStatus: jest.fn(),
  loadFollowerCount: jest.fn(),
  getFollowers: jest.fn(),
};

module.exports = {
  UserService: jest.fn().mockImplementation(() => mockUserService),
  ...mockUserService,
};
