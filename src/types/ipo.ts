export type SectorType =
  | 'IT'
  | 'Banking'
  | 'NBFC'
  | 'Insurance'
  | 'Pharma'
  | 'Manufacturing'
  | 'FMCG'
  | 'Automobile'
  | 'Real Estate'
  | 'Energy'
  | 'Consumer'
  | 'Technology'
  | 'Other';

export interface CompanyDetails {
  name: string;
  sector: SectorType;
  industry: string;
  ipoPrice: number;
  priceBandMin: number;
  priceBandMax: number;
  issueSize: number; // in ₹ Crores (or millions)
  listingExchange: 'NSE & BSE' | 'NSE' | 'BSE';
  openDate: string;
  closeDate: string;
  website?: string;
  drhpUrl?: string;
}

export interface FinancialYearData {
  year: string; // e.g. "FY2022", "FY2023", "FY2024", "FY2025", "FY2026"
  revenue: number; // In ₹ Crores
  ebitda: number;
  ebit: number;
  pat: number;
  eps: number;
  operatingCashFlow: number;
  freeCashFlow: number;
  totalDebt: number;
  netWorth: number;
  totalAssets: number;
  currentAssets?: number;
  currentLiabilities?: number;
  interestExpense?: number;
  roe?: number; // %
  roce?: number; // %
}

export interface PeerCompany {
  id: string;
  name: string;
  pe: number;
  pb: number;
  evEbitda: number;
  revenueGrowth: number; // %
  patMargin: number; // %
  roe: number; // %
  roce: number; // %
}

export interface IPOStructure {
  freshIssue: number; // ₹ Cr
  offerForSale: number; // ₹ Cr
  debtRepayment: number; // ₹ Cr
  capex: number; // ₹ Cr
  workingCapital: number; // ₹ Cr
  generalCorporate: number; // ₹ Cr
}

export interface MarketData {
  gmp?: number; // ₹ per share
  gmpPercentage?: number; // %
  qibSubscription?: number; // times
  niiSubscription?: number; // times
  retailSubscription?: number; // times
  employeeSubscription?: number; // times
}

export type RiskResponse = 'yes' | 'no' | 'unknown';

export interface RiskChecklist {
  highDebt: RiskResponse;
  negativeCashFlow: RiskResponse;
  customerConcentration: RiskResponse;
  supplierConcentration: RiskResponse;
  regulatoryRisk: RiskResponse;
  legalProceedings: RiskResponse;
  promoterConcerns: RiskResponse;
  highCompetition: RiskResponse;
  cyclicalBusiness: RiskResponse;
  relatedPartyTransactions: RiskResponse;
  dependenceOnKeyCustomers: RiskResponse;
  dependenceOnGovtPolicies: RiskResponse;
  marginDecline: RiskResponse;
  profitVolatility: RiskResponse;
}

export interface ValuationData {
  ipoPrice: number;
  eps: number;
  bookValuePerShare: number;
  enterpriseValue: number;
  ebitda: number;
}

export interface IPOFormData {
  company: CompanyDetails;
  financials: FinancialYearData[];
  valuation: ValuationData;
  peers: PeerCompany[];
  structure: IPOStructure;
  marketData: MarketData;
  risks: RiskChecklist;
}

export interface CategoryScore {
  name: string;
  score: number;
  maxScore: number;
  input: string;
  formula: string;
  benchmark: string;
  assessment: string;
  status: 'positive' | 'neutral' | 'caution';
}

export type RiskLevel = 'Low' | 'Moderate' | 'Elevated' | 'High';

export interface IPOAnalysisResult {
  id: string;
  createdAt: string;
  company: CompanyDetails;
  financials: FinancialYearData[];
  peers: PeerCompany[];
  structure: IPOStructure;
  marketData: MarketData;
  risks: RiskChecklist;
  
  // Calculated Ratios
  revenueCagr: number;
  profitCagr: number;
  epsCagr: number;
  latestEbitdaMargin: number;
  latestPatMargin: number;
  ebitdaMarginTrend: number[];
  patMarginTrend: number[];
  cashFlowTrend: 'Consistently Positive' | 'Improving' | 'Declining' | 'Volatile' | 'Consistently Negative';
  debtToEquity: number;
  interestCoverage: number;
  currentRatio: number;
  latestRoe: number;
  latestRoce: number;
  roeTrendDescription: string;
  
  // Valuation comparisons
  ipoPe: number;
  peerMedianPe: number;
  peerAveragePe: number;
  pePremiumDiscount: number; // %
  
  ipoPb: number;
  peerMedianPb: number;
  peerAveragePb: number;
  pbPremiumDiscount: number; // %
  
  ipoEvEbitda: number;
  peerMedianEvEbitda: number;
  peerAverageEvEbitda: number;
  evEbitdaPremiumDiscount: number; // %

  // Structure breakdown
  totalIssueSize: number;
  freshIssuePercentage: number;
  ofsPercentage: number;
  
  // Scoring
  overallScore: number; // out of 100
  fundamentalScore: number; // out of 75 (growth, profitability, cash flow, health, roe, quality, structure)
  valuationScore: number; // out of 20
  riskScore: number; // out of 5
  categoryScores: {
    growth: CategoryScore;
    profitability: CategoryScore;
    cashFlow: CategoryScore;
    financialHealth: CategoryScore;
    roeRoce: CategoryScore;
    valuation: CategoryScore;
    businessQuality: CategoryScore;
    ipoStructure: CategoryScore;
    risk: CategoryScore;
  };

  // Risk Meter
  riskLevel: RiskLevel;
  riskCount: number;
  riskHighlights: string[];

  // Qualitative Insights
  positiveFactors: string[];
  cautionFactors: string[];
  keyRisks: string[];
  thingsToVerify: string[];

  // Data Completeness
  dataCompleteness: number; // percentage (0 - 100)
  missingFields: string[];
}
