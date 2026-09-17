import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { IPOAnalysisResult } from '../../types/ipo';
import { formatCurrency, formatNumber } from '../../lib/utils';
import { BarChart3, TrendingUp, PieChart as PieIcon, ShieldAlert } from 'lucide-react';

interface FinancialChartsProps {
  result: IPOAnalysisResult;
}

const COLORS = ['#2563eb', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
const PROCEEDS_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#6366f1'];

export const FinancialCharts: React.FC<FinancialChartsProps> = ({ result }) => {
  const [activeTab, setActiveTab] = useState<'trends' | 'valuation' | 'structure' | 'scoring'>('trends');

  // Chart 1 to 6 Data: Financials over years
  const financialData = result.financials.map((f) => ({
    year: f.year,
    Revenue: f.revenue,
    EBITDA: f.ebitda,
    PAT: f.pat,
    EPS: f.eps,
    Debt: f.totalDebt,
    NetWorth: f.netWorth,
    OCF: f.operatingCashFlow,
    ROE: f.roe ?? (f.netWorth > 0 ? Number(((f.pat / f.netWorth) * 100).toFixed(1)) : 0),
    ROCE: f.roce ?? (f.netWorth + f.totalDebt > 0 ? Number(((f.ebit / (f.netWorth + f.totalDebt)) * 100).toFixed(1)) : 0),
  }));

  // Chart 7, 8, 9 Data: Peer Valuations
  const peerPeData = [
    { name: 'IPO (Current)', value: result.ipoPe, fill: '#2563eb' },
    ...result.peers.map((p, i) => ({
      name: p.name.length > 15 ? p.name.substring(0, 14) + '…' : p.name,
      value: p.pe,
      fill: COLORS[(i + 1) % COLORS.length],
    })),
  ];

  const peerPbData = [
    { name: 'IPO (Current)', value: result.ipoPb, fill: '#0891b2' },
    ...result.peers.map((p, i) => ({
      name: p.name.length > 15 ? p.name.substring(0, 14) + '…' : p.name,
      value: p.pb,
      fill: COLORS[(i + 2) % COLORS.length],
    })),
  ];

  const peerEvEbitdaData = [
    { name: 'IPO (Current)', value: result.ipoEvEbitda, fill: '#4f46e5' },
    ...result.peers.map((p, i) => ({
      name: p.name.length > 15 ? p.name.substring(0, 14) + '…' : p.name,
      value: p.evEbitda,
      fill: COLORS[(i + 3) % COLORS.length],
    })),
  ];

  // Chart 10: IPO Fund Utilization Donut
  const proceedsData = [
    { name: 'Capex Expansion', value: result.structure.capex || 0 },
    { name: 'Debt Repayment', value: result.structure.debtRepayment || 0 },
    { name: 'Working Capital', value: result.structure.workingCapital || 0 },
    { name: 'General Corporate', value: result.structure.generalCorporate || 0 },
  ].filter((item) => item.value > 0);

  // Fresh vs OFS Distribution
  const issueDistributionData = [
    { name: 'Fresh Issue (Company)', value: result.structure.freshIssue || 0, color: '#10b981' },
    { name: 'Offer for Sale (OFS)', value: result.structure.offerForSale || 0, color: '#f59e0b' },
  ].filter((item) => item.value > 0);

  // Chart 11: Score Breakdown Horizontal Data
  const scoreBreakdownData = [
    { category: 'Growth', score: result.categoryScores.growth.score, max: 20 },
    { category: 'Valuation', score: result.categoryScores.valuation.score, max: 20 },
    { category: 'Profitability', score: result.categoryScores.profitability.score, max: 15 },
    { category: 'Cash Flow', score: result.categoryScores.cashFlow.score, max: 10 },
    { category: 'Financial Health', score: result.categoryScores.financialHealth.score, max: 10 },
    { category: 'ROE / ROCE', score: result.categoryScores.roeRoce.score, max: 10 },
    { category: 'Business Quality', score: result.categoryScores.businessQuality.score, max: 5 },
    { category: 'IPO Structure', score: result.categoryScores.ipoStructure.score, max: 5 },
    { category: 'Risk Resilience', score: result.categoryScores.risk.score, max: 5 },
  ];

  // Chart 12: Risk Category Checklist Distribution
  const risksList = Object.entries(result.risks);
  const yesCount = risksList.filter(([_, v]) => v === 'yes').length;
  const noCount = risksList.filter(([_, v]) => v === 'no').length;
  const unknownCount = risksList.filter(([_, v]) => v === 'unknown').length;
  const riskStatusData = [
    { name: 'Clean / Negative Risk', count: noCount, color: '#10b981' },
    { name: 'Elevated Risk (Yes)', count: yesCount, color: '#ef4444' },
    { name: 'Uncertain / Unknown', count: unknownCount, color: '#94a3b8' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Financial & Valuation Visualizations
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Interactive multi-year trends, peer multiples benchmark, fund distribution, and score attribution
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto text-xs font-semibold">
          <button
            id="tab-chart-trends"
            onClick={() => setActiveTab('trends')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'trends' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Historical Trends
          </button>
          <button
            id="tab-chart-valuation"
            onClick={() => setActiveTab('valuation')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'valuation' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Peer Valuation
          </button>
          <button
            id="tab-chart-structure"
            onClick={() => setActiveTab('structure')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'structure' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            IPO Structure
          </button>
          <button
            id="tab-chart-scoring"
            onClick={() => setActiveTab('scoring')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'scoring' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Scores & Risks
          </button>
        </div>
      </div>

      {/* Tab 1: Historical Trends (Charts 1, 2, 3, 4, 5, 6) */}
      {activeTab === 'trends' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6 animate-in fade-in duration-300">
          
          {/* Chart 1: Revenue Growth */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/70">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-800">1. Revenue Growth Trend</h4>
                <p className="text-xs text-slate-500">Revenue (₹ Cr) across fiscal years (CAGR: {result.revenueCagr}%)</p>
              </div>
            </div>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={financialData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(value: any) => [`₹${value} Cr`, 'Revenue']} />
                  <Line type="monotone" dataKey="Revenue" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2 & 3: EBITDA & PAT Profitability */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/70">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-800">2 & 3. EBITDA & PAT Trend</h4>
                <p className="text-xs text-slate-500">Operating vs Net Profitability (₹ Cr)</p>
              </div>
            </div>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={financialData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(val: any) => [`₹${val} Cr`]} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="EBITDA" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="PAT" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: EPS Trend */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/70">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-800">4. Earnings Per Share (EPS) Trend</h4>
                <p className="text-xs text-slate-500">EPS in ₹ per share (CAGR: {result.epsCagr}%)</p>
              </div>
            </div>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={financialData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(val: any) => [`₹${val}`, 'EPS']} />
                  <Line type="monotone" dataKey="EPS" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 5: ROE vs ROCE Trend */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/70">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-800">5. ROE vs ROCE Capital Efficiency</h4>
                <p className="text-xs text-slate-500">Return on Equity vs Capital Employed (%)</p>
              </div>
            </div>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={financialData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(val: any) => [`${val}%`]} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="ROE" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="ROCE" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 6: Debt Trend & Balance Sheet */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/70 lg:col-span-2">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-800">6. Debt vs Net Worth (De-leveraging Analysis)</h4>
                <p className="text-xs text-slate-500">Total Borrowings vs Shareholders' Equity (₹ Cr)</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Latest D/E: {result.debtToEquity}x
              </span>
            </div>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={financialData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(val: any) => [`₹${val} Cr`]} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="TotalDebt" name="Total Debt" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="NetWorth" name="Net Worth" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Valuation vs Peers (Charts 7, 8, 9) */}
      {activeTab === 'valuation' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6 animate-in fade-in duration-300">
          
          {/* Chart 7: IPO vs Peer P/E */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/70">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-bold text-slate-800">7. Price to Earnings (P/E)</h4>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                {result.pePremiumDiscount > 0 ? `+${result.pePremiumDiscount}%` : `${result.pePremiumDiscount}%`}
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">IPO P/E vs Listed Industry Peers</p>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={peerPeData} layout="vertical" margin={{ top: 5, right: 15, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(val: any) => [`${val}x`, 'P/E Multiple']} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {peerPeData.map((entry, index) => (
                      <Cell key={`pe-cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 text-center">
              Peer Median: <strong>{result.peerMedianPe}x</strong> | IPO: <strong>{result.ipoPe}x</strong>
            </p>
          </div>

          {/* Chart 8: IPO vs Peer P/B */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/70">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-bold text-slate-800">8. Price to Book (P/B)</h4>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-cyan-100 text-cyan-800">
                {result.pbPremiumDiscount > 0 ? `+${result.pbPremiumDiscount}%` : `${result.pbPremiumDiscount}%`}
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">Valuation relative to net asset backing</p>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={peerPbData} layout="vertical" margin={{ top: 5, right: 15, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(val: any) => [`${val}x`, 'P/B Multiple']} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {peerPbData.map((entry, index) => (
                      <Cell key={`pb-cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 text-center">
              Peer Median: <strong>{result.peerMedianPb}x</strong> | IPO: <strong>{result.ipoPb}x</strong>
            </p>
          </div>

          {/* Chart 9: IPO vs Peer EV/EBITDA */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/70">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-bold text-slate-800">9. EV / EBITDA Multiple</h4>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                {result.evEbitdaPremiumDiscount > 0 ? `+${result.evEbitdaPremiumDiscount}%` : `${result.evEbitdaPremiumDiscount}%`}
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">Enterprise value relative to operating cash profit</p>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={peerEvEbitdaData} layout="vertical" margin={{ top: 5, right: 15, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(val: any) => [`${val}x`, 'EV/EBITDA Multiple']} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {peerEvEbitdaData.map((entry, index) => (
                      <Cell key={`evebitda-cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 text-center">
              Peer Median: <strong>{result.peerMedianEvEbitda}x</strong> | IPO: <strong>{result.ipoEvEbitda}x</strong>
            </p>
          </div>

        </div>
      )}

      {/* Tab 3: Structure & Proceeds (Charts 10 & Issue Distribution) */}
      {activeTab === 'structure' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6 animate-in fade-in duration-300">
          
          {/* Chart 10: Use of Proceeds Donut */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/70 flex flex-col items-center">
            <div className="w-full text-left mb-2">
              <h4 className="text-sm font-bold text-slate-800">10. IPO Proceeds Utilization</h4>
              <p className="text-xs text-slate-500">Target deployment of Fresh Issue capital</p>
            </div>
            <div className="h-64 w-full flex items-center justify-center">
              {proceedsData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={proceedsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {proceedsData.map((entry, index) => (
                        <Cell key={`proceeds-cell-${index}`} fill={PROCEEDS_COLORS[index % PROCEEDS_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val: any) => [`₹${val} Cr`]} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-slate-400 text-xs text-center">No proceed utilization data entered.</div>
              )}
            </div>
          </div>

          {/* Issue Composition: Fresh Issue vs OFS */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/70 flex flex-col items-center">
            <div className="w-full text-left mb-2">
              <h4 className="text-sm font-bold text-slate-800">Fresh Issue vs. Offer for Sale (OFS)</h4>
              <p className="text-xs text-slate-500">Corporate growth capital vs existing promoter monetization</p>
            </div>
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={issueDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {issueDistributionData.map((entry, index) => (
                      <Cell key={`issue-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: any) => [`₹${val} Cr`]} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 text-xs mt-1">
              <span className="text-emerald-700 font-semibold">Fresh: {result.freshIssuePercentage}%</span>
              <span className="text-amber-700 font-semibold">OFS: {result.ofsPercentage}%</span>
            </div>
          </div>

        </div>
      )}

      {/* Tab 4: Score Breakdown & Risk Charts (Charts 11 & 12) */}
      {activeTab === 'scoring' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6 animate-in fade-in duration-300">
          
          {/* Chart 11: Score Breakdown Horizontal Bar */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/70">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-bold text-slate-800">11. Score Contribution (100 Points)</h4>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-600 text-white">
                Total: {result.overallScore}/100
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">Points achieved vs Maximum points in each category</p>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreBreakdownData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" domain={[0, 20]} tick={{ fontSize: 10 }} />
                  <YAxis dataKey="category" type="category" width={110} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(val: any, name: any, item: any) => [`${val} / ${item.payload.max} pts`, 'Score']} />
                  <Bar dataKey="score" fill="#2563eb" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 12: Risk Factors Checklist Distribution */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/70 flex flex-col items-center">
            <div className="w-full text-left mb-2">
              <h4 className="text-sm font-bold text-slate-800">12. Risk Checklist Distribution</h4>
              <p className="text-xs text-slate-500">14-point audit of business and promoter governance flags</p>
            </div>
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="count"
                  >
                    {riskStatusData.map((entry, index) => (
                      <Cell key={`risk-pie-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: any) => [`${val} Factors`]} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-xs text-slate-600 font-medium">
              Overall Risk Meter: <strong className="text-slate-900">{result.riskLevel} Risk</strong> ({result.riskCount} flags noted)
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
