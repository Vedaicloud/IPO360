import {
  IPOFormData,
  IPOAnalysisResult,
  CategoryScore,
  RiskLevel,
} from '../../types/ipo';
import {
  calculateCAGR,
  calculateMedian,
  calculateAverage,
  calculateMargin,
  calculatePremiumDiscount,
  evaluateCashFlowTrend,
  calculateStructureBreakdown,
  calculateRatio,
} from '../calculations/financialCalculations';
import { getSectorBenchmark } from '../benchmarks/sectorBenchmarks';

export function runIPOAnalysis(data: IPOFormData): IPOAnalysisResult {
  const { company, financials, valuation, peers, structure, marketData, risks } = data;
  const benchmark = getSectorBenchmark(company.sector);

  // Missing fields audit & data completeness calculation
  const missingFields: string[] = [];
  let totalDataPoints = 15;
  let filledDataPoints = 0;

  if (company.name) filledDataPoints++; else missingFields.push('Company Name');
  if (company.sector) filledDataPoints++; else missingFields.push('Sector');
  if (company.ipoPrice > 0) filledDataPoints++; else missingFields.push('IPO Issue Price');
  if (financials && financials.length >= 2) filledDataPoints++; else missingFields.push('At least 2 years of Financial History');
  if (financials.some(f => f.revenue > 0)) filledDataPoints++; else missingFields.push('Revenue figures');
  if (financials.some(f => f.pat !== 0)) filledDataPoints++; else missingFields.push('PAT (Net Profit) figures');
  if (financials.some(f => f.operatingCashFlow !== 0)) filledDataPoints++; else missingFields.push('Operating Cash Flow');
  if (valuation.eps > 0) filledDataPoints++; else missingFields.push('EPS (Earnings Per Share)');
  if (valuation.bookValuePerShare > 0) filledDataPoints++; else missingFields.push('Book Value Per Share');
  if (peers && peers.length > 0) filledDataPoints++; else missingFields.push('At least 1 Peer Company for valuation benchmark');
  if (structure.freshIssue > 0 || structure.offerForSale > 0) filledDataPoints++; else missingFields.push('IPO Structure (Fresh Issue / OFS)');
  if (financials.some(f => f.netWorth > 0)) filledDataPoints++; else missingFields.push('Net Worth / Equity');
  if (financials.some(f => f.totalDebt >= 0)) filledDataPoints++; else missingFields.push('Debt details');
  if (valuation.ebitda !== 0) filledDataPoints++; else missingFields.push('EBITDA data');
  if (risks && Object.keys(risks).length > 0) filledDataPoints++; else missingFields.push('Risk Factor assessment');

  const dataCompleteness = Math.min(100, Math.round((filledDataPoints / totalDataPoints) * 100));

  // Extract financial arrays
  const revenues = financials.map((f) => f.revenue || 0);
  const pats = financials.map((f) => f.pat || 0);
  const epss = financials.map((f) => f.eps || 0);
  const ebitdas = financials.map((f) => f.ebitda || 0);
  const debts = financials.map((f) => f.totalDebt || 0);
  const netWorths = financials.map((f) => f.netWorth || 0);
  const ocfs = financials.map((f) => f.operatingCashFlow || 0);

  // CAGRs
  const revenueCagr = calculateCAGR(revenues);
  const profitCagr = calculateCAGR(pats);
  const epsCagr = calculateCAGR(epss);

  // Margins
  const ebitdaMarginTrend = financials.map((f) => calculateMargin(f.ebitda, f.revenue));
  const patMarginTrend = financials.map((f) => calculateMargin(f.pat, f.revenue));
  const latestFinancial = financials[financials.length - 1] || {} as any;
  const initialFinancial = financials[0] || {} as any;

  const latestEbitdaMargin = calculateMargin(latestFinancial.ebitda || 0, latestFinancial.revenue || 1);
  const latestPatMargin = calculateMargin(latestFinancial.pat || 0, latestFinancial.revenue || 1);

  // Cash flow trend
  const cashFlowTrend = evaluateCashFlowTrend(financials);

  // Health Ratios
  const latestDebt = latestFinancial.totalDebt || 0;
  const latestEquity = latestFinancial.netWorth || 1;
  const debtToEquity = calculateRatio(latestDebt, latestEquity);
  
  const latestEbit = latestFinancial.ebit || (latestFinancial.ebitda ? latestFinancial.ebitda * 0.85 : 0);
  const interestExp = latestFinancial.interestExpense || 0;
  const interestCoverage = interestExp > 0 ? calculateRatio(latestEbit, interestExp) : 10.0;

  const currentAssets = latestFinancial.currentAssets || 1;
  const currentLiabilities = latestFinancial.currentLiabilities || 1;
  const currentRatio = calculateRatio(currentAssets, currentLiabilities);

  // ROE and ROCE
  const latestRoe = latestFinancial.roe ?? (latestEquity > 0 ? calculateRatio((latestFinancial.pat || 0) * 100, latestEquity) : 0);
  const totalCapital = latestEquity + latestDebt;
  const latestRoce = latestFinancial.roce ?? (totalCapital > 0 ? calculateRatio((latestEbit || 0) * 100, totalCapital) : 0);

  let roeTrendDescription = 'ROE has remained steady over the historical period.';
  if (financials.length >= 2) {
    const firstRoe = financials[0].roe ?? (financials[0].netWorth > 0 ? (financials[0].pat / financials[0].netWorth) * 100 : 0);
    if (latestRoe > firstRoe + 2) {
      roeTrendDescription = `ROE expanded from ${firstRoe.toFixed(1)}% to ${latestRoe.toFixed(1)}% over the analyzed timeframe.`;
    } else if (latestRoe < firstRoe - 2) {
      roeTrendDescription = `ROE moderated from ${firstRoe.toFixed(1)}% to ${latestRoe.toFixed(1)}% across the historical period.`;
    }
  }

  // Valuation Multiples
  const ipoPe = valuation.eps > 0 ? calculateRatio(valuation.ipoPrice, valuation.eps) : 0;
  const ipoPb = valuation.bookValuePerShare > 0 ? calculateRatio(valuation.ipoPrice, valuation.bookValuePerShare) : 0;
  const ipoEvEbitda = valuation.ebitda > 0 ? calculateRatio(valuation.enterpriseValue, valuation.ebitda) : 0;

  // Peer Statistics
  const peerPes = peers.map((p) => p.pe).filter((v) => v > 0);
  const peerPbs = peers.map((p) => p.pb).filter((v) => v > 0);
  const peerEvEbitdas = peers.map((p) => p.evEbitda).filter((v) => v > 0);

  const peerMedianPe = calculateMedian(peerPes);
  const peerAveragePe = calculateAverage(peerPes);
  const pePremiumDiscount = calculatePremiumDiscount(ipoPe, peerMedianPe);

  const peerMedianPb = calculateMedian(peerPbs);
  const peerAveragePb = calculateAverage(peerPbs);
  const pbPremiumDiscount = calculatePremiumDiscount(ipoPb, peerMedianPb);

  const peerMedianEvEbitda = calculateMedian(peerEvEbitdas);
  const peerAverageEvEbitda = calculateAverage(peerEvEbitdas);
  const evEbitdaPremiumDiscount = calculatePremiumDiscount(ipoEvEbitda, peerMedianEvEbitda);

  // Structure Breakdown
  const structureCalc = calculateStructureBreakdown(structure);

  // -------------------------------------------------------------
  // TRANSPARENT 9-CATEGORY SCORING SYSTEM (Total: 100 points)
  // -------------------------------------------------------------

  // 1. Growth (Max: 20 pts)
  let growthScore = 0;
  let growthStatus: 'positive' | 'neutral' | 'caution' = 'neutral';
  if (revenueCagr >= benchmark.growthCagrGood) {
    growthScore += 10;
  } else if (revenueCagr >= benchmark.growthCagrAvg) {
    growthScore += 6;
  } else if (revenueCagr > 0) {
    growthScore += 3;
  }

  if (profitCagr >= benchmark.growthCagrGood) {
    growthScore += 10;
  } else if (profitCagr >= benchmark.growthCagrAvg) {
    growthScore += 6;
  } else if (profitCagr > 0) {
    growthScore += 3;
  }
  growthStatus = growthScore >= 14 ? 'positive' : growthScore >= 8 ? 'neutral' : 'caution';

  const growthCategory: CategoryScore = {
    name: 'Growth',
    score: growthScore,
    maxScore: 20,
    input: `Revenue CAGR: ${revenueCagr}% | Profit CAGR: ${profitCagr}%`,
    formula: 'CAGR = (Ending / Beginning) ^ (1 / Years) - 1',
    benchmark: `${company.sector} Sector benchmark: Good > ${benchmark.growthCagrGood}%, Avg > ${benchmark.growthCagrAvg}%`,
    assessment: `Revenue grew at an annual rate of ${revenueCagr}% and profit at ${profitCagr}% over the entered historical period.`,
    status: growthStatus,
  };

  // 2. Profitability (Max: 15 pts)
  let profScore = 0;
  if (company.sector === 'Banking' || company.sector === 'NBFC') {
    // Financial services sector
    if (latestPatMargin >= benchmark.patMarginGood) profScore += 15;
    else if (latestPatMargin >= 8) profScore += 10;
    else profScore += 5;
  } else {
    // Non-banking
    if (latestEbitdaMargin >= benchmark.ebitdaMarginGood) profScore += 8;
    else if (latestEbitdaMargin >= 10) profScore += 5;
    else if (latestEbitdaMargin > 0) profScore += 2;

    if (latestPatMargin >= benchmark.patMarginGood) profScore += 7;
    else if (latestPatMargin >= 5) profScore += 4;
    else if (latestPatMargin > 0) profScore += 2;
  }
  const profStatus = profScore >= 11 ? 'positive' : profScore >= 7 ? 'neutral' : 'caution';
  const profCategory: CategoryScore = {
    name: 'Profitability',
    score: profScore,
    maxScore: 15,
    input: `EBITDA Margin: ${latestEbitdaMargin}% | PAT Margin: ${latestPatMargin}%`,
    formula: 'EBITDA Margin = (EBITDA / Revenue) * 100; PAT Margin = (PAT / Revenue) * 100',
    benchmark: `${company.sector} Sector benchmark: EBITDA Margin > ${benchmark.ebitdaMarginGood}%, PAT Margin > ${benchmark.patMarginGood}%`,
    assessment: `Operating margin currently stands at ${latestEbitdaMargin}%, with bottom-line PAT margin at ${latestPatMargin}%.`,
    status: profStatus,
  };

  // 3. Cash Flow (Max: 10 pts)
  let cfScore = 0;
  const positiveOcfYears = ocfs.filter((o) => o > 0).length;
  const totalYears = financials.length || 1;
  const ocfRatio = positiveOcfYears / totalYears;
  
  if (ocfRatio >= 0.8) cfScore += 6;
  else if (ocfRatio >= 0.5) cfScore += 4;
  else cfScore += 1;

  // CFO vs PAT comparison (High quality earnings when CFO >= PAT)
  const latestOcf = latestFinancial.operatingCashFlow || 0;
  const latestPat = latestFinancial.pat || 0;
  if (latestOcf > 0 && latestOcf >= latestPat * 0.8) {
    cfScore += 4;
  } else if (latestOcf > 0) {
    cfScore += 2;
  }
  const cfStatus = cfScore >= 8 ? 'positive' : cfScore >= 5 ? 'neutral' : 'caution';
  const cashFlowCategory: CategoryScore = {
    name: 'Cash Flow',
    score: cfScore,
    maxScore: 10,
    input: `Positive OCF in ${positiveOcfYears} of ${totalYears} years | Latest OCF: ₹${latestOcf} Cr vs PAT: ₹${latestPat} Cr`,
    formula: 'Earnings Quality Ratio = Operating Cash Flow / PAT',
    benchmark: 'Consistent positive operating cash flows exceeding or matching reported net profit',
    assessment: `Cash generation trend is ${cashFlowTrend.toLowerCase()} with cash from operations in ${positiveOcfYears}/${totalYears} historical periods.`,
    status: cfStatus,
  };

  // 4. Financial Health / Leverage (Max: 10 pts)
  let healthScore = 0;
  if (debtToEquity <= benchmark.debtToEquityAcceptable) {
    healthScore += 5;
  } else if (debtToEquity <= benchmark.debtToEquityCaution) {
    healthScore += 3;
  } else {
    healthScore += 1;
  }

  if (interestCoverage >= 4.0) healthScore += 3;
  else if (interestCoverage >= 2.0) healthScore += 2;
  else healthScore += 1;

  if (currentRatio >= 1.3) healthScore += 2;
  else if (currentRatio >= 1.0) healthScore += 1;

  const healthStatus = healthScore >= 8 ? 'positive' : healthScore >= 5 ? 'neutral' : 'caution';
  const healthCategory: CategoryScore = {
    name: 'Financial Health',
    score: healthScore,
    maxScore: 10,
    input: `Debt/Equity: ${debtToEquity}x | Interest Coverage: ${interestCoverage}x | Current Ratio: ${currentRatio}x`,
    formula: 'Debt/Equity = Total Debt / Net Worth; Interest Coverage = EBIT / Interest',
    benchmark: `${company.sector} Sector benchmark: D/E acceptable < ${benchmark.debtToEquityAcceptable}x, caution > ${benchmark.debtToEquityCaution}x`,
    assessment: `Leverage is measured at ${debtToEquity}x Net Worth with an interest coverage ratio of ${interestCoverage}x.`,
    status: healthStatus,
  };

  // 5. ROE / ROCE (Max: 10 pts)
  let roeScore = 0;
  if (latestRoe >= benchmark.expectedRoe) roeScore += 5;
  else if (latestRoe >= 10) roeScore += 3;
  else if (latestRoe > 0) roeScore += 1;

  if (latestRoce >= benchmark.expectedRoce) roeScore += 5;
  else if (latestRoce >= 10) roeScore += 3;
  else if (latestRoce > 0) roeScore += 1;

  const roeStatus = roeScore >= 8 ? 'positive' : roeScore >= 5 ? 'neutral' : 'caution';
  const roeCategory: CategoryScore = {
    name: 'ROE / ROCE',
    score: roeScore,
    maxScore: 10,
    input: `ROE: ${latestRoe.toFixed(1)}% | ROCE: ${latestRoce.toFixed(1)}%`,
    formula: 'ROE = (PAT / Equity) * 100; ROCE = (EBIT / Capital Employed) * 100',
    benchmark: `${company.sector} Sector benchmark: Target ROE > ${benchmark.expectedRoe}%, ROCE > ${benchmark.expectedRoce}%`,
    assessment: `${roeTrendDescription} Current ROE is ${latestRoe.toFixed(1)}% and ROCE is ${latestRoce.toFixed(1)}%.`,
    status: roeStatus,
  };

  // 6. Valuation (Max: 20 pts)
  let valScore = 0;
  let valStatus: 'positive' | 'neutral' | 'caution' = 'neutral';
  
  if (peerMedianPe > 0 && ipoPe > 0) {
    if (pePremiumDiscount <= -15) {
      valScore += 12; // Healthy discount to peers
    } else if (pePremiumDiscount <= 5) {
      valScore += 9; // In line with peers
    } else if (pePremiumDiscount <= 25) {
      valScore += 5; // Moderate premium
    } else {
      valScore += 2; // Steep premium
    }
  } else {
    // If no peers, score against sector baseline
    if (ipoPe > 0 && ipoPe <= benchmark.normalPeRangeMin) valScore += 10;
    else if (ipoPe <= benchmark.normalPeRangeMax) valScore += 6;
    else valScore += 3;
  }

  // P/B or EV/EBITDA contribution (8 pts)
  if (peerMedianEvEbitda > 0 && ipoEvEbitda > 0) {
    if (evEbitdaPremiumDiscount <= 0) valScore += 8;
    else if (evEbitdaPremiumDiscount <= 20) valScore += 5;
    else valScore += 2;
  } else if (peerMedianPb > 0 && ipoPb > 0) {
    if (pbPremiumDiscount <= 0) valScore += 8;
    else if (pbPremiumDiscount <= 20) valScore += 5;
    else valScore += 2;
  } else {
    valScore += 4;
  }

  valStatus = valScore >= 14 ? 'positive' : valScore >= 8 ? 'neutral' : 'caution';
  const valCategory: CategoryScore = {
    name: 'Valuation',
    score: valScore,
    maxScore: 20,
    input: `IPO P/E: ${ipoPe > 0 ? ipoPe + 'x' : 'N/A'} vs Peer Median: ${peerMedianPe > 0 ? peerMedianPe + 'x' : 'N/A'} (${pePremiumDiscount > 0 ? '+' : ''}${pePremiumDiscount}%)`,
    formula: 'Premium/Discount % = ((IPO Multiple / Peer Median) - 1) * 100',
    benchmark: `Peer valuation median: P/E ${peerMedianPe}x | Sector standard P/E range: ${benchmark.normalPeRangeMin}x - ${benchmark.normalPeRangeMax}x`,
    assessment: ipoPe > 0 && peerMedianPe > 0
      ? `IPO price commands a ${Math.abs(pePremiumDiscount)}% ${pePremiumDiscount > 0 ? 'premium over' : 'discount against'} the peer median P/E.`
      : 'Valuation evaluated relative to sector standard multiples.',
    status: valStatus,
  };

  // 7. Business Quality (Max: 5 pts)
  let bqScore = 3;
  if (revenueCagr > 12 && latestPatMargin > 8 && debtToEquity < 1.0) {
    bqScore = 5;
  } else if (revenueCagr > 5 && latestPatMargin > 3) {
    bqScore = 4;
  } else {
    bqScore = 2;
  }
  const bqCategory: CategoryScore = {
    name: 'Business Quality',
    score: bqScore,
    maxScore: 5,
    input: `${company.sector} / ${company.industry || 'General Industry'}`,
    formula: 'Holistic synthesis of scale, margin retention, and operating track record',
    benchmark: 'Established presence, operational resilience, and competitive moat',
    assessment: `Business operates in ${company.sector} with demonstrated revenue retention and operating capability.`,
    status: bqScore >= 4 ? 'positive' : 'neutral',
  };

  // 8. IPO Structure & Use of Proceeds (Max: 5 pts)
  let structureScore = 0;
  // A high Fresh Issue % is preferred because capital enters the company rather than cashing out promoters
  if (structureCalc.freshPercentage >= 70) structureScore += 3;
  else if (structureCalc.freshPercentage >= 40) structureScore += 2;
  else structureScore += 1;

  // Use of proceeds evaluation
  const productiveProceeds = (structure.capex || 0) + (structure.debtRepayment || 0) + (structure.workingCapital || 0);
  const totalProceeds = productiveProceeds + (structure.generalCorporate || 0);
  const productiveRatio = totalProceeds > 0 ? productiveProceeds / totalProceeds : 0;
  if (productiveRatio >= 0.75) structureScore += 2;
  else if (productiveRatio >= 0.5) structureScore += 1;

  const structCategory: CategoryScore = {
    name: 'IPO Structure',
    score: structureScore,
    maxScore: 5,
    input: `Fresh Issue: ${structureCalc.freshPercentage}% | OFS: ${structureCalc.ofsPercentage}%`,
    formula: 'Fresh Issue % = (Fresh Issue / Total Issue) * 100',
    benchmark: 'Preferred: High proportion of Fresh Issue for growth capex/debt repayment vs pure promoter OFS exit',
    assessment: `Fresh issue constitutes ${structureCalc.freshPercentage}% of the offering, with ${structureCalc.ofsPercentage}% designated as Offer for Sale (OFS).`,
    status: structureScore >= 4 ? 'positive' : structureScore >= 3 ? 'neutral' : 'caution',
  };

  // 9. Risk Factors (Max: 5 pts)
  // Count affirmed risks ('yes')
  const riskEntries = Object.entries(risks);
  const yesRiskCount = riskEntries.filter(([_, val]) => val === 'yes').length;
  let riskScore = 5;
  if (yesRiskCount >= 7) riskScore = 1;
  else if (yesRiskCount >= 5) riskScore = 2;
  else if (yesRiskCount >= 3) riskScore = 3;
  else if (yesRiskCount >= 1) riskScore = 4;
  else riskScore = 5;

  let riskLevel: RiskLevel = 'Low';
  if (yesRiskCount >= 7) riskLevel = 'High';
  else if (yesRiskCount >= 4) riskLevel = 'Elevated';
  else if (yesRiskCount >= 2) riskLevel = 'Moderate';
  else riskLevel = 'Low';

  const riskCategory: CategoryScore = {
    name: 'Risk Evaluation',
    score: riskScore,
    maxScore: 5,
    input: `${yesRiskCount} elevated risk factor(s) flagged out of 14 standard checklist items`,
    formula: 'Weighted risk penalty index based on structural, operational, and regulatory flags',
    benchmark: 'Minimal promoter pledge, low customer concentration, and clean regulatory history',
    assessment: `Identified ${yesRiskCount} material caution areas. Overall calculated risk profile falls in the ${riskLevel} band.`,
    status: riskScore >= 4 ? 'positive' : riskScore >= 3 ? 'neutral' : 'caution',
  };

  // Sum total score (out of 100)
  const categoryScores = {
    growth: growthCategory,
    profitability: profCategory,
    cashFlow: cashFlowCategory,
    financialHealth: healthCategory,
    roeRoce: roeCategory,
    valuation: valCategory,
    businessQuality: bqCategory,
    ipoStructure: structCategory,
    risk: riskCategory,
  };

  const overallScore = Math.min(
    100,
    growthScore +
      profScore +
      cfScore +
      healthScore +
      roeScore +
      valScore +
      bqScore +
      structureScore +
      riskScore
  );

  const fundamentalScore = growthScore + profScore + cfScore + healthScore + roeScore + bqScore + structureScore; // out of 75

  // -------------------------------------------------------------
  // DYNAMIC POSITIVE, CAUTION & RISK OBSERVATIONS
  // -------------------------------------------------------------
  const positiveFactors: string[] = [];
  const cautionFactors: string[] = [];
  const keyRisks: string[] = [];
  const thingsToVerify: string[] = [];

  // Growth observations
  if (revenueCagr >= benchmark.growthCagrGood) {
    positiveFactors.push(`Revenue CAGR was a robust ${revenueCagr}% over the entered historical period.`);
  } else if (revenueCagr < benchmark.growthCagrAvg && revenueCagr > 0) {
    cautionFactors.push(`Revenue CAGR (${revenueCagr}%) is below the typical sector expansion rate of ${benchmark.growthCagrAvg}%.`);
  }

  if (profitCagr >= benchmark.growthCagrGood) {
    positiveFactors.push(`Net profit (PAT) expanded at an annual CAGR of ${profitCagr}%.`);
  }

  // Margin observations
  if (patMarginTrend.length >= 2) {
    const firstMargin = patMarginTrend[0];
    const lastMargin = patMarginTrend[patMarginTrend.length - 1];
    if (lastMargin > firstMargin + 1.5) {
      positiveFactors.push(`PAT margin expanded from ${firstMargin}% to ${lastMargin}% over the period.`);
    } else if (lastMargin < firstMargin - 1.5) {
      cautionFactors.push(`PAT margin contracted from ${firstMargin}% to ${lastMargin}% across historical financials.`);
    }
  }

  // Cash flow observations
  if (positiveOcfYears >= totalYears - 1 && totalYears >= 3) {
    positiveFactors.push(`Operating cash flow was positive in ${positiveOcfYears} of the last ${totalYears} years.`);
  } else if (positiveOcfYears <= 1 && totalYears >= 3) {
    cautionFactors.push(`Company generated positive operating cash flow in only ${positiveOcfYears} of the last ${totalYears} years.`);
    keyRisks.push('Persistent negative cash flow from operations requires external capital to sustain day-to-day operations.');
  }

  // Debt observations
  if (debtToEquity <= 0.3) {
    positiveFactors.push(`Virtually debt-free balance sheet with conservative Debt/Equity ratio of ${debtToEquity}x.`);
  } else if (debtToEquity >= benchmark.debtToEquityCaution) {
    cautionFactors.push(`Total Debt/Equity stands elevated at ${debtToEquity}x, exceeding the sector caution benchmark of ${benchmark.debtToEquityCaution}x.`);
    keyRisks.push(`High financial leverage (${debtToEquity}x D/E) increases sensitivity to interest rate cycles.`);
  }

  // Valuation observations
  if (ipoPe > 0 && peerMedianPe > 0) {
    if (pePremiumDiscount < -10) {
      positiveFactors.push(`IPO P/E of ${ipoPe}x is priced at a ${Math.abs(pePremiumDiscount)}% discount to the peer median (${peerMedianPe}x).`);
    } else if (pePremiumDiscount > 15) {
      cautionFactors.push(`IPO P/E of ${ipoPe}x is priced at a ${pePremiumDiscount}% premium compared to the peer median of ${peerMedianPe}x.`);
    }
  }

  // Structure observations
  if (structureCalc.freshPercentage >= 70) {
    positiveFactors.push(`High fresh issue proportion (${structureCalc.freshPercentage}%), meaning the primary capital goes directly into the company.`);
  } else if (structureCalc.ofsPercentage >= 70) {
    cautionFactors.push(`Offer for Sale (OFS) comprises ${structureCalc.ofsPercentage}% of the issue size; existing shareholders are monetizing equity.`);
  }

  // Risk Checklist observations
  if (risks.customerConcentration === 'yes') {
    cautionFactors.push('High customer concentration flagged; substantial revenues derived from a limited client base.');
    keyRisks.push('Loss of or pricing pressure from top customers could significantly impact future quarterly performance.');
  }
  if (risks.highDebt === 'yes' && !keyRisks.some(r => r.includes('leverage'))) {
    keyRisks.push('High leverage noted in qualitative assessment; serviceability must be reviewed.');
  }
  if (risks.regulatoryRisk === 'yes') {
    keyRisks.push('Operates in a tightly regulated sector with periodic regulatory audits or compliance requirements.');
  }
  if (risks.legalProceedings === 'yes') {
    keyRisks.push('Outstanding legal, tax, or consumer litigation noted against the company, promoters, or subsidiaries.');
  }
  if (risks.promoterConcerns === 'yes') {
    keyRisks.push('Promoter/management concerns or significant promoter share pledge noted in disclosures.');
  }
  if (risks.cyclicalBusiness === 'yes') {
    cautionFactors.push('Business is subject to macroeconomic or industry cyclicity.');
  }

  // Standard things to verify from DRHP/RHP
  thingsToVerify.push('Verify exact utilization milestones and timelines of Fresh Issue proceeds in the DRHP.');
  thingsToVerify.push('Review the Top 10 customer revenue concentration tables in the Offer Document.');
  thingsToVerify.push('Inspect related-party transaction disclosures and promoter remuneration details.');
  thingsToVerify.push('Examine ongoing tax disputes and contingent liabilities mentioned in Section VII of the DRHP.');
  thingsToVerify.push('Check the lock-in period for pre-IPO anchor investors and promoters post-listing.');

  const riskHighlights = keyRisks.slice(0, 4);

  return {
    id: `ipo-${Date.now()}`,
    createdAt: new Date().toISOString(),
    company,
    financials,
    peers,
    structure,
    marketData,
    risks,
    revenueCagr,
    profitCagr,
    epsCagr,
    latestEbitdaMargin,
    latestPatMargin,
    ebitdaMarginTrend,
    patMarginTrend,
    cashFlowTrend,
    debtToEquity,
    interestCoverage,
    currentRatio,
    latestRoe,
    latestRoce,
    roeTrendDescription,
    ipoPe,
    peerMedianPe,
    peerAveragePe,
    pePremiumDiscount,
    ipoPb,
    peerMedianPb,
    peerAveragePb,
    pbPremiumDiscount,
    ipoEvEbitda,
    peerMedianEvEbitda,
    peerAverageEvEbitda,
    evEbitdaPremiumDiscount,
    totalIssueSize: structureCalc.totalIssue,
    freshIssuePercentage: structureCalc.freshPercentage,
    ofsPercentage: structureCalc.ofsPercentage,
    overallScore,
    fundamentalScore,
    valuationScore: valScore,
    riskScore,
    categoryScores,
    riskLevel,
    riskCount: yesRiskCount,
    riskHighlights,
    positiveFactors,
    cautionFactors,
    keyRisks,
    thingsToVerify,
    dataCompleteness,
    missingFields,
  };
}
