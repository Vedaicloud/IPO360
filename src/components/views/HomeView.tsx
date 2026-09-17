import React from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  ShieldCheck, 
  Layers, 
  ArrowRight, 
  CheckCircle, 
  Sparkles, 
  FileText, 
  PieChart, 
  Activity, 
  DollarSign, 
  Scale, 
  HelpCircle,
  Award
} from 'lucide-react';
import { IPOAnalysisResult } from '../../types/ipo';
import { formatCurrency } from '../../lib/utils';

interface HomeViewProps {
  sampleResult: IPOAnalysisResult;
  onStartAnalysis: () => void;
  onLoadDemo: () => void;
  onNavigate: (view: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  sampleResult,
  onStartAnalysis,
  onLoadDemo,
  onNavigate,
}) => {
  const analysisCards = [
    { title: 'Revenue Growth', desc: 'CAGR expansion over 3–5 reported fiscal years', icon: TrendingUp },
    { title: 'Profit Growth', desc: 'EBITDA and PAT bottom-line consistency', icon: Activity },
    { title: 'EBITDA Margin', desc: 'Core operational margin resilience and scale', icon: Layers },
    { title: 'PAT Margin', desc: 'Net profit retention after depreciation and tax', icon: DollarSign },
    { title: 'Cash Flow Quality', desc: 'Operating Cash Flow (CFO) relative to reported PAT', icon: CheckCircle },
    { title: 'Debt & Leverage', desc: 'Total debt to net worth and interest coverage ratios', icon: ShieldCheck },
    { title: 'ROE & ROCE', desc: 'Return on Equity and Capital Employed benchmarks', icon: Award },
    { title: 'EPS Dilution', desc: 'Historical Earnings Per Share trajectory', icon: BarChart3 },
    { title: 'P/E Multiple', desc: 'Price to Earnings relative to sector and peers', icon: Scale },
    { title: 'P/B Multiple', desc: 'Price to Book value per share evaluation', icon: FileText },
    { title: 'EV / EBITDA', desc: 'Enterprise multiple accounting for net debt', icon: PieChart },
    { title: 'Peer Comparison', desc: 'Side-by-side valuation benchmarking with 1–5 listed peers', icon: Layers },
    { title: 'IPO Structure', desc: 'Fresh Issue capital vs existing promoter OFS exit %', icon: PieChart },
    { title: 'Risk Factors Audit', desc: '14-point qualitative governance and operational flags', icon: ShieldCheck },
  ];

  const steps = [
    {
      step: '01',
      title: 'Enter IPO Data',
      desc: 'Input company details, price band, issue size, and prospectus links.',
    },
    {
      step: '02',
      title: 'Analyze Financials',
      desc: 'Enter 3–5 years of Restated Financials to auto-compute CAGRs, margins, and cash trends.',
    },
    {
      step: '03',
      title: 'Compare Valuation',
      desc: 'Benchmark IPO P/E, P/B, and EV/EBITDA against peer median multiples.',
    },
    {
      step: '04',
      title: 'Understand Risks',
      desc: 'Audit 14 critical governance, legal, and operational flags with the Risk Meter.',
    },
    {
      step: '05',
      title: 'Review the Final Report',
      desc: 'Access transparent 100-point attribution, factual factors, and investor checklists.',
    },
  ];

  return (
    <div className="space-y-20 py-4">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FINTECH INTELLIGENCE FOR PRIMARY MARKETS</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] mb-6">
            Analyze Any IPO <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500">
              Before You Invest
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
            Enter financial and IPO data to understand growth, profitability, valuation, risk and overall fundamentals. No black-box algorithms. No unsolicited buy/sell calls.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              id="hero-primary-analyze-btn"
              onClick={onStartAnalysis}
              className="w-full sm:w-auto px-8 py-3.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 group"
            >
              Analyze an IPO
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              id="hero-how-it-works-btn"
              onClick={() => {
                const el = document.getElementById('how-it-works-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs transition-all"
            >
              How It Works
            </button>

            <button
              id="hero-view-demo-btn"
              onClick={onLoadDemo}
              className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-cyan-800 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 rounded-xl transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-cyan-600" />
              Explore Demo Dashboard
            </button>
          </div>

          <p className="text-xs text-slate-400 mt-4">
            Tagline: "Understand the IPO. Analyze the Numbers. Decide for Yourself."
          </p>
        </div>

        {/* Interactive Sample Dashboard Preview */}
        <div className="max-w-5xl mx-auto mt-12 px-4 sm:px-6">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-8 text-left relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Sample Analysis Preview • Demo Data
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  {sampleResult.company.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Issue Price: ₹{sampleResult.company.ipoPrice} • Issue Size: {formatCurrency(sampleResult.company.issueSize)} • Sector: {sampleResult.company.sector}
                </p>
              </div>

              <button
                onClick={onLoadDemo}
                className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-blue-600 rounded-xl transition-colors self-start sm:self-auto"
              >
                Inspect Full Analysis →
              </button>
            </div>

            {/* Quick 5 Metric Preview Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 my-6">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Overall Score</span>
                <span className="text-2xl font-black text-blue-700 font-mono">
                  {sampleResult.overallScore}<span className="text-sm text-slate-400">/100</span>
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Fundamentally Solid</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Growth Score</span>
                <span className="text-2xl font-black text-emerald-600 font-mono">
                  {sampleResult.categoryScores.growth.score}<span className="text-sm text-slate-400">/20</span>
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">{sampleResult.revenueCagr}% Rev CAGR</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Valuation Score</span>
                <span className="text-2xl font-black text-indigo-600 font-mono">
                  {sampleResult.categoryScores.valuation.score}<span className="text-sm text-slate-400">/20</span>
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">{sampleResult.ipoPe}x P/E</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Financial Health</span>
                <span className="text-2xl font-black text-slate-800 font-mono">
                  {sampleResult.debtToEquity}x
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Conservative Debt</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 col-span-2 sm:col-span-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Risk Meter</span>
                <span className="text-lg font-black text-amber-600 block mt-1">
                  {sampleResult.riskLevel} Risk
                </span>
                <span className="text-[10px] text-slate-400 block">{sampleResult.riskCount} flags noted</span>
              </div>
            </div>

            {/* Factual Highlights Snippet */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/70 text-emerald-900">
                <span className="font-bold block mb-1">Key Positive Observation:</span>
                <p>{sampleResult.positiveFactors[0] || 'Strong revenue expansion.'}</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/70 text-amber-900">
                <span className="font-bold block mb-1">Key Caution Observation:</span>
                <p>{sampleResult.cautionFactors[0] || 'Customer concentration noted.'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: How IPO360 Works (5 Steps) */}
      <section id="how-it-works-section" className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Methodology</span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
            How IPO360 Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            A structured, repeatable five-step quantitative framework turning prospectuses into clarity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {steps.map((s) => (
            <div 
              key={s.step} 
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 relative flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <span className="text-2xl font-black text-blue-600/30 font-mono block mb-2">
                  {s.step}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mb-2">
                  {s.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section: What We Analyze */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Comprehensive Coverage</span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
            What We Analyze
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            14 analytical dimensions evaluating operating leverage, earnings quality, and prospectus fine print.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {analysisCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 hover:border-blue-300 transition-colors"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 mb-1">{card.title}</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">{card.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Philosophy Callout: Objective Decision Support */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Investor Autonomy</span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Why We Never Say "BUY" or "DO NOT BUY"
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Every investor carries unique risk profiles, tax horizons, and return requirements. Binary advice ignores portfolio context. IPO360 equips you with empirical calculations, peer benchmarks, and an exhaustive decision checklist — leaving the final judgment where it belongs: in your hands.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={onStartAnalysis}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                Launch IPO Analyzer
              </button>
              <button
                onClick={() => onNavigate('guide')}
                className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl transition-colors"
              >
                Read Educational DRHP Guide
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
