import React from 'react';
import { RiskLevel } from '../../types/ipo';
import { ShieldAlert, AlertTriangle, CheckCircle, AlertOctagon } from 'lucide-react';

interface RiskMeterProps {
  riskLevel: RiskLevel;
  riskCount: number;
  riskHighlights: string[];
}

export const RiskMeter: React.FC<RiskMeterProps> = ({ riskLevel, riskCount, riskHighlights }) => {
  const levels: { name: RiskLevel; label: string; color: string; bg: string; activeBorder: string }[] = [
    { name: 'Low', label: 'Low Risk', color: 'text-emerald-700', bg: 'bg-emerald-500', activeBorder: 'ring-emerald-400' },
    { name: 'Moderate', label: 'Moderate', color: 'text-amber-700', bg: 'bg-amber-500', activeBorder: 'ring-amber-400' },
    { name: 'Elevated', label: 'Elevated', color: 'text-orange-700', bg: 'bg-orange-500', activeBorder: 'ring-orange-400' },
    { name: 'High', label: 'High Risk', color: 'text-rose-700', bg: 'bg-rose-500', activeBorder: 'ring-rose-400' },
  ];

  const getRiskIcon = () => {
    switch (riskLevel) {
      case 'Low':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'Moderate':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'Elevated':
        return <ShieldAlert className="w-5 h-5 text-orange-600" />;
      case 'High':
        return <AlertOctagon className="w-5 h-5 text-rose-600" />;
    }
  };

  const getRiskDescription = () => {
    switch (riskLevel) {
      case 'Low':
        return 'Minimal operational or governance red flags flagged in entered disclosures.';
      case 'Moderate':
        return 'Standard business risks present (e.g. moderate concentration or industry competition).';
      case 'Elevated':
        return 'Multiple material cautions identified in leverage, customer concentration, or regulations.';
      case 'High':
        return 'Substantial risk factors detected (e.g., heavy indebtedness, negative cash flow, or legal litigation).';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {getRiskIcon()}
          <h3 className="text-base font-bold text-slate-900">Visual Risk Meter</h3>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
          {riskCount} of 14 Flags Noted
        </span>
      </div>

      {/* Segmented Meter Bar */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        {levels.map((lvl) => {
          const isActive = lvl.name === riskLevel;
          return (
            <div key={lvl.name} className="flex flex-col items-center">
              <div
                className={`h-3 w-full rounded-full transition-all ${
                  isActive ? `${lvl.bg} ring-2 ${lvl.activeBorder} shadow-xs scale-y-110` : 'bg-slate-200 opacity-60'
                }`}
              />
              <span
                className={`text-[11px] font-semibold mt-1.5 ${
                  isActive ? lvl.color : 'text-slate-400'
                }`}
              >
                {lvl.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Description text */}
      <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
        <div className="font-semibold text-slate-900 mb-1 flex items-center justify-between">
          <span>Assessment: <span className="underline decoration-blue-500 underline-offset-2">{riskLevel} Risk Profile</span></span>
        </div>
        <p>{getRiskDescription()}</p>

        {riskHighlights.length > 0 && (
          <div className="mt-2 pt-2 border-t border-slate-200/60">
            <span className="font-semibold text-slate-800 text-[11px] block mb-1">Key Flags in Focus:</span>
            <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-600">
              {riskHighlights.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <p className="text-[10px] text-slate-400 mt-2 text-center italic">
        Risk classification does not guarantee listing performance or future stock trajectory.
      </p>
    </div>
  );
};
