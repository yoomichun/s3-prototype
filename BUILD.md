# S3 DM Portal Prototype: Build Spec

Portfolio prototype. The UI must match my Figma designs exactly. Do not invent colors, spacing, type sizes, radii, shadows, or components. If a value isn't in Figma, ask me.

## Rules (read every step)
- Stack: Next.js (App Router) + TypeScript + MUI + MUI icons (Outlined only). Deploy target: Vercel.
- Figma file key: `cvZFT0XVVUHwF4gIr27tgA`. Use the Figma MCP. Save tokens:
  - Call `get_variable_defs` once (Step 1) and reuse the theme after that.
  - Call `get_design_context` once per frame or component. Do not re-fetch something you already fetched.
  - Call `get_screenshot` once per screen, for the final visual check only.
- Ignore hidden layers and any layer with "archive" in its name.
- All mock data lives in `/data`. No backend.
- Sentence case for all UI copy. No em dashes in any copy.
- Do one step at a time. Stop at the end of each step and wait for me.

## Figma frames
Base URL: `https://www.figma.com/design/cvZFT0XVVUHwF4gIr27tgA/S3-Prototype?node-id=`
- Left nav component: `50-38237`
- Right panel component (all states): `52-44359`
- Dashboard, welcome state: `24-32272`
- Dashboard, choose contact state: `35-38455`
- Dashboard, conversation state: `35-40693`
- Price reduction list: `71-131689`
- 8110 N 10th St page with calculator modal open: `80-16960` (modal card: `80-18611`)
- Skip the metrics page.

---

## Step 1: Project setup and shell
1. Create the Next.js project in this folder.
2. Pull Figma variables and build one MUI theme (palette, type scale, spacing, radius, shadows). No hardcoded hex or px outside the theme.
3. Build the app shell: left nav, top icon bar, main content area, right panel.
4. Right panel is sticky: stays in view while main content scrolls, 16px from top, scrolls internally if taller than the window.
5. Routes: `/` dashboard, `/price-reductions` list, `/price-reductions/8110-n-10th-st` property page.
6. Left nav: Dashboard goes to `/`. On Market > Price Reduction goes to `/price-reductions`. Other items are visual only.

## Step 2: Dashboard
Match frame `24-32272`. Data fixes (use these, not what's in Figma if they differ):
- On Market Tasks count: 10.
- Recommended actions subtitle: "Found by reviewing all your properties. Approve to add to your task queue."
- Recommended actions rows: Price / 12 suggested price reductions / Could save $14,200 in holding costs. Listing / 3 listings ready to go live early / Could list 5 days sooner. Make-ready / 4 make-ready items to skip / Could save $18,600 in repair costs. Comps / Tampa comps down 3% in 30 days / Affects 8 of your listings. The Price row links to `/price-reductions`. Others are visual only.
- Metric card 1, No. of properties per status: 15 properties. Last week 12 properties (higher than last week). Target 15 properties (on track with target). Other DMs 14 properties (higher than other DMs). Y-axis 0, 5, 10, 15, 20.
- Metric card 2, Average sale price to list: 96%. Last week 95% (higher). Target 98% (lower than target). Other DMs 97% (lower). Y-axis 90% to 100%.
- Properties table rows (address, market, current state, status; * = red needs-attention status):
  - 8110 N 10th St, Tampa, FL 33604 | Tampa | Price Reduction | On Market *
  - 107 W Woodlawn Ave, Tallahassee, FL 32304 | Tallahassee | Offer | On Market
  - 4752 Lark Ridge Cir, Orlando, FL 32835 | Orlando | Price Reduction | On Market
  - 3819 Shane Ct, Ellenwood, GA 30294 | Atlanta | Offer | On Market
  - 10551 Standing Stone Dr, Tallahassee, FL 32317 | Tallahassee | Listing Price | Pre-Listing
  - 4011 Hanover Dr, Ellenwood, GA 30294 | Atlanta | Make-Ready Work | Pre-Listing *
  - 2216 Peachtree Way, Marietta, GA 30060 | Atlanta | Price Reduction | On Market
  - 915 Bayshore Ln, Tampa, FL 33611 | Tampa | Listing Price | Pre-Listing
  - 6034 Pine Hollow Rd, Orlando, FL 32808 | Orlando | Review PSA | Under Contract
  - 1428 Magnolia Ave, Tallahassee, FL 32303 | Tallahassee | Price Reduction | On Market

Right panel flow (frames `24-32272`, `35-38455`, `35-40693`): Ask tab shows welcome. Message tab: choose Seller > choose contact > choose property > conversation. Conversation content (use this, not Figma's text):
- Contact: Shoshana Rosenberg (Seller). Property: 8110 N 10th St, Tampa, FL 33604.
- Summary: "Seller is hesitant about the recommended price reduction to $412K and has set $420K as her floor. The property has been on market 45 days against a 30-day Tampa average, with showings down 60%."
- Agreement: Price reduction needed (both parties agree). Next: Agree on new list price.
- Suggested actions chips: Share comps / Propose $420K for two weeks / Open price calculator (this chip opens the calculator modal from Step 4).
- 09/11/2026 9:11 AM, Shoshana R. (Seller): "I saw the price reduction recommendation. I'm not comfortable going below $420K. What's the reasoning behind the new number?"
- 09/12/2026 8:05 AM, Me (DM): "Hi Shoshana, fair question. The home has been listed 45 days versus about 30 for similar homes in Tampa, showings are down 60% over the last two weeks, and three nearby homes sold within 2% of $412K. Holding costs run about $120 a day. If you'd rather not go that low, we could reduce to $420K now and revisit in two weeks. Want me to set that up?"
- Sending a message appends it to the thread.

## Step 3: Price reduction list
Match frame `71-131689` (the table data in Figma is correct).
- Right panel has one Ask/Message toggle only.
- "High-confidence price reductions: 4" card has "Approve all" (no check icon). It opens a confirm dialog listing the 4 high-confidence rows with new prices. Cancel / Approve. Approve shows a success toast and marks those rows Approved.
- Filter chips filter the table. High-confidence chip shows only High rows.
- "View details" on the 8110 N 10th St row goes to the property page. Other rows' links are visual only.
- Right panel Ask tab on this page (replaces "Welcome back"):
  - Header: 12 suggested price reductions
  - Needs your attention chips: 4 high-confidence ready to approve / 4 Tampa listings affected by comp drop
  - Suggested for you chips: Which has the highest holding cost? / Compare the Tampa listings / Why is 8110 N 10th St ranked first?

## Step 4: 8110 N 10th St page and calculator
Match frame `80-16960`.
- Property facts: 3 beds, 2 baths, 1 unit, built 1997, lot 6,250 sqft, 1,774 sqft.
- Advisory values are correct in Figma. Keep them.
- Suggested price reduction card: suggested price $412,000; reduction $23,000 / 5.3%; why: on market 45 days vs. 30-day Tampa average / showings down 60% over the last two weeks / Tampa comps down 3% in 30 days; 3 nearby sales within 2% of $412K / holding cost about $120 a day; projected impact: under contract in about 12 days. Buttons: Dismiss / Adjust price / Approve. Adjust price opens the calculator.
- Rebuild these from data (do not copy Figma's versions):
  - Price reduction history chart: $460,000 from day 1, drops to $435,000 at day 33, flat through day 45. Y-axis $400K to $470K.
  - Map: centered on Tampa 33604 (Seminole Heights). Pin the subject and 6 comps. Use a free tile map (Leaflet + OpenStreetMap).
  - Comps table: subject 8110 N 10th St plus 6 believable comps in Tampa 33604, 0.2 to 0.6 mi away. 3 sold between $404K and $415K, 3 listed between $419K and $439K. Keep Figma's columns and row style.
  - Listing history panel and table: use the selected comp's history, dates in July to August 2026.
- Right panel Ask tab on this page:
  - Header: 8110 N 10th St. Under it: Seller: Shoshana Rosenberg
  - Latest message preview (opens Message tab): "I'm not comfortable going below $420K..."
  - Suggested for you chips: Why $412K? / Show only sold comps / Draft a reply to Shoshana

Calculator modal (match `80-18611`):
- Four tiles equal width. Labels: Net proceeds / Days to contract / Holding cost / Vs. underwritten value.
- Title row: back arrow + "Adjust price". Address line: 8110 N 10th St, Tampa, FL 33604.
- List price input and slider, range $400K to $450K, step $1K. Markers above track at their true positions: Suggested $412K, Current $435K. Starts at $412K.
- Seller concessions input, default $3,000.
- Tiles update live as the slider or inputs change:
  - Net proceeds = price x 0.92 - concessions
  - Days to contract = 12 + (price - 412,000) x 35 / 23,000, minimum 5, rounded
  - Holding cost = days x $120
  - Vs. underwritten value = (price - 420,000) / 420,000, shown as "X% below" or "X% above", rounded
- Check: $412K gives $376,000 / 12 days / $1,440 / 2% below. $435K gives $397,200 / 47 days / $5,640 / 4% above.
- Buttons: Cancel / "Approve at $XXXK" (updates with price). Approve closes the modal, shows a success toast, and the card shows the approved price.

## Step 5: Visual check and deploy
1. For each screen, compare one Figma screenshot to the built page. List differences in spacing, alignment, type, and color. Fix them.
2. Run the build, fix errors, and give me the command to deploy to Vercel.
