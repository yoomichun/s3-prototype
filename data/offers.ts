import type { Message } from "./messages";

// Sample data for the offer workflow. Everything is made up.
//
// Dates are all computed from SAMPLE_TODAY so they stay close to "today". Change that one date to move the whole
// workflow forward. Figures that depend on each other (percentages, net amounts, down payment, EMD) are calculated
// from the price and list price rather than typed in, so they stay consistent.

export const SAMPLE_TODAY = new Date(2026, 9, 21); // Oct 21, 2026

function dayOffset(days: number) {
  const d = new Date(SAMPLE_TODAY);
  d.setDate(d.getDate() + days);
  return d;
}

/** Short date used in tables, for example 10/20/26 */
export function shortDate(days: number) {
  const d = dayOffset(days);
  return `${d.getMonth() + 1}/${d.getDate()}/${String(d.getFullYear()).slice(2)}`;
}

/** Long date used on the details page, for example 10/20/2026 */
export function longDate(days: number) {
  const d = dayOffset(days);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

export const money = (n: number) => `${n < 0 ? "-" : ""}$${Math.abs(Math.round(n)).toLocaleString("en-US")}`;
const percent = (n: number) => `${n > 0 ? "+" : ""}${n.toFixed(1)}%`;

export type OfferStatus = "New" | "Buyer Declined" | "Seller Declined" | "Seller Accepted" | "Seller Negotiated";

/** Offers that still need a decision */
export const isOpen = (s: OfferStatus) => s === "New" || s === "Seller Negotiated";

export type Offer = {
  number: string;
  price: number;
  status: OfferStatus;
  /** Days from today, so negative means in the past */
  offeredDaysAgo: number;
  validForDays: number;
};

export type OfferProperty = {
  slug: string;
  seller: string;
  street: string;
  cityStateZip: string;
  listPrice: number;
  /** Original list price before the reduction, when there was one */
  originalListPrice?: number;
  reducedOnDaysAgo?: number;
  daysOnMarket: number;
  offers: Offer[];
};

export const offerProperties: OfferProperty[] = [
  {
    slug: "3819-shane-ct",
    seller: "Dana Whitaker",
    street: "3819 Shane Ct",
    cityStateZip: "Ellenwood, GA 30294",
    listPrice: 389900,
    daysOnMarket: 9,
    offers: [
      { number: "112358132", price: 385000, status: "New", offeredDaysAgo: 1, validForDays: 7 },
      { number: "213455891", price: 372500, status: "New", offeredDaysAgo: 2, validForDays: 7 },
      { number: "314159265", price: 359000, status: "Buyer Declined", offeredDaysAgo: 4, validForDays: 7 },
    ],
  },
  {
    slug: "330-meadowbrook-lane",
    seller: "Rachel Donovan",
    street: "330 Meadowbrook Lane",
    cityStateZip: "Tallahassee, FL 32304",
    listPrice: 446000,
    originalListPrice: 452000,
    reducedOnDaysAgo: 2,
    daysOnMarket: 4,
    offers: [
      { number: "123456789", price: 440000, status: "New", offeredDaysAgo: 1, validForDays: 7 },
      { number: "234567890", price: 418500, status: "Buyer Declined", offeredDaysAgo: 3, validForDays: 7 },
      { number: "345678901", price: 425000, status: "Seller Declined", offeredDaysAgo: 3, validForDays: 7 },
      { number: "456789012", price: 432980, status: "Seller Accepted", offeredDaysAgo: 2, validForDays: 7 },
      { number: "567890123", price: 411000, status: "Buyer Declined", offeredDaysAgo: 2, validForDays: 7 },
      { number: "678901234", price: 442000, status: "Seller Negotiated", offeredDaysAgo: 1, validForDays: 7 },
    ],
  },
  {
    slug: "2301-oxford-road",
    seller: "Tom Alvarez",
    street: "2301 Oxford Road",
    cityStateZip: "Tallahassee, FL 32304",
    listPrice: 312000,
    daysOnMarket: 12,
    offers: [{ number: "421976543", price: 301500, status: "New", offeredDaysAgo: 0, validForDays: 7 }],
  },
  {
    slug: "3700-s-nashville-ave",
    seller: "Priya Raman",
    street: "3700 S Nashville Ave",
    cityStateZip: "Orlando, FL 32806",
    listPrice: 355000,
    daysOnMarket: 21,
    offers: [{ number: "558201947", price: 331000, status: "Seller Declined", offeredDaysAgo: 5, validForDays: 7 }],
  },
  {
    slug: "403-fairbanks-drive",
    seller: "Gil Ferreira",
    street: "403 Fairbanks Drive",
    cityStateZip: "Tallahassee, FL 32304",
    listPrice: 289000,
    daysOnMarket: 16,
    offers: [{ number: "667310482", price: 276500, status: "Buyer Declined", offeredDaysAgo: 6, validForDays: 7 }],
  },
];

export const allOffers = offerProperties.flatMap((p) => p.offers.map((o) => ({ property: p, offer: o })));

export function findOffer(number: string) {
  return allOffers.find((x) => x.offer.number === number);
}

export const newOffersByProperty = offerProperties
  .map((p) => ({ property: p, count: p.offers.filter((o) => o.status === "New").length }))
  .filter((x) => x.count > 0);

export const newOfferCount = newOffersByProperty.reduce((sum, x) => sum + x.count, 0);

/** Offer price as a share of list price, in percent. 100 means the offer matches the list price. */
export const offerToListPct = (price: number, list: number) => (price / list - 1) * 100;

/** An offer at or above 98% of list price counts as strong. */
export const isStrongOffer = (price: number, list: number) => price / list >= 0.98;

// ---------------------------------------------------------------------------------------------------------------
// Offer terms

export type ChangedTerm = { was: string };

export type OfferTerms = {
  buyerSigningEntity: string;
  buyerName: string;
  buyerType: string;
  buyerAgentCommissionPct: number;
  buyerAgentCommission: number;
  offerPrice: number;
  offerDate: string;
  sellerPaidClosingCosts: number;
  offerExpirationDate: string;
  dualAgency: string;
  homeWarranty: number;
  otherCostsLabel: string;
  otherCost: number;
  downPaymentPct: number;
  downPayment: number;
  loanAmount: number;
  payTitlePolicy: string;
  paySurvey: string;
  offerToListLabel: string;
  netOfferAmount: number;
  netOfferToListLabel: string;
  buyerPreApprovedUpTo: number;
  emdAmount: number;
  daysToEmd: string;
  additionalEmdAmount: number;
  daysToAdditionalEmd: string;
  titleCompany: string;
  titleCompanyEmail: string;
  estimatedCloseOfEscrow: string;
  optionFee: string;
  contingencies: {
    financing: { applies: string; expires: string };
    inspection: { applies: string; days: string };
    appraisal: { applies: string; expires: string };
    financingType: string;
  };
  documents: { name: string; type: string; uploaded: string }[];
  /** Terms the seller changed in a counter, with the buyer's original value */
  changed: Partial<Record<"offerPrice" | "offerToList" | "homeWarranty" | "additionalEmd", ChangedTerm>>;
};

type TermInputs = {
  price: number;
  listPrice: number;
  offeredDaysAgo: number;
  validForDays: number;
  homeWarranty: number;
  additionalEmd: number;
  buyer: { entity: string; name: string; type: string };
  changed?: OfferTerms["changed"];
};

const TERMITE_BOND = 500;
const OTHER_SELLER_COSTS = 1330; // other seller paid closing costs on top of the warranty and termite bond

export function buildTerms(i: TermInputs): OfferTerms {
  const sellerPaidClosingCosts = i.homeWarranty + TERMITE_BOND + OTHER_SELLER_COSTS;
  const netOfferAmount = i.price - sellerPaidClosingCosts;
  const downPaymentPct = 20;
  const downPayment = Math.round((i.price * downPaymentPct) / 100);
  const loanAmount = i.price - downPayment;
  const emdAmount = Math.round(i.price * 0.01);
  const emdDays = 3;
  const additionalEmdDays = 10;
  const inspectionDays = 10;
  const offerDay = -i.offeredDaysAgo;

  return {
    buyerSigningEntity: i.buyer.entity,
    buyerName: i.buyer.name,
    buyerType: i.buyer.type,
    buyerAgentCommissionPct: 2.45,
    buyerAgentCommission: Math.round(i.price * 0.0245),
    offerPrice: i.price,
    offerDate: longDate(offerDay),
    sellerPaidClosingCosts,
    offerExpirationDate: longDate(offerDay + i.validForDays),
    dualAgency: "Yes",
    homeWarranty: i.homeWarranty,
    otherCostsLabel: "Termite Bond",
    otherCost: TERMITE_BOND,
    downPaymentPct,
    downPayment,
    loanAmount,
    payTitlePolicy: "Split by Buyer and Seller",
    paySurvey: "Buyer",
    offerToListLabel: percent(offerToListPct(i.price, i.listPrice)),
    netOfferAmount,
    netOfferToListLabel: percent(offerToListPct(netOfferAmount, i.listPrice)),
    // Pre-approval covers the loan with a cushion, rounded up to the nearest $10,000
    buyerPreApprovedUpTo: Math.ceil((loanAmount * 1.05) / 10000) * 10000,
    emdAmount,
    daysToEmd: `${emdDays} days (${longDate(offerDay + emdDays)})`,
    additionalEmdAmount: i.additionalEmd,
    daysToAdditionalEmd: `${additionalEmdDays} days (${longDate(offerDay + additionalEmdDays)})`,
    titleCompany: "Capital City Title",
    titleCompanyEmail: "closing@capitalcitytitle.example.com",
    estimatedCloseOfEscrow: longDate(offerDay + 35),
    optionFee: "No",
    contingencies: {
      financing: { applies: "Yes", expires: longDate(offerDay + 21) },
      inspection: { applies: "Yes", days: `${inspectionDays} days (${longDate(offerDay + inspectionDays)})` },
      appraisal: { applies: "Yes", expires: longDate(offerDay + 17) },
      financingType: "Conventional, 20% down",
    },
    documents: [
      { name: "TransactionDocuments1.pdf", type: "Proof of Funds", uploaded: longDate(offerDay) },
      { name: "TransactionDocuments2.pdf", type: "Pre-Approval Letter", uploaded: longDate(offerDay) },
      { name: "TransactionDocuments3.pdf", type: "Buyer Signed PSA", uploaded: longDate(offerDay + 1) },
    ],
    changed: i.changed ?? {},
  };
}

const defaultBuyer = { entity: "Buyer Twenty", name: "Christopher Gaudet", type: "Institution" };

export function termsFor(property: OfferProperty, offer: Offer): OfferTerms {
  if (offer.status === "Seller Negotiated") {
    // The buyer first offered $438,000, asked the seller to pay a $600 home warranty, and put $1,000 down as additional EMD.
    // The seller countered on price, split the warranty and asked for more additional EMD.
    const wasPrice = 438000;
    return buildTerms({
      price: offer.price,
      listPrice: property.listPrice,
      offeredDaysAgo: offer.offeredDaysAgo,
      validForDays: offer.validForDays,
      homeWarranty: 300,
      additionalEmd: 1500,
      buyer: { entity: "O'Maley Family Trust", name: "Sean O'Maley", type: "Retail" },
      changed: {
        offerPrice: { was: money(wasPrice) },
        offerToList: { was: percent(offerToListPct(wasPrice, property.listPrice)) },
        homeWarranty: { was: money(600) },
        additionalEmd: { was: money(1000) },
      },
    });
  }
  return buildTerms({
    price: offer.price,
    listPrice: property.listPrice,
    offeredDaysAgo: offer.offeredDaysAgo,
    validForDays: offer.validForDays,
    homeWarranty: 600,
    additionalEmd: 2000,
    buyer: defaultBuyer,
  });
}

// ---------------------------------------------------------------------------------------------------------------
// Advice shown in the right panel card

export type OfferAdvice = {
  headline: string;
  summary: string;
  strengthsTitle: string;
  strengths: string[];
  negotiateTitle: string;
  negotiate: string[];
  /** Questions the suggestion chips ask, with the answers they get */
  answers: Record<string, string>;
};

export function adviceFor(property: OfferProperty, offer: Offer): OfferAdvice {
  const terms = termsFor(property, offer);
  const list = property.listPrice;
  const pct = Math.abs(offerToListPct(offer.price, list)).toFixed(1);

  if (offer.status === "Seller Negotiated") {
    return {
      headline: "A fair counter, worth accepting",
      summary: `The seller changed three terms. The ${money(terms.offerPrice)} price is ${pct}% under list.`,
      strengthsTitle: "What changed",
      negotiateTitle: "What I would do",
      strengths: [
        `Price: ${terms.changed.offerPrice?.was} to ${money(terms.offerPrice)}`,
        `Warranty: seller pays ${money(terms.homeWarranty)} of ${terms.changed.homeWarranty?.was}`,
        `Additional EMD: ${terms.changed.additionalEmd?.was} to ${money(terms.additionalEmdAmount)}`,
      ],
      negotiate: [
        `Accept: only ${money(list - offer.price)} under list`,
        `Take the warranty split as offered`,
      ],
      answers: {
        "Show what changed": `The seller changed the price (${terms.changed.offerPrice?.was} to ${money(terms.offerPrice)}), the home warranty (${terms.changed.homeWarranty?.was} to ${money(terms.homeWarranty)}) and the additional EMD (${terms.changed.additionalEmd?.was} to ${money(terms.additionalEmdAmount)}).`,
        "Should I accept the counter?": `Yes, I would. The ${money(terms.offerPrice)} price is ${pct}% under list, and the only give is a ${money(Number(terms.changed.homeWarranty?.was.replace(/\D/g, "")) - terms.homeWarranty)} warranty split.`,
        "Review closing cost": `Seller paid closing costs are ${money(terms.sellerPaidClosingCosts)}: ${money(terms.homeWarranty)} home warranty, ${money(terms.otherCost)} termite bond and ${money(terms.sellerPaidClosingCosts - terms.homeWarranty - terms.otherCost)} in other closing costs. The net offer is ${money(terms.netOfferAmount)}.`,
      },
    };
  }

  return {
    headline: "A strong offer worth a counter",
    summary: `A good offer, but I would negotiate two terms first.`,
    strengthsTitle: "Why it works",
    negotiateTitle: "What I would negotiate",
    strengths: [
      `${pct}% under list (${money(offer.price)})`,
      `${terms.downPaymentPct}% down, pre-approved to ${money(terms.buyerPreApprovedUpTo)}`,
      `${money(terms.emdAmount)} earnest money (1%)`,
    ],
    negotiate: [
      `Buyer covers the ${money(terms.homeWarranty)} home warranty`,
      `Shorten inspection from 10 to 7 days`,
    ],
    answers: {
      "Recommend to accept the offer as is": `Not quite as is. It is strong at ${pct}% under list, but I would counter on the home warranty and the 10 day inspection window first.`,
      "Review closing cost": `Seller paid closing costs are ${money(terms.sellerPaidClosingCosts)}: ${money(terms.homeWarranty)} home warranty, ${money(terms.otherCost)} termite bond and ${money(terms.sellerPaidClosingCosts - terms.homeWarranty - terms.otherCost)} in other closing costs. That leaves a net of ${money(terms.netOfferAmount)}, ${terms.netOfferToListLabel.replace("-", "")} under list.`,
      "Review comps in the area": `Three comparable homes nearby sold within 2% of list in the last 30 days, which supports pricing at ${money(list)}. This offer is ${pct}% under list.`,
    },
  };
}

/** Questions for the offers list page */
export function listAnswers(): Record<string, string> {
  const open = allOffers.filter((x) => x.offer.status === "New");
  const ranked = [...open].sort((a, b) => offerToListPct(b.offer.price, b.property.listPrice) - offerToListPct(a.offer.price, a.property.listPrice));
  const line = (x: (typeof open)[number]) =>
    `${x.property.street}: ${money(x.offer.price)}, ${Math.abs(offerToListPct(x.offer.price, x.property.listPrice)).toFixed(1)}% under list`;
  return {
    "Show best open offers": `Your best open offers: ${ranked.slice(0, 3).map(line).join("; ")}.`,
    // Negotiable means 2% to 5% under list: close enough that a counter is likely to land
    "Show negotiable open offers": `These offers are close enough to counter: ${ranked
      .filter((x) => {
        const gap = offerToListPct(x.offer.price, x.property.listPrice);
        return gap < -2 && gap >= -5;
      })
      .map(line)
      .join("; ")}.`,
    "Show worst open offers": `Your lowest open offers: ${[...ranked].reverse().slice(0, 2).map(line).join("; ")}.`,
  };
}

// ---------------------------------------------------------------------------------------------------------------
// The conversation with the seller, shown in the Message tab of the right panel

export type OfferConversation = {
  contact: string;
  contactType: "Seller";
  property: string;
  summary: string;
  strengthsTitle: string;
  strengths: string[];
  negotiateTitle: string;
  negotiate: string[];
  /** Shown in the green banner */
  agreement: string;
  /** Shown in the yellow banner */
  next: string;
  /** Suggested actions. Clicking one writes its draft into the message box. */
  actions: { label: string; draft: string }[];
  /** Newest first */
  messages: Message[];
  sendLabel: string;
  /** A message built from the suggestions, written into the message box by "Create message with these suggestions" */
  draft: string;
};

const paddedDate = (days: number) => {
  const d = dayOffset(days);
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}/${d.getFullYear()}`;
};

export function conversationFor(property: OfferProperty, offer: Offer): OfferConversation {
  const advice = adviceFor(property, offer);
  const terms = termsFor(property, offer);
  const first = property.seller.split(" ")[0];
  const pct = Math.abs(offerToListPct(offer.price, property.listPrice)).toFixed(1);
  const negotiated = offer.status === "Seller Negotiated";

  const closingBreakdown = `seller paid closing costs are ${money(terms.sellerPaidClosingCosts)}: a ${money(terms.homeWarranty)} home warranty, a ${money(terms.otherCost)} termite bond and ${money(terms.sellerPaidClosingCosts - terms.homeWarranty - terms.otherCost)} in other closing costs. After those, the net offer is ${money(terms.netOfferAmount)}.`;

  const actions = negotiated
    ? [
        {
          label: "Recommend accepting the counter",
          draft: `Hi ${first}, the buyer's side accepted most of your counter. The price is ${money(terms.offerPrice)}, ${pct}% under list, and the only give is a ${money(terms.homeWarranty)} warranty split. I recommend we accept and move to contract. Does that work for you?`,
        },
        {
          label: "Explain what changed",
          draft: `Hi ${first}, here is what changed in the counter: the price moved from ${terms.changed.offerPrice?.was} to ${money(terms.offerPrice)}, the home warranty is now ${money(terms.homeWarranty)} (was ${terms.changed.homeWarranty?.was}), and the additional earnest money is ${money(terms.additionalEmdAmount)} (was ${terms.changed.additionalEmd?.was}).`,
        },
        { label: "Explain closing costs", draft: `Hi ${first}, ${closingBreakdown}` },
      ]
    : [
        {
          label: "Recommend a counter",
          draft: `Hi ${first}, we received an offer of ${money(offer.price)} on ${property.street}, ${money(property.listPrice - offer.price)} under list. The buyer has ${terms.downPaymentPct}% down and a pre-approval that covers the loan. I recommend we counter: ask the buyer to cover the ${money(terms.homeWarranty)} home warranty and shorten the inspection period from 10 days to 7. Does that work for you?`,
        },
        { label: "Explain closing costs", draft: `Hi ${first}, ${closingBreakdown}` },
        {
          label: "Share comps",
          draft: `Hi ${first}, three comparable homes nearby sold within 2% of list in the last 30 days, which supports holding firm near ${money(property.listPrice)}. This offer is ${pct}% under list.`,
        },
      ];

  const sellerFrom = {
    name: `${first} ${property.seller.split(" ")[1]?.charAt(0) ?? ""}.`,
    initials: first.charAt(0) + (property.seller.split(" ")[1]?.charAt(0) ?? ""),
    role: "Seller" as const,
    isMe: false,
  };
  const dmFrom = { name: "Yoomi C.", initials: "YC", role: "DM" as const, isMe: true };

  // Earlier history between the DM and the seller, newest first. The seller has not seen a new offer until the DM sends the recommendation.
  const hvacThread: Message[] = [
    {
      id: "h2",
      date: paddedDate(-1),
      time: "9:05 AM",
      from: dmFrom,
      body: `Hi ${first}, good news: the HVAC repair was completed yesterday. The tech replaced the capacitor and the system is cooling normally again. The invoice is in the property file.`,
    },
    {
      id: "h1",
      date: paddedDate(-2),
      time: "4:10 PM",
      from: sellerFrom,
      body: `Hi Yoomi, the HVAC system at ${property.street} is still blowing warm air. Can we get it fixed before more buyers tour?`,
    },
  ];

  const messages: Message[] = negotiated
    ? [
        {
          id: "o2",
          date: paddedDate(0),
          time: "9:42 AM",
          from: sellerFrom,
          body: `I countered at ${money(offer.price)} and offered to split the home warranty. Do you think the buyer will go for it?`,
        },
        ...hvacThread,
      ]
    : hvacThread;

  const bullets = (items: string[]) => items.map((item) => `• ${item}`).join("\n");
  const draft = `${
    negotiated
      ? `Hi ${first}, thanks for the counter at ${money(offer.price)}. Here is where we landed:`
      : `Hi ${first}, we received an offer of ${money(offer.price)} on ${property.street}, ${pct}% under list.`
  }\n\n${advice.strengthsTitle}:\n${bullets(advice.strengths)}\n\n${advice.negotiateTitle}:\n${bullets(advice.negotiate)}\n\nDoes that work for you?`;

  return {
    contact: property.seller,
    contactType: "Seller",
    property: `${property.street}, ${property.cityStateZip}`,
    summary: advice.summary,
    strengthsTitle: advice.strengthsTitle,
    strengths: advice.strengths,
    negotiateTitle: advice.negotiateTitle,
    negotiate: advice.negotiate,
    agreement: negotiated
      ? `Price agreed at ${money(offer.price)}, ${pct}% under list`
      : `Strong offer: ${pct}% under list with ${terms.downPaymentPct}% down`,
    next: negotiated ? "Accept the counter and move to contract" : "Counter on the home warranty and inspection window",
    actions,
    messages,
    sendLabel: "Send Recommendation to Seller",
    draft,
  };
}
