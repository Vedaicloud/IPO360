import React, { useState } from 'react';
import { IPOAnalysisResult } from '../../types/ipo';
import { ScoreGauges } from '../dashboard/ScoreGauges';
import { RiskMeter } from '../dashboard/RiskMeter';
import { ScoreBreakdownTable } from '../dashboard/ScoreBreakdownTable';
import { FinancialCharts } from '../charts/FinancialCharts';
import { FactorsAndChecklist } from '../dashboard/FactorsAndChecklist';
import { 
  Printer, 
  Share2, 
  Edit3, 
  ExternalLink, 
  Building2, 
  Calendar, 
  ShieldAlert, 
  Check, 
  FileText,
  Sparkles,
  Scale
} from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

interface ResultsDashboardViewProps {
  result: IPOAnalysisResult;
  onEdit: () => void;
  onCompareWithOthers: () => void;
}

export const ResultsDashboardView: React.FC<ResultsDashboardViewProps> = ({
  result,
  onEdit,
  onCompareWithOthers,
}) => {
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const summary = `IPO360 Analysis Report: ${result.company.name}
Overall Score: ${result.overallScore}/100 | Risk: ${result.riskLevel}
Revenue CAGR: ${result.revenueCagr}% | P/E: ${result.ipoPe}x (${result.pePremiumDiscount > 0 ? '+' : ''}${result.pePremiumDiscount}% vs peer median)
Fresh Issue: ${result.freshIssuePercentage}% | OFS: ${result.ofsPercentage}%
Analyzed on IPO360.`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header Overview Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              {result.company.sector}
            </span>
            {result.company.industry && (
              <span className="text-xs text-slate-500 font-medium">
                • {result.company.industry}
              </span>
            )}
            <span className="text-xs text-slate-400">
              • Listing: {result.company.listingExchange || 'NSE & BSE'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            {result.company.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 font-medium">
            <span>Issue Price: <strong className="text-slate-900 font-mono">₹{result.company.ipoPrice}</strong></span>
            <span>Issue Size: <strong className="text-slate-900 font-mono">{formatCurrency(result.company.issueSize)}</strong></span>
            {result.company.priceBandMin > 0 && result.company.priceBandMax > 0 && (
              <span>Price Band: <strong className="text-slate-900 font-mono">₹{result.company.priceBandMin} - ₹{result.company.priceBandMax}</strong></span>
            )}
            {result.company.drhpUrl && (
              <a 
                href={result.company.drhpUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="text-blue-600 hover:underline flex items-center gap-1"
              >
                DRHP Prospectus <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 no-print">
          <button
            id="result-edit-inputs-btn"
            onClick={onEdit}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Inputs
          </button>
          <button
            id="result-compare-btn"
            onClick={onCompareWithOthers}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-colors"
          >
            <Scale className="w-3.5 h-3.5" />
            Compare Peers
          </button>
          <button
            id="result-share-btn"
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            {copied ? 'Summary Copied!' : 'Share'}
          </button>
          <button
            id="result-print-btn"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / PDF Report
          </button>
        </div>
      </div>

      {/* Top Scores & Risk Meter Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ScoreGauges result={result} />
        </div>
        <div>
          <RiskMeter 
            riskLevel={result.riskLevel} 
            riskCount={result.riskCount} 
            riskHighlights={result.riskHighlights} 
          />
        </div>
      </div>

      {/* Transparent Score Breakdown (100 Points) */}
      <ScoreBreakdownTable result={result} />

      {/* Financial & Valuation Interactive Visualizations (12 Charts) */}
      <FinancialCharts result={result} />

      {/* Positive Factors, Caution Factors, Sentiment & Investor Checklist */}
      <FactorsAndChecklist result={result} />

      {/* Prominent Legal Disclaimer Banner */}
      <div className="bg-slate-100/90 rounded-2xl border border-slate-200 p-5 text-xs text-slate-600 leading-relaxed">
        <div className="flex items-center gap-2 font-bold text-slate-800 mb-1">
          <ShieldAlert className="w-4 h-4 text-blue-600" />
          <span>IPO360 Compliance Notice</span>
        </div>
        <p>
          "IPO360 provides educational and analytical information based on user-provided data. The scores, calculations and observations are not a guarantee of future performance, listing gains or investment returns. Users should independently review the offer documents, financial statements, risk factors and other relevant information and consider their own circumstances before making an investment decision."
        </p>
      </div>

    </div>
  );
};
