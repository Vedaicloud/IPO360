import React from 'react';
import { IPOAnalysisResult } from '../../types/ipo';
import { Award, TrendingUp, DollarSign, Activity, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getScoreColorClass } from '../../lib/utils';

interface ScoreGaugesProps {
  result: IPOAnalysisResult;
}

export const ScoreGauges: React.FC<ScoreGaugesProps> = ({ result }) => {
  const overallColors = getScoreColorClass(result.overallScore, 100);
  const fundamentalColors = getScoreColorClass(result.fundamentalScore, 75);
  const valuationColors = getScoreColorClass(result.valuationScore, 20);

  const getScoreVerdict = (score: number) => {
    if (score >= 80) return 'Exceptional Metrics';
    if (score >= 70) return 'Solid Fundamentals';
    if (score >= 55) return 'Balanced with Cautions';
    if (score >= 40) return 'Below Average / High Caution';
    return 'Significant Red Flags';
  };

  return (
    <div className="space-y-4">
      {/* Notice Banner */}
      <div className="bg-blue-50/80 border border-blue-200/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-blue-900">
        <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Analytical Framework Notice:</strong> IPO360 Score is a transparent quantitative benchmark based purely on the historical data and prospectus inputs entered. It does not predict future share price or guarantee investment returns.
        </div>
      </div>

      {/* Top 4 Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Overall IPO360 Score */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Overall Score</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          
          <div className="my-2 flex items-baseline gap-2">
            <span className={`text-4xl font-black tracking-tight ${overallColors.text}`}>
              {result.overallScore}
            </span>
            <span className="text-slate-400 font-semibold text-lg">/ 100</span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-2">
            <div 
              className={`h-full ${overallColors.bar} transition-all duration-700`}
              style={{ width: `${result.overallScore}%` }}
            />
          </div>

          <span className={`text-xs font-semibold px-2 py-0.5 rounded-md self-start border ${overallColors.badge}`}>
            {getScoreVerdict(result.overallScore)}
          </span>
        </div>

        {/* Card 2: Fundamental Score */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Fundamentals</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          
          <div className="my-2 flex items-baseline gap-2">
            <span className={`text-3xl font-black tracking-tight ${fundamentalColors.text}`}>
              {result.fundamentalScore}
            </span>
            <span className="text-slate-400 font-semibold text-base">/ 75</span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-2">
            <div 
              className={`h-full ${fundamentalColors.bar} transition-all duration-700`}
              style={{ width: `${(result.fundamentalScore / 75) * 100}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-500">
            Growth, Margins, Cash Flow & Balance Sheet Health
          </p>
        </div>

        {/* Card 3: Valuation Score */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Valuation Score</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          
          <div className="my-2 flex items-baseline gap-2">
            <span className={`text-3xl font-black tracking-tight ${valuationColors.text}`}>
              {result.valuationScore}
            </span>
            <span className="text-slate-400 font-semibold text-base">/ 20</span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-2">
            <div 
              className={`h-full ${valuationColors.bar} transition-all duration-700`}
              style={{ width: `${(result.valuationScore / 20) * 100}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-500">
            {result.pePremiumDiscount > 0
              ? `${result.pePremiumDiscount}% premium to peer median P/E`
              : `${Math.abs(result.pePremiumDiscount)}% discount to peer median P/E`}
          </p>
        </div>

        {/* Card 4: Data Completeness Indicator */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Data Completeness</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-slate-800">
              {result.dataCompleteness}%
            </span>
            <span className="text-xs text-slate-500">Audit Coverage</span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-2">
            <div 
              className={`h-full ${result.dataCompleteness >= 80 ? 'bg-blue-600' : 'bg-amber-500'} transition-all duration-700`}
              style={{ width: `${result.dataCompleteness}%` }}
            />
          </div>

          <div className="text-[11px] text-slate-500">
            {result.missingFields.length === 0 ? (
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> All major inputs verified
              </span>
            ) : (
              <span>{result.missingFields.length} optional fields pending</span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
