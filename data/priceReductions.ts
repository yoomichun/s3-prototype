export type Confidence = "High" | "Medium" | "Low";

export type PriceReduction = {
  id: string;
  street: string;
  cityStateZip: string;
  listPrice: number;
  dom: number;
  suggestedPrice: number;
  reason: string;
  confidence: Confidence;
  // Not shown in the table. Drives the "Pending price reduction requests" filter chip (6 rows, matching its card).
  pending: boolean;
  href?: string;
};

// Row values come from Figma frame 71:131689, in its order (sorted by days on market).
export const priceReductions: PriceReduction[] = [
  { id: "8110", street: "8110 N 10th St", cityStateZip: "Tampa, FL 33604", listPrice: 435000, dom: 45, suggestedPrice: 412000, reason: "Tampa comps down 3%", confidence: "High", pending: false, href: "/price-reductions/8110-n-10th-st" },
  { id: "4752", street: "4752 Lark Ridge Cir", cityStateZip: "Orlando, FL 32835", listPrice: 289000, dom: 43, suggestedPrice: 274000, reason: "Showings down 60%", confidence: "High", pending: false },
  { id: "2216", street: "2216 Peachtree Way", cityStateZip: "Marietta, GA 30060", listPrice: 315000, dom: 41, suggestedPrice: 302000, reason: "2 nearby comps sold below list", confidence: "High", pending: false },
  { id: "1428", street: "1428 Magnolia Ave", cityStateZip: "Tallahassee, FL 32303", listPrice: 249000, dom: 38, suggestedPrice: 239000, reason: "No offers after 22 showings", confidence: "High", pending: false },
  { id: "3307", street: "3307 Cypress Bend Dr", cityStateZip: "Tampa, FL 33618", listPrice: 338000, dom: 36, suggestedPrice: 325000, reason: "Tampa comps down 3%", confidence: "Medium", pending: true },
  { id: "782", street: "782 Willow Creek Ln", cityStateZip: "Kissimmee, FL 34746", listPrice: 276000, dom: 34, suggestedPrice: 266000, reason: "Priced 4% above nearby comps", confidence: "Medium", pending: true },
  { id: "5120", street: "5120 Oak Shadow Ct", cityStateZip: "Decatur, GA 30035", listPrice: 229000, dom: 31, suggestedPrice: 221000, reason: "Showings down 40%", confidence: "Medium", pending: true },
  { id: "1945", street: "1945 Harbor View Dr", cityStateZip: "Tampa, FL 33611", listPrice: 362000, dom: 29, suggestedPrice: 352000, reason: "Tampa comps down 3%", confidence: "Medium", pending: true },
  { id: "640", street: "640 Sable Palm Way", cityStateZip: "Orlando, FL 32825", listPrice: 264000, dom: 27, suggestedPrice: 258000, reason: "Low online saves", confidence: "Medium", pending: true },
  { id: "2873", street: "2873 Red Hills Rd", cityStateZip: "Tallahassee, FL 32312", listPrice: 298000, dom: 24, suggestedPrice: 291000, reason: "Similar home listed lower nearby", confidence: "Low", pending: true },
  { id: "9210", street: "9210 Lake Forest Dr", cityStateZip: "Tampa, FL 33624", listPrice: 305000, dom: 19, suggestedPrice: 299000, reason: "Tampa comps down 3%", confidence: "Low", pending: false },
  { id: "1167", street: "1167 Dogwood Trl", cityStateZip: "Lithonia, GA 30058", listPrice: 218000, dom: 16, suggestedPrice: 214000, reason: "Showings slowing", confidence: "Low", pending: false },
];

export const formatUsd = (n: number) => `$${n.toLocaleString("en-US")}`;
