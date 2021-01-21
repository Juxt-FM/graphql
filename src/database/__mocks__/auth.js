const mockUser = {
  id: "1",
  profile: "2",
  email: "test@email.com",
  phone: "+11234567890",
  password: "fhsdjlfhasjfkhasjlfkjasdhfdasfhjdsaklfhadsjlkfasd",
  verified: true,
  created: new Date(),
  updated: new Date(),
};

const mockDeviceArgs = {
  id: "1",
  platform: "ios",
  model: "iPhone X",
  address: "192.0.1.03",
};

const mockDevice = {
  id: "1",
  identifier: "some_unique_identifier",
  platform: "ios",
  model: "iPhone X",
  address: "192.0.1.03",
  created: new Date(),
  updated: new Date(),
};

module.exports = {
  mockUser,
  mockDeviceArgs,
  mockDevice,
};
