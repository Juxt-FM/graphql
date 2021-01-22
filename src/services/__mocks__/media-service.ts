const mockMediaService = {
  getSignedProfileUpload: jest.fn(),
  getSignedCoverUpload: jest.fn(),
};

module.exports = {
  MediaService: jest.fn().mockImplementation(() => mockMediaService),
  ...mockMediaService,
};
