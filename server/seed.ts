import { storage } from "./storage";
import type { InsertDeal } from "@shared/schema";

const SAMPLE_DEALS: InsertDeal[] = [
  {
    address: "2011 Windsor Cir, Duarte, CA 91010",
    specs: "Single Family Residential / 3 Br / 0 Ba / 0 Gar / 1981 / 1,654 ft² / 2,396 ft² / Pool:N/A",
    price: "$500,000",
    propensity: ["Notice of Default (NOD)", "Tax Delinquency"],
    source: "Off Market",
    type: "hot",
    statusPercent: "0%",
    status: "None",
    lastOpen: "11/26/25",
    lastCalled: "11/26/25",
  },
  {
    address: "2842 Rosarita St, San Bernardino, CA 92407",
    specs: "Single Family Residential / 3 Br / 2 Ba / 1 Gar / 1990 / 1,169 ft² / 7,362 ft² / Pool:N/A",
    price: "$390,000",
    propensity: ["Long Term Owner (20+ Yrs)", "Corporate / Trust Owned"],
    source: "Off Market",
    type: "hot",
    statusPercent: "30%",
    status: "Offer Terms Sent",
    lastOpen: "11/26/25",
    lastCalled: "11/21/25",
  },
  {
    address: "8832 Elm Street, Rancho Cucamonga, CA 91730",
    specs: "Single Family / 4 Br / 2 Ba / 2 Gar / 1975 / 2,100 ft² / 8,500 ft²",
    price: "$620,000",
    propensity: ["Notice of Trustee Sale (NTS)", "Vacant Property"],
    source: "MLS",
    type: "hot",
    statusPercent: "10%",
    status: "Initial Contact Started",
    lastOpen: "11/27/25",
    lastCalled: "11/26/25",
  },
  {
    address: "1245 Oak Avenue, Ontario, CA 91764",
    specs: "Single Family / 3 Br / 1 Ba / 1 Gar / 1955 / 1,200 ft² / 6,000 ft²",
    price: "$450,000",
    propensity: ["Affidavit of Death", "High Equity (>50%)"],
    source: "Wholesaler",
    type: "warm",
    statusPercent: "20%",
    status: "Continue to Follow",
    lastOpen: "11/25/25",
    lastCalled: "11/20/25",
  },
  {
    address: "40591 Chantemar Way, Temecula, CA 92591",
    specs: "Single Family Residential / 5 Br / 3 Ba / 1 Gar / 2000 / 2,558 ft² / 6,098 ft² / Pool:N/A",
    price: "$580,000",
    propensity: ["Expired Listing", "High Mortgage / Debt"],
    source: "Off Market",
    type: "warm",
    statusPercent: "30%",
    status: "Offer Terms Sent",
    lastOpen: "11/26/25",
    lastCalled: "11/18/25",
  },
  {
    address: "10573 Larch, Bloomington, CA 92316",
    specs: "Single Family / 2 Br / 1 Ba / 4 Gar / 1940 / 1,951 ft² / 36,600 ft² / Pool:None",
    price: "$975,000",
    propensity: ["Involuntary Liens", "Non-Owner Occupied"],
    source: "MLS",
    type: "cold",
    statusPercent: "10%",
    status: "Initial Contact Started",
    lastOpen: "11/25/25",
    lastCalled: "11/24/25",
  },
  {
    address: "7721 Magnolia Ave, Riverside, CA 92504",
    specs: "Multi-Family / 6 Units / 1980 / 4,500 ft² / 12,000 ft²",
    price: "$1,200,000",
    propensity: ["Owns Multiple Properties", "Free & Clear"],
    source: "Off Market",
    type: "cold",
    statusPercent: "0%",
    status: "None",
    lastOpen: "11/22/25",
    lastCalled: "11/15/25",
  },
  {
    address: "420 Robinson, Bakersfield, CA 93305",
    specs: "Single Family / 3 Br / 1 Ba / 0 Gar / 1959 / 1,013 ft² / 4,621 ft² / Pool:None",
    price: "$75,000",
    propensity: [],
    source: "MLS",
    type: "new",
    statusPercent: "0%",
    status: "None",
    lastOpen: "11/26/25",
    lastCalled: "N/A",
  },
  {
    address: "230 W Knepp Avenue, Fullerton, CA 92832",
    specs: "Other (L) / 8 Br / 4 Ba / 4 Gar / 1958 / 3,752 ft² / 6,534 ft² / Pool:None",
    price: "$1,599,000",
    propensity: ["Transferred in Last 2 Years"],
    source: "MLS",
    type: "new",
    statusPercent: "0%",
    status: "None",
    lastOpen: "11/27/25",
    lastCalled: "N/A",
  },
  {
    address: "15620 Ramona Rd, Apple Valley, CA 92307",
    specs: "Single Family Residential / 4 Br / 3 Ba / 2 Gar / 1980 / 2,134 ft² / 43,473 ft² / Pool:N/A",
    price: "$375,000",
    propensity: ["Cash Buyer"],
    source: "Off Market",
    type: "new",
    statusPercent: "0%",
    status: "None",
    lastOpen: "11/27/25",
    lastCalled: "N/A",
  }
];

async function seed() {
  console.log("Starting database seed...");
  
  try {
    const existingDeals = await storage.getAllDeals();
    if (existingDeals.length > 0) {
      console.log(`Database already has ${existingDeals.length} deals. Skipping seed.`);
      return;
    }

    for (const deal of SAMPLE_DEALS) {
      await storage.createDeal(deal);
    }
    
    console.log(`Successfully seeded ${SAMPLE_DEALS.length} deals!`);
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

seed();
