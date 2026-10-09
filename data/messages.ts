export type ContactType = "Seller" | "Agent" | "External";

export const contactTypes: ContactType[] = ["Seller", "Agent", "External"];

export const contacts: Record<ContactType, string[]> = {
  Seller: ["Shoshana Rosenberg"],
  Agent: [],
  External: [],
};

export const contactProperties: Record<string, string[]> = {
  "Shoshana Rosenberg": [
    "3819 Shane Ct, Ellenwood, GA 30294",
    "8110 N 10th St, Tampa, FL 33604",
    "107 W Woodlawn Ave, Tallahassee, FL 32304",
    "4752 Lark Ridge Cir, Orlando, FL 32835",
    "4011 Hanover Dr, Ellenwood, GA 30294",
    "10551 Standing Stone Dr, Tallahassee, FL 32317",
  ],
};

export type Message = {
  id: string;
  date: string;
  time: string;
  from: { name: string; initials: string; role: "DM" | "Seller"; isMe: boolean };
  body: string;
};

export const conversation = {
  contact: "Shoshana Rosenberg",
  contactType: "Seller" as ContactType,
  property: "8110 N 10th St, Tampa, FL 33604",
  summary:
    "Seller is hesitant about the recommended price reduction to $412K and has set $420K as her floor. The property has been on market 45 days against a 30-day Tampa average, with showings down 60%.",
  agreement: "Price reduction needed (both parties agree)",
  next: "Agree on new list price",
  suggestedActions: ["Share comps", "Propose $420K for two weeks", "Open price calculator"],
  // Newest first, as in the Figma log
  messages: [
    {
      id: "m2",
      date: "09/12/2026",
      time: "8:05 AM",
      from: { name: "Me", initials: "MW", role: "DM", isMe: true },
      body: "Hi Shoshana, fair question. The home has been listed 45 days versus about 30 for similar homes in Tampa, showings are down 60% over the last two weeks, and three nearby homes sold within 2% of $412K. Holding costs run about $120 a day. If you'd rather not go that low, we could reduce to $420K now and revisit in two weeks. Want me to set that up?",
    },
    {
      id: "m1",
      date: "09/11/2026",
      time: "9:11 AM",
      from: { name: "Shoshana R.", initials: "SR", role: "Seller", isMe: false },
      body: "I saw the price reduction recommendation. I'm not comfortable going below $420K. What's the reasoning behind the new number?",
    },
  ] satisfies Message[],
};

export const latestMessagePreview = "I'm not comfortable going below $420K...";
