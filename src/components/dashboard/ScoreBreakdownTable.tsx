import React, { useState } from 'react';
import { IPOAnalysisResult, CategoryScore } from '../../types/ipo';
import { ChevronDown, ChevronUp, Calculator, HelpCircle, Check, AlertTriangle, AlertCircle } from 'lucide-react';
import { getScoreColorClass } from '../../lib/utils';

interface ScoreBreakdownTableProps {
  result: IPOAnalysisResult;
}

export const ScoreBreakdownTable: React.FC<ScoreBreakdownTableProps> = ({ result }) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const categories: { key: string; data: CategoryScore }[] = [
    { key: 'growth', data: result.categoryScores.growth },
    { key: 'profitability', data: result.categoryScores.profitability },
    { key: 'cashFlow', data: result.categoryScores.cashFlow },
    { key: 'financialHealth', data: result.categoryScores.financialHealth },
    { key: 'roeRoce', data: result.categoryScores.roeRoce },
    { key: 'valuation', data: result.categoryScores.valuation },
    { key: 'businessQuality', data: result.categoryScores.businessQuality },
    { key: 'ipoStructure', data: result.categoryScores.ipoStructure },
    { key: 'risk', data: result.categoryScores.risk },
  ];

  const toggleRow = (key: string) => {
    setExpandedRow(expandedRow === key ? null : key);
  };

  const getStatusIcon = (status: 'positive' | 'neutral' | 'caution') => {
    switch (status) {
      case 'positive':
        return <Check className="w-4 h-4 text-emerald-600" />;
      case 'neutral':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'caution':
        return <AlertCircle className="w-4 h-4 text-rose-600" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-600" />
            Transparent Scoring Attribution (100 Points)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Click any category to inspect the underlying formula, input variables, and sector benchmark
          </p>
        </div>
        <div className="text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/80 font-mono">
          Total Score: <strong className="text-blue-700 font-bold">{result.overallScore}</strong> / 100
        </div>
      </div>

      <div className="divide-y divide-slate-100 mt-3">
        {categories.map(({ key, data }) => {
          const colors = getScoreColorClass(data.score, data.maxScore);
          const isExpanded = expandedRow === key;

          return (
            <div key={key} className="py-3 transition-colors hover:bg-slate-50/50 rounded-xl px-2">
              <div 
                onClick={() => toggleRow(key)}
                className="flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1 rounded-md bg-slate-100 flex items-center justify-center">
                    {getStatusIcon(data.status)}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                      {data.name}
                    </h4>
                    <p className="text-xs text-slate-500 hidden sm:block">
                      {data.assessment}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className={`text-base font-bold font-mono ${colors.text}`}>
                      {data.score}
                    </span>
                    <span className="text-xs text-slate-400 font-medium"> / {data.maxScore}</span>
                  </div>

                  <div className="w-20 hidden md:block bg-slate-100 rounded-full h-2">
                    <div 
                      className={`h-full rounded-full ${colors.bar}`}
                      style={{ width: `${(data.score / data.maxScore) * 100}%` }}
                    />
                  </div>

                  <button className="text-slate-400 hover:text-slate-600 p-1">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Collapsible calculation detail */}
              {isExpanded && (
                <div className="mt-3 p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-2 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <span className="font-bold text-slate-700 block mb-0.5">Input Variables:</span>
                      <p className="text-slate-600 font-mono bg-white p-2 rounded border border-slate-200">
                        {data.input}
                      </p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-700 block mb-0.5">Underlying Formula:</span>
                      <p className="text-slate-600 font-mono bg-white p-2 rounded border border-slate-200">
                        {data.formula}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div>
                      <span className="font-bold text-slate-700 block mb-0.5">Sector Benchmark Standard:</span>
                      <p className="text-slate-600 bg-white p-2 rounded border border-slate-200">
                        {data.benchmark}
                      </p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-700 block mb-0.5">Analytical Assessment:</span>
                      <p className="text-slate-600 bg-white p-2 rounded border border-slate-200">
                        {data.assessment}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
