export type TaskTab = { label: string; count: number };

export const taskTabs: TaskTab[] = [
  { label: "Pre-listing tasks", count: 27 },
  { label: "On market tasks", count: 10 },
  { label: "Other tasks", count: 16 },
  { label: "BPO as a service", count: 16 },
];

export const activeTaskTab = "Pre-listing tasks";

export type TaskRow = { label: string; count: number };

export const onMarketTasks: TaskRow[] = [
  { label: "Listing agreement expiring", count: 2 },
  { label: "Offers", count: 2 },
  { label: "Overdue weekly listing reports", count: 2 },
  { label: "Price reduction", count: 2 },
  { label: "Review PSA", count: 2 },
];

// Listed column by column: the first five rows are the left column, the last five the right column.
export const preListingTasks: TaskRow[] = [
  { label: "Assign agents", count: 9 },
  { label: "List price", count: 3 },
  { label: "Make ready work", count: 12 },
  { label: "Order make ready work", count: 2 },
  { label: "Review BPO", count: 3 },
  { label: "Review listing agreement", count: 3 },
  { label: "Submit target disposition value", count: 3 },
  { label: "Upload fully executed listing agreement", count: 3 },
  { label: "Verify make ready work", count: 3 },
  { label: "Verify MLS listing", count: 3 },
];

export type RecommendedAction = {
  type: string;
  recommendation: string;
  impact: string;
  href?: string;
};

export const recommendedActions: RecommendedAction[] = [
  { type: "Price", recommendation: "12 suggested price reductions", impact: "Could save $14,200 in holding costs", href: "/price-reductions" },
  { type: "Listing", recommendation: "3 listings ready to go live early", impact: "Could list 5 days sooner" },
  { type: "Make-ready", recommendation: "4 make-ready items to skip", impact: "Could save $18,600 in repair costs" },
  { type: "Comps", recommendation: "Tampa comps down 3% in 30 days", impact: "Affects 8 of your listings" },
];

export type Comparison = {
  label: string;
  value: string;
  direction: "up" | "down";
  /** bold coloured lead word, e.g. "Higher" */
  lead: string;
  /** regular connector, e.g. "than" */
  connector: string;
  /** bold subject, e.g. "last week" */
  subject: string;
  subjectBold: boolean;
};

export type Metric = {
  id: string;
  title: string;
  icon: "home" | "dollar";
  value: string;
  select?: string;
  comparisons: Comparison[];
  yTicks: { value: number; label: string }[];
  xLabels: string[];
  benchmark: number;
  you: number[];
  others: number[];
};

const xLabels = ["5/31", "6/1", "6/2", "6/3", "6/4", "6/5", "6/6"];

export const metrics: Metric[] = [
  {
    id: "properties-per-status",
    title: "No. of properties per status",
    icon: "home",
    value: "15 properties",
    select: "Pre-Listing",
    comparisons: [
      { label: "Last week", value: "12 properties", direction: "up", lead: "Higher", connector: "than", subject: "last week", subjectBold: true },
      { label: "Target", value: "15 properties", direction: "up", lead: "On track", connector: "with", subject: "target", subjectBold: true },
      { label: "Other DMs", value: "14 properties", direction: "up", lead: "Higher", connector: "than", subject: "Other DMs", subjectBold: false },
    ],
    yTicks: [20, 15, 10, 5, 0].map((v) => ({ value: v, label: String(v) })),
    xLabels,
    // Mock series: benchmark is the target, series end on the headline values
    benchmark: 15,
    you: [12, 12, 13, 13, 14, 14, 15],
    others: [13, 14, 13, 14, 14, 13, 14],
  },
  {
    id: "sale-to-list",
    title: "Average sale price to list price",
    icon: "dollar",
    value: "96%",
    comparisons: [
      { label: "Last week", value: "95%", direction: "up", lead: "Higher", connector: "than", subject: "last week", subjectBold: true },
      { label: "Target", value: "98%", direction: "down", lead: "Lower", connector: "than", subject: "target", subjectBold: true },
      { label: "Other DMs", value: "97%", direction: "down", lead: "Lower", connector: "than", subject: "Other DMs", subjectBold: false },
    ],
    yTicks: [100, 98, 96, 94, 92, 90].map((v) => ({ value: v, label: `${v}%` })),
    xLabels,
    benchmark: 98,
    you: [95, 95, 95.5, 95, 95.5, 95.5, 96],
    others: [97, 96.5, 97, 97.5, 97, 97, 97],
  },
  {
    id: "days-on-market",
    title: "Average days on market",
    icon: "home",
    value: "38 days",
    comparisons: [
      { label: "Last week", value: "41 days", direction: "down", lead: "Lower", connector: "than", subject: "last week", subjectBold: true },
      { label: "Target", value: "35 days", direction: "down", lead: "Higher", connector: "than", subject: "target", subjectBold: true },
      { label: "Other DMs", value: "40 days", direction: "up", lead: "Lower", connector: "than", subject: "Other DMs", subjectBold: false },
    ],
    yTicks: [50, 40, 30, 20, 10, 0].map((v) => ({ value: v, label: String(v) })),
    xLabels,
    benchmark: 35,
    you: [42, 41, 41, 40, 39, 39, 38],
    others: [41, 40, 41, 40, 40, 40, 40],
  },
  {
    id: "offers-per-listing",
    title: "Offers per listing",
    icon: "dollar",
    value: "3.2 offers",
    comparisons: [
      { label: "Last week", value: "2.8 offers", direction: "up", lead: "Higher", connector: "than", subject: "last week", subjectBold: true },
      { label: "Target", value: "3.5 offers", direction: "down", lead: "Lower", connector: "than", subject: "target", subjectBold: true },
      { label: "Other DMs", value: "3.0 offers", direction: "up", lead: "Higher", connector: "than", subject: "Other DMs", subjectBold: false },
    ],
    yTicks: [5, 4, 3, 2, 1, 0].map((v) => ({ value: v, label: String(v) })),
    xLabels,
    benchmark: 3.5,
    you: [2.8, 2.9, 2.9, 3, 3.1, 3.1, 3.2],
    others: [3, 3, 3.1, 3, 3, 3, 3],
  },
];
