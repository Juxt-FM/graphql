const mockNotificationService = {
  sendEmail: jest.fn(),
  sendSMS: jest.fn(),
};

module.exports = {
  NotificationService: jest
    .fn()
    .mockImplementation(() => mockNotificationService),
  ...mockNotificationService,
};
