import React, { useState } from 'react';
import { IPOAnalysisResult } from '../../types/ipo';
import { 
  CheckCircle, 
  AlertTriangle, 
  AlertOctagon, 
  FileSearch, 
  CheckSquare, 
  Square, 
  TrendingUp, 
  HelpCircle 
} from 'lucide-react';

interface FactorsAndChecklistProps {
  result: IPOAnalysisResult;
}

export const FactorsAndChecklist: React.FC<FactorsAndChecklistProps> = ({ result }) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const defaultChecklist = [
    { id: 'c1', label: 'Understand the core revenue driver and end-customer profile' },
    { id: 'c2', label: 'Review historical revenue and net profit consistency' },
    { id: 'c3', label: 'Confirm positive operating cash flow generation' },
    { id: 'c4', label: 'Inspect debt serviceability and total borrowings' },
    { id: 'c5', label: 'Examine capital return ratios (ROE & ROCE) against peers' },
    { id: 'c6', label: 'Compare IPO P/E, P/B, and EV/EBITDA against listed industry peers' },
    { id: 'c7', label: 'Inspect IPO fund utilization schedule in the DRHP/RHP' },
    { id: 'c8', label: 'Check proportion of Fresh Issue (new growth capital) vs OFS (promoter exit)' },
    { id: 'c9', label: 'Audit promoter track record, litigation, and share pledging' },
    { id: 'c10', label: 'Review Section III ("Risk Factors") in the official offer document' },
    { id: 'c11', label: 'Assess personal risk tolerance and required investment horizon' },
  ];

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <div className="space-y-6">
      
      {/* 2-Column: Positive Factors & Caution Factors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Positive Factors Card */}
        <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-emerald-50">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Positive Factors</h3>
              <p className="text-xs text-slate-500">Data-driven fundamental strengths identified</p>
            </div>
          </div>

          {result.positiveFactors.length > 0 ? (
            <ul className="space-y-2.5 text-xs text-slate-700">
              {result.positiveFactors.map((factor, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                  <span className="leading-relaxed">{factor}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400 italic">No significant positive metrics flagged above benchmark.</p>
          )}
        </div>

        {/* Caution Factors Card */}
        <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-amber-50">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Caution Factors</h3>
              <p className="text-xs text-slate-500">Areas warranting deeper investor verification</p>
            </div>
          </div>

          {result.cautionFactors.length > 0 ? (
            <ul className="space-y-2.5 text-xs text-slate-700">
              {result.cautionFactors.map((factor, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                  <span className="leading-relaxed">{factor}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400 italic">No major caution factors triggered by standard benchmark thresholds.</p>
          )}
        </div>

      </div>

      {/* Market Sentiment Indicator Card (Separated from fundamental score) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">Market Sentiment Indicator (Unofficial)</h3>
              <p className="text-xs text-slate-500">Grey Market Premium (GMP) & Subscription Data</p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
            Excluded from Fundamental Score
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-4">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
            <span className="text-[11px] text-slate-500 font-medium block">GMP Premium</span>
            <span className="text-lg font-bold text-indigo-700 font-mono">
              {result.marketData.gmp ? `₹${result.marketData.gmp}` : 'N/A'}
            </span>
            <span className="text-[10px] text-slate-400 block">
              {result.marketData.gmpPercentage ? `(${result.marketData.gmpPercentage}%)` : ''}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
            <span className="text-[11px] text-slate-500 font-medium block">QIB Subscription</span>
            <span className="text-lg font-bold text-slate-800 font-mono">
              {result.marketData.qibSubscription ? `${result.marketData.qibSubscription}x` : 'N/A'}
            </span>
            <span className="text-[10px] text-slate-400 block">Institutional</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
            <span className="text-[11px] text-slate-500 font-medium block">NII Subscription</span>
            <span className="text-lg font-bold text-slate-800 font-mono">
              {result.marketData.niiSubscription ? `${result.marketData.niiSubscription}x` : 'N/A'}
            </span>
            <span className="text-[10px] text-slate-400 block">High Net-worth</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
            <span className="text-[11px] text-slate-500 font-medium block">Retail Sub</span>
            <span className="text-lg font-bold text-slate-800 font-mono">
              {result.marketData.retailSubscription ? `${result.marketData.retailSubscription}x` : 'N/A'}
            </span>
            <span className="text-[10px] text-slate-400 block">Individual Investors</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 col-span-2 sm:col-span-1">
            <span className="text-[11px] text-slate-500 font-medium block">Listing Exchange</span>
            <span className="text-sm font-bold text-slate-800 font-mono block mt-1">
              {result.company.listingExchange || 'NSE & BSE'}
            </span>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 mt-3 italic bg-slate-50/80 p-2.5 rounded-lg border border-slate-200/60">
          "GMP is an unofficial market indicator that fluctuates rapidly. It does not guarantee listing performance or investment returns. IPO360 prioritizes audited balance sheet fundamentals over secondary sentiment."
        </p>
      </div>

      {/* Things to Verify Before Investing (from DRHP) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
          <FileSearch className="w-5 h-5 text-blue-600" />
          <div>
            <h3 className="text-base font-bold text-slate-900">Things to Verify in the DRHP / Prospectus</h3>
            <p className="text-xs text-slate-500">Crucial sections in the offer document prior to submitting bids</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
          {result.thingsToVerify.map((item, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Investor Decision Checklist (Section 23 Mandate) */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl shadow-md p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-700/80 gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Due Diligence Framework</span>
            <h3 className="text-xl font-black tracking-tight text-white mt-0.5">Investor Decision Checklist</h3>
            <p className="text-xs text-slate-300 mt-1">
              Complete these critical checks before deploying your hard-earned capital.
            </p>
          </div>
          <div className="bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/10 text-xs font-semibold self-start sm:self-auto">
            Completed: <strong className="text-cyan-300">{completedCount}</strong> of {defaultChecklist.length}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
          {defaultChecklist.map((item) => {
            const isChecked = !!checkedItems[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-3 rounded-xl border cursor-pointer select-none transition-all flex items-start gap-3 text-xs ${
                  isChecked
                    ? 'bg-cyan-950/40 border-cyan-500/60 text-cyan-100'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                <div className="mt-0.5 flex-shrink-0 text-cyan-400">
                  {isChecked ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-slate-400" />}
                </div>
                <span className={`leading-relaxed ${isChecked ? 'line-through opacity-80' : ''}`}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-5 border-t border-slate-700/80 text-center">
          <p className="text-sm font-semibold text-cyan-200">
            "Use this analysis as one input into your own independent investment decision."
          </p>
          <p className="text-xs text-slate-400 mt-1">
            IPO360 does not provide Buy, Sell, or Hold recommendations. Financial responsibility rests with the investor.
          </p>
        </div>
      </div>

    </div>
  );
};
