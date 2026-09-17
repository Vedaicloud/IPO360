import React from 'react';
import { Award, ShieldCheck, Cpu, Users, ArrowRight } from 'lucide-react';

interface AboutViewProps {
  onStartAnalysis: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onStartAnalysis }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 py-6">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          ABOUT IPO360
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Democratizing Primary Market Intelligence
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Built for modern retail and institutional investors who demand mathematical clarity, transparent attributions, and rigorous due diligence rather than emotional hype.
        </p>
      </div>

      {/* Core Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-1">Empirical Math, Not Opinions</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every metric is derived from audited figures. We show the exact formula, variable inputs, and sector benchmark so you can audit our work.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-1">Zero Conflict of Interest</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            We are not an investment bank, underwriting syndicate, or affiliate brokerage. We do not accept listing sponsorships or paid promotional rankings.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-1">Empowering Decision Makers</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Instead of telling you to buy or sell, we provide comprehensive decision checklists that respect your intelligence and individual risk profile.
          </p>
        </div>
      </div>

      {/* Methodology Statement */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-slate-900">The 100-Point Benchmark Framework</h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          The IPO360 scoring system partitions company health into 9 distinct analytical buckets: Growth Consistency (20 pts), Operating & PAT Margins (15 pts), Cash Flow Reliability (10 pts), Balance Sheet Health & Leverage (10 pts), Return on Equity and Capital Employed (10 pts), Valuation Multiples vs. Listed Peers (20 pts), Business Quality (5 pts), IPO Capital Utilization (5 pts), and Prospectus Risk Flags (5 pts).
        </p>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          By isolating market sentiment (GMP, retail subscriptions) from fundamental scoring, investors obtain an uncompromised view of true economic value.
        </p>
      </div>

      {/* Call to Action */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 text-center space-y-3">
        <h3 className="text-lg font-bold text-white">Ready to Audit Your First IPO?</h3>
        <p className="text-xs text-slate-300 max-w-md mx-auto">
          Start with our pre-loaded demo model or enter your target company's prospectus data.
        </p>
        <button
          onClick={onStartAnalysis}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors inline-flex items-center gap-1.5"
        >
          Open IPO Analyzer
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
