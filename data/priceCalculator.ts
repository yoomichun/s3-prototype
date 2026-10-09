export const priceRange = { min: 400000, max: 450000, step: 1000 } as const;
export const suggestedPrice = 412000;
export const currentPrice = 435000;
export const defaultConcessions = 3000;
export const holdingCostPerDay = 120;

const underwrittenValue = 420000;
const netProceedsRate = 0.92;
const baselineDays = 12;
const daysPerPriceStep = 35 / 23000;
const minDays = 5;

export type CalculatorResult = {
  netProceeds: number;
  daysToContract: number;
  holdingCost: number;
  vsUnderwritten: { percent: number; direction: "below" | "above" };
};

export function calculate(price: number, concessions: number): CalculatorResult {
  // Rounded to the nearest $100 so both reference prices in the spec ($412K and $435K) come out exactly
  const netProceeds = Math.round((price * netProceedsRate - concessions) / 100) * 100;
  const daysToContract = Math.max(minDays, Math.round(baselineDays + (price - suggestedPrice) * daysPerPriceStep));
  const diff = (price - underwrittenValue) / underwrittenValue;
  return {
    netProceeds,
    daysToContract,
    holdingCost: daysToContract * holdingCostPerDay,
    vsUnderwritten: { percent: Math.round(Math.abs(diff) * 100), direction: diff < 0 ? "below" : "above" },
  };
}

export const formatPriceK = (n: number) => `$${Math.round(n / 1000)}K`;
