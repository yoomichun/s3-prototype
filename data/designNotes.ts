import type { TooltipProps } from "@mui/material/Tooltip";

export type DesignNote = {
  n: number;
  headline: string;
  text: string;
  placement?: TooltipProps["placement"];
};

export const designNotes = {
  "task-queue": {
    n: 1,
    headline: "The section DMs underestimated",
    text: "DMs expected this to be a minor feature. Session replays showed it became the most-used part of the portal: one consolidated checklist of urgent tasks instead of hunting across tools. That finding moved it to the top.",
  },
  "recommended-actions": {
    n: 2,
    headline: "AI that works before you ask",
    text: "Covers what a task list can't: patterns across the whole portfolio and urgent items that need a decision, not just a reminder. AI does the analysis and proposes the action. The DM approves it, and it moves into the task queue.",
  },
  "efficiency-metrics": {
    n: 3,
    headline: "How am I doing?",
    text: "Pulls underwriting and performance data we already had into one glanceable view, so DMs can see how they're tracking against peers without building reports.",
  },
  "properties-table": {
    n: 4,
    headline: "What users say vs. what they do",
    text: "DMs, used to Airtable, asked for a full-page table, and the first iteration gave it most of the page. Usage showed it was the least-used section. Some DMs still relied on it, so it stayed, shortened and moved to the bottom.",
  },
  "ask-tab": {
    n: 5,
    headline: "One assistant, every page",
    text: "DMs can ask anything from anywhere. It's context-aware: suggestions change with the page and property in view. Every question is also research, showing which needs the product doesn't cover yet and what to build next.",
    placement: "left-start",
  },
  "message-tab": {
    n: 6,
    headline: "From message board to advisor",
    text: "Messaging used to be a passive board between DMs, sellers, and agents. DMs can still message freely, but the panel now suggests next steps based on the property and conversation. AI suggestions are clearly separated from human messages.",
    placement: "left-start",
  },
  "price-reductions": {
    n: 7,
    headline: "Hours of manual math, automated",
    text: "Pricing used to mean pulling comps and running underwriting numbers by hand, property by property. Now the system weighs current comps, days on market, and holding costs to suggest reductions, each with a confidence level. High-confidence ones can be approved in one step.",
  },
  comps: {
    n: 8,
    headline: "Show the work",
    text: "Comps used to be gathered manually from sales around each property. Now they're pulled automatically, and the page shows the sources behind every suggestion. Research showed DMs needed confidence in valuations, and seeing the why builds that trust.",
  },
  calculator: {
    n: 9,
    headline: "AI suggests, you decide",
    text: "AI recommends $412,000, but the DM stays in control. Drag the price to see the trade-off live: net proceeds, days to sell, and holding costs. The suggested price sells about 35 days faster and saves $4,200 in holding costs, for $21,200 less in net proceeds.",
  },
} satisfies Record<string, DesignNote>;

export type NoteId = keyof typeof designNotes;
