const mockAuthService = {
  getUser: jest.fn(),
  login: jest.fn(),
  register: jest.fn(),
  updateEmail: jest.fn(),
  updatePhone: jest.fn(),
  logout: jest.fn(),
  refreshToken: jest.fn(),
  resetPassword: jest.fn(),
  verifyEmail: jest.fn(),
  verifyPhone: jest.fn(),
  deactivateAccount: jest.fn(),
};

module.exports = {
  AuthService: jest.fn().mockImplementation(() => mockAuthService),
  ...mockAuthService,
};
