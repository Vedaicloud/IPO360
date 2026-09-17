import React, { useState } from 'react';
import { IPOFormData, IPOAnalysisResult } from '../../types/ipo';
import { runIPOAnalysis } from '../../lib/scoring/scoringEngine';
import { DEMO_COMPARISON_LIST } from '../../lib/demoData';
import { Scale, BarChart3, TrendingUp, ShieldAlert, Check, Plus, Trash2 } from 'lucide-react';
import { formatCurrency, formatPercent } from '../../lib/utils';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface CompareViewProps {
  currentAnalysis?: IPOAnalysisResult;
}

export const CompareView: React.FC<CompareViewProps> = ({ currentAnalysis }) => {
  // Compute initial comparison items
  const baseList: IPOAnalysisResult[] = DEMO_COMPARISON_LIST.map((item) => runIPOAnalysis(item));
  
  if (currentAnalysis && !baseList.some((b) => b.company.name === currentAnalysis.company.name)) {
    baseList.unshift(currentAnalysis);
  }

  const [comparedIpos, setComparedIpos] = useState<IPOAnalysisResult[]>(baseList.slice(0, 3));

  const removeIpo = (id: string) => {
    if (comparedIpos.length <= 2) {
      alert('At least 2 IPOs are required for side-by-side comparison.');
      return;
    }
    setComparedIpos(comparedIpos.filter((item) => item.id !== id));
  };

  // Prepare chart data
  const cagrChartData = comparedIpos.map((ipo) => ({
    name: ipo.company.name.split(' ')[0],
    'Revenue CAGR (%)': ipo.revenueCagr,
    'PAT CAGR (%)': ipo.profitCagr,
  }));

  const multiplesChartData = comparedIpos.map((ipo) => ({
    name: ipo.company.name.split(' ')[0],
    'P/E (x)': ipo.ipoPe,
    'EV/EBITDA (x)': ipo.ipoEvEbitda,
  }));

  const scoreChartData = comparedIpos.map((ipo) => ({
    name: ipo.company.name.split(' ')[0],
    'IPO360 Score': ipo.overallScore,
    'Valuation Score': ipo.valuationScore,
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <Scale className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Benchmarking Engine</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Side-by-Side IPO Comparison
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Objective matrix comparing growth, capital efficiency, leverage, and valuation multiples
          </p>
        </div>

        <div className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          Comparing <strong className="text-slate-900">{comparedIpos.length}</strong> companies (Max 5)
        </div>
      </div>

      {/* Comparison Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Revenue & PAT CAGR */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Growth: Revenue vs PAT CAGR (%)
          </h3>
          <p className="text-[11px] text-slate-500 mb-4">Historical expansion rates across reported years</p>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cagrChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val: any) => [`${val}%`]} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="Revenue CAGR (%)" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="PAT CAGR (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: P/E and EV/EBITDA */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Valuation: P/E & EV/EBITDA (x)
          </h3>
          <p className="text-[11px] text-slate-500 mb-4">Upper price band pricing multiples</p>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={multiplesChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val: any) => [`${val}x`]} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="P/E (x)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="EV/EBITDA (x)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: IPO360 Scores */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            IPO360 Total Score vs Valuation Score
          </h3>
          <p className="text-[11px] text-slate-500 mb-4">Total (out of 100) vs Valuation component (out of 20)</p>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val: any) => [`${val} pts`]} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="IPO360 Score" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Valuation Score" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Side-by-Side Comprehensive Comparison Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            Side-by-Side Comparative Metrics
          </h3>
          <span className="text-xs text-slate-400 italic">
            Sorted objectively without qualitative bias or automated ranking
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50 font-bold text-slate-700">
              <tr>
                <th className="py-3.5 px-4 text-left w-56">Metric</th>
                {comparedIpos.map((ipo) => (
                  <th key={ipo.id} className="py-3.5 px-4 text-center min-w-[200px]">
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-slate-900 text-sm">{ipo.company.name}</span>
                      <span className="text-[10px] text-blue-600 font-semibold">{ipo.company.sector}</span>
                      {comparedIpos.length > 2 && (
                        <button
                          onClick={() => removeIpo(ipo.id)}
                          className="text-slate-400 hover:text-rose-600 text-[10px] mt-1 flex items-center gap-0.5"
                        >
                          <Trash2 className="w-3 h-3" /> Remove
                        </button>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              
              {/* Overall Score */}
              <tr className="bg-blue-50/40">
                <td className="py-3 px-4 font-sans font-bold text-slate-900">IPO360 Score (100)</td>
                {comparedIpos.map((ipo) => (
                  <td key={ipo.id} className="py-3 px-4 text-center font-bold text-blue-700 text-base">
                    {ipo.overallScore} / 100
                  </td>
                ))}
              </tr>

              {/* Risk Level */}
              <tr>
                <td className="py-2.5 px-4 font-sans font-medium text-slate-800">Risk Meter</td>
                {comparedIpos.map((ipo) => (
                  <td key={ipo.id} className="py-2.5 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-sans font-semibold bg-slate-100 text-slate-800">
                      {ipo.riskLevel} Risk ({ipo.riskCount} flags)
                    </span>
                  </td>
                ))}
              </tr>

              {/* Issue Size */}
              <tr>
                <td className="py-2.5 px-4 font-sans font-medium text-slate-800">Total Issue Size</td>
                {comparedIpos.map((ipo) => (
                  <td key={ipo.id} className="py-2.5 px-4 text-center">
                    {formatCurrency(ipo.company.issueSize)}
                  </td>
                ))}
              </tr>

              {/* Fresh Issue % */}
              <tr>
                <td className="py-2.5 px-4 font-sans font-medium text-slate-800">Fresh Issue %</td>
                {comparedIpos.map((ipo) => (
                  <td key={ipo.id} className="py-2.5 px-4 text-center text-emerald-700 font-semibold">
                    {ipo.freshIssuePercentage}%
                  </td>
                ))}
              </tr>

              {/* OFS % */}
              <tr>
                <td className="py-2.5 px-4 font-sans font-medium text-slate-800">Offer for Sale (OFS) %</td>
                {comparedIpos.map((ipo) => (
                  <td key={ipo.id} className="py-2.5 px-4 text-center text-amber-700 font-semibold">
                    {ipo.ofsPercentage}%
                  </td>
                ))}
              </tr>

              {/* Revenue CAGR */}
              <tr className="bg-slate-50/50">
                <td className="py-2.5 px-4 font-sans font-medium text-slate-800">Revenue CAGR</td>
                {comparedIpos.map((ipo) => (
                  <td key={ipo.id} className="py-2.5 px-4 text-center font-bold text-blue-700">
                    {ipo.revenueCagr}%
                  </td>
                ))}
              </tr>

              {/* Profit CAGR */}
              <tr>
                <td className="py-2.5 px-4 font-sans font-medium text-slate-800">PAT / Profit CAGR</td>
                {comparedIpos.map((ipo) => (
                  <td key={ipo.id} className="py-2.5 px-4 text-center text-emerald-700">
                    {ipo.profitCagr}%
                  </td>
                ))}
              </tr>

              {/* Latest EBITDA Margin */}
              <tr>
                <td className="py-2.5 px-4 font-sans font-medium text-slate-800">EBITDA Margin</td>
                {comparedIpos.map((ipo) => (
                  <td key={ipo.id} className="py-2.5 px-4 text-center">
                    {ipo.latestEbitdaMargin}%
                  </td>
                ))}
              </tr>

              {/* Latest PAT Margin */}
              <tr>
                <td className="py-2.5 px-4 font-sans font-medium text-slate-800">PAT Margin</td>
                {comparedIpos.map((ipo) => (
                  <td key={ipo.id} className="py-2.5 px-4 text-center">
                    {ipo.latestPatMargin}%
                  </td>
                ))}
              </tr>

              {/* ROE */}
              <tr className="bg-slate-50/50">
                <td className="py-2.5 px-4 font-sans font-medium text-slate-800">Return on Equity (ROE)</td>
                {comparedIpos.map((ipo) => (
                  <td key={ipo.id} className="py-2.5 px-4 text-center font-bold">
                    {ipo.latestRoe.toFixed(1)}%
                  </td>
                ))}
              </tr>

              {/* ROCE */}
              <tr>
                <td className="py-2.5 px-4 font-sans font-medium text-slate-800">ROCE</td>
                {comparedIpos.map((ipo) => (
                  <td key={ipo.id} className="py-2.5 px-4 text-center font-bold">
                    {ipo.latestRoce.toFixed(1)}%
                  </td>
                ))}
              </tr>

              {/* Debt/Equity */}
              <tr>
                <td className="py-2.5 px-4 font-sans font-medium text-slate-800">Debt / Equity Ratio</td>
                {comparedIpos.map((ipo) => (
                  <td key={ipo.id} className="py-2.5 px-4 text-center">
                    {ipo.debtToEquity}x
                  </td>
                ))}
              </tr>

              {/* P/E */}
              <tr className="bg-slate-50/50">
                <td className="py-2.5 px-4 font-sans font-medium text-slate-800">Price to Earnings (P/E)</td>
                {comparedIpos.map((ipo) => (
                  <td key={ipo.id} className="py-2.5 px-4 text-center font-bold text-indigo-700">
                    {ipo.ipoPe}x
                  </td>
                ))}
              </tr>

              {/* P/B */}
              <tr>
                <td className="py-2.5 px-4 font-sans font-medium text-slate-800">Price to Book (P/B)</td>
                {comparedIpos.map((ipo) => (
                  <td key={ipo.id} className="py-2.5 px-4 text-center">
                    {ipo.ipoPb}x
                  </td>
                ))}
              </tr>

              {/* EV/EBITDA */}
              <tr>
                <td className="py-2.5 px-4 font-sans font-medium text-slate-800">EV / EBITDA</td>
                {comparedIpos.map((ipo) => (
                  <td key={ipo.id} className="py-2.5 px-4 text-center">
                    {ipo.ipoEvEbitda}x
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
