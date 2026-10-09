import { currentPrice, suggestedPrice } from "./priceCalculator";

export const subject = {
  street: "8110 N 10th St",
  cityStateZip: "Tampa, FL 33604",
  beds: 3,
  baths: 2,
  units: 1,
  yearBuilt: 1997,
  lotSqft: 6250,
  sqft: 1774,
  // Seminole Heights, Tampa 33604
  lat: 28.0137,
  lng: -82.4592,
  listDate: "07/30/2026",
  seller: "Shoshana Rosenberg",
};

export const address = `${subject.street}, ${subject.cityStateZip}`;

export const suggestion = {
  newPrice: suggestedPrice,
  reductionAmount: currentPrice - suggestedPrice,
  why: [
    "On market 45 days vs. 30-day Tampa average",
    "Showings down 60% over the last two weeks",
    "Tampa comps down 3% in 30 days; 3 nearby sales within 2% of $412K",
    "Holding cost about $120 a day",
  ],
  projectedDays: 12,
};

export const advisory = [
  { label: "Current list price", value: "$435,000", falling: true },
  { label: "Last price reduction", value: "08/31/2026" },
  { label: "Price reduction amt", value: "$25,000 / 5.4%" },
  { label: "Original list price", value: "$460,000" },
  { label: "DOM", value: "45 days" },
  { label: "Showings, last 2 weeks", value: "4 (down 60%)" },
  { label: "Available inventory", value: "2.1 months" },
];

export const historyMetrics = [
  { value: "12 days", label: "Days since last reduction", alert: true },
  { value: "No", label: "Active price reduction request" },
  { value: "-3%", label: "BPO comp list $ change" },
];

export const priceHistory = {
  days: 45,
  reductionDay: 33,
  originalPrice: 460000,
  currentPrice,
  yMin: 400000,
  yMax: 470000,
  yStep: 10000,
};

// Comps ---------------------------------------------------------------------

export type CompStatus = "Sold" | "Listed";
export type HistoryStatus = "Sold" | "Pending" | "Under contract" | "Listed";

export type HistoryEntry = {
  date: string;
  status: HistoryStatus;
  price: number;
  reductionAmount: number;
  reductionPercent: number;
  pendingDate?: string;
};

export type Comp = {
  id: number;
  street: string;
  cityStateZip: string;
  status: CompStatus;
  distanceMi: number;
  lat: number;
  lng: number;
  hasChanges: boolean;
  units: number;
  beds: number;
  baths: number;
  sqft: number;
  year: number;
  lotSqft: number;
  pool: boolean;
  listDate: string;
  listPrice: number;
  soldDate?: string;
  soldPrice?: number;
  dom: number;
  history: HistoryEntry[];
};

const referenceDate = "09/11/2026";
const parseDate = (d: string) => {
  const [m, day, y] = d.split("/").map(Number);
  return Date.UTC(y, m - 1, day);
};
const formatDate = (ms: number) => {
  const d = new Date(ms);
  return `${String(d.getUTCMonth() + 1).padStart(2, "0")}/${String(d.getUTCDate()).padStart(2, "0")}/${d.getUTCFullYear()}`;
};
const dayMs = 24 * 60 * 60 * 1000;
const daysBetween = (from: string, to: string) => Math.round((parseDate(to) - parseDate(from)) / dayMs);

// Weekly entries, newest first, ending on `latest`
function buildHistory(latest: string, statuses: HistoryStatus[], prices: number[]): HistoryEntry[] {
  const dates = statuses.map((_, i) => formatDate(parseDate(latest) - i * 7 * dayMs));
  return statuses.map((status, i) => {
    const older = prices[i + 1];
    const reductionAmount = older === undefined ? 0 : Math.max(0, older - prices[i]);
    const reductionPercent = older === undefined ? 0 : Math.round((reductionAmount / older) * 10000) / 100;
    const underContractIdx = statuses.indexOf("Under contract");
    return {
      date: dates[i],
      status,
      price: prices[i],
      reductionAmount,
      reductionPercent,
      pendingDate: status === "Sold" && underContractIdx >= 0 ? dates[underContractIdx] : undefined,
    };
  });
}

const soldStatuses: HistoryStatus[] = ["Sold", "Pending", "Under contract", "Listed", "Listed", "Listed", "Listed"];
const listedStatuses: HistoryStatus[] = ["Listed", "Listed", "Listed", "Listed", "Listed", "Listed", "Listed"];

// Offset a point by distance (miles) and compass bearing (degrees)
function offset(distanceMi: number, bearing: number) {
  const rad = (bearing * Math.PI) / 180;
  const lat = subject.lat + (distanceMi * Math.cos(rad)) / 69;
  const lng = subject.lng + (distanceMi * Math.sin(rad)) / (69 * Math.cos((subject.lat * Math.PI) / 180));
  return { lat, lng };
}

type CompInput = Omit<Comp, "lat" | "lng" | "listDate" | "listPrice" | "soldDate" | "dom" | "history"> & {
  bearing: number;
  latest: string;
  prices: number[];
};

function makeComp({ bearing, latest, prices, ...c }: CompInput): Comp {
  const history = buildHistory(latest, c.status === "Sold" ? soldStatuses : listedStatuses, prices);
  const oldest = history[history.length - 1];
  const newest = history[0];
  const soldDate = c.status === "Sold" ? newest.date : undefined;
  return {
    ...c,
    ...offset(c.distanceMi, bearing),
    listDate: oldest.date,
    listPrice: oldest.price,
    soldDate,
    dom: daysBetween(oldest.date, soldDate ?? referenceDate),
    history,
  };
}

export const comps: Comp[] = [
  makeComp({
    id: 1, street: "8204 N 11th St", cityStateZip: "Tampa, FL 33604", status: "Sold", distanceMi: 0.2, bearing: 30,
    hasChanges: false, units: 1, beds: 3, baths: 2, sqft: 1760, year: 1995, lotSqft: 6100, pool: false,
    soldPrice: 409500, latest: "08/21/2026", prices: [409500, 409500, 412000, 415000, 415000, 415000, 415000],
  }),
  makeComp({
    id: 2, street: "8031 N Florida Ave", cityStateZip: "Tampa, FL 33604", status: "Listed", distanceMi: 0.3, bearing: 280,
    hasChanges: true, units: 1, beds: 3, baths: 2, sqft: 1812, year: 1999, lotSqft: 6400, pool: true,
    latest: "08/28/2026", prices: [427500, 427500, 427500, 435000, 435000, 435000, 435000],
  }),
  makeComp({
    id: 3, street: "8317 N 9th St", cityStateZip: "Tampa, FL 33604", status: "Sold", distanceMi: 0.3, bearing: 150,
    hasChanges: false, units: 1, beds: 3, baths: 2, sqft: 1745, year: 1992, lotSqft: 6000, pool: false,
    soldPrice: 404000, latest: "08/14/2026", prices: [404000, 404000, 408000, 408000, 415000, 415000, 415000],
  }),
  makeComp({
    id: 4, street: "7924 N Highland Ave", cityStateZip: "Tampa, FL 33604", status: "Listed", distanceMi: 0.4, bearing: 80,
    hasChanges: true, units: 1, beds: 4, baths: 2, sqft: 1890, year: 2001, lotSqft: 6600, pool: false,
    latest: "08/28/2026", prices: [419000, 419000, 425000, 425000, 425000, 429000, 429000],
  }),
  makeComp({
    id: 5, street: "8402 N Boulevard", cityStateZip: "Tampa, FL 33604", status: "Sold", distanceMi: 0.5, bearing: 250,
    hasChanges: false, units: 1, beds: 3, baths: 2, sqft: 1790, year: 1998, lotSqft: 6250, pool: true,
    soldPrice: 414000, latest: "08/28/2026", prices: [414000, 414000, 414000, 419000, 419000, 419000, 419000],
  }),
  makeComp({
    id: 6, street: "7811 N Central Ave", cityStateZip: "Tampa, FL 33604", status: "Listed", distanceMi: 0.6, bearing: 300,
    hasChanges: false, units: 1, beds: 3, baths: 2, sqft: 1836, year: 2003, lotSqft: 6800, pool: false,
    latest: "08/21/2026", prices: [439000, 439000, 439000, 439000, 439000, 439000, 439000],
  }),
];

export const defaultCompId = 2;
