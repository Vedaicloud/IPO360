import { FinancialYearData, PeerCompany, IPOStructure } from '../../types/ipo';

/**
 * Calculates Compound Annual Growth Rate (CAGR)
 * Formula: (Ending / Beginning) ^ (1 / Years) - 1
 */
export function calculateCAGR(values: number[]): number {
  if (!values || values.length < 2) return 0;
  
  const startVal = values[0];
  const endVal = values[values.length - 1];
  const years = values.length - 1;

  if (startVal <= 0 || endVal <= 0 || years <= 0) {
    // If turnaround from loss to profit or baseline is 0/negative, simple absolute growth or 0
    if (startVal === 0 && endVal > 0) return 100;
    if (startVal < 0 && endVal > 0) return Math.round(((endVal - startVal) / Math.abs(startVal)) * 100);
    return 0;
  }

  const cagr = Math.pow(endVal / startVal, 1 / years) - 1;
  return Number((cagr * 100).toFixed(2));
}

/**
 * Calculates Median of an array of numbers
 */
export function calculateMedian(numbers: number[]): number {
  const valid = numbers.filter((n) => typeof n === 'number' && !isNaN(n) && n > 0);
  if (valid.length === 0) return 0;
  
  const sorted = [...valid].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 !== 0) {
    return Number(sorted[mid].toFixed(2));
  }
  return Number(((sorted[mid - 1] + sorted[mid]) / 2).toFixed(2));
}

/**
 * Calculates Average of an array of numbers
 */
export function calculateAverage(numbers: number[]): number {
  const valid = numbers.filter((n) => typeof n === 'number' && !isNaN(n) && n > 0);
  if (valid.length === 0) return 0;
  const sum = valid.reduce((acc, curr) => acc + curr, 0);
  return Number((sum / valid.length).toFixed(2));
}

/**
 * Calculates Margin percentage
 */
export function calculateMargin(numerator: number, denominator: number): number {
  if (!denominator || denominator <= 0) return 0;
  return Number(((numerator / denominator) * 100).toFixed(2));
}

/**
 * Calculates Valuation Multiple Premium/Discount compared to Peer Median
 * Formula: ((IPO Multiple / Peer Median) - 1) * 100
 */
export function calculatePremiumDiscount(ipoMultiple: number, peerMedian: number): number {
  if (!peerMedian || peerMedian <= 0 || !ipoMultiple || ipoMultiple <= 0) return 0;
  const diff = ((ipoMultiple / peerMedian) - 1) * 100;
  return Number(diff.toFixed(2));
}

/**
 * Evaluates Cash Flow trend across available financial years
 */
export function evaluateCashFlowTrend(
  financials: FinancialYearData[]
): 'Consistently Positive' | 'Improving' | 'Declining' | 'Volatile' | 'Consistently Negative' {
  if (!financials || financials.length === 0) return 'Volatile';
  
  const ocfs = financials.map((f) => f.operatingCashFlow);
  const positiveCount = ocfs.filter((c) => c > 0).length;
  
  if (positiveCount === ocfs.length) return 'Consistently Positive';
  if (positiveCount === 0) return 'Consistently Negative';

  // Check if latest year is significantly better than prior
  const latest = ocfs[ocfs.length - 1];
  const prior = ocfs[ocfs.length - 2];
  if (latest > prior && latest > 0) return 'Improving';
  if (latest < prior && latest < 0) return 'Declining';

  return 'Volatile';
}

/**
 * Calculates IPO Structure percentages
 */
export function calculateStructureBreakdown(structure: IPOStructure) {
  const total = (structure.freshIssue || 0) + (structure.offerForSale || 0);
  const freshPct = total > 0 ? Number(((structure.freshIssue / total) * 100).toFixed(1)) : 0;
  const ofsPct = total > 0 ? Number(((structure.offerForSale / total) * 100).toFixed(1)) : 0;

  return {
    totalIssue: total,
    freshPercentage: freshPct,
    ofsPercentage: ofsPct,
  };
}

/**
 * Safe ratio division with fallback
 */
export function calculateRatio(numerator: number, denominator: number, decimals: number = 2): number {
  if (!denominator || denominator === 0 || isNaN(denominator) || isNaN(numerator)) {
    return 0;
  }
  return Number((numerator / denominator).toFixed(decimals));
}
