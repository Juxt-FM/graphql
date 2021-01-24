const mockCompany = {
  id: "1",
  label: "company",
  symbol: "MMM",
  companyName: "3M Co.",
  exchange: "NEW YORK STOCK EXCHANGE, INC.",
  website: "https://www.3mindia.in/",
  description: "",
  CEO: "George Buckley",
  securityName: "3M Co.",
  issueType: "cs",
  primarySicCode: 3841,
  employees: null,
  address: "3M Center",
  address2: "Bldg. 220-13E-26A",
  state: "Minnesota",
  city: "Saint paul",
  zip: "55144-1000",
  country: "US",
  phone: "16517331474",
};

const mockList = {
  id: "1",
  label: "list",
  name: "some name",
  created: new Date(),
  updated: new Date(),
};

const mockSector = {
  id: "1",
  label: "business_sector",
  name: "Technology",
};

const mockIndustry = {
  id: "1",
  label: "business_industry",
  name: "Financial Services",
};

module.exports = { mockCompany, mockList, mockSector, mockIndustry };
