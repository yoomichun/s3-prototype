export type PropertyStatus = "On Market" | "Pre-Listing" | "Under Contract";

export type Property = {
  street: string;
  cityStateZip: string;
  market: string;
  currentState: string;
  status: PropertyStatus;
  needsAttention?: boolean;
};

export const properties: Property[] = [
  { street: "8110 N 10th St", cityStateZip: "Tampa, FL 33604", market: "Tampa", currentState: "Price Reduction", status: "On Market", needsAttention: true },
  { street: "107 W Woodlawn Ave", cityStateZip: "Tallahassee, FL 32304", market: "Tallahassee", currentState: "Offer", status: "On Market" },
  { street: "4752 Lark Ridge Cir", cityStateZip: "Orlando, FL 32835", market: "Orlando", currentState: "Price Reduction", status: "On Market" },
  { street: "3819 Shane Ct", cityStateZip: "Ellenwood, GA 30294", market: "Atlanta", currentState: "Offer", status: "On Market" },
  { street: "10551 Standing Stone Dr", cityStateZip: "Tallahassee, FL 32317", market: "Tallahassee", currentState: "Listing Price", status: "Pre-Listing" },
  { street: "4011 Hanover Dr", cityStateZip: "Ellenwood, GA 30294", market: "Atlanta", currentState: "Make-Ready Work", status: "Pre-Listing", needsAttention: true },
  { street: "2216 Peachtree Way", cityStateZip: "Marietta, GA 30060", market: "Atlanta", currentState: "Price Reduction", status: "On Market" },
  { street: "915 Bayshore Ln", cityStateZip: "Tampa, FL 33611", market: "Tampa", currentState: "Listing Price", status: "Pre-Listing" },
  { street: "6034 Pine Hollow Rd", cityStateZip: "Orlando, FL 32808", market: "Orlando", currentState: "Review PSA", status: "Under Contract" },
  { street: "1428 Magnolia Ave", cityStateZip: "Tallahassee, FL 32303", market: "Tallahassee", currentState: "Price Reduction", status: "On Market" },
];
