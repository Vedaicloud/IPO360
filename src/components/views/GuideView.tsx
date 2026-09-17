import React, { useState } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  FileText, 
  PieChart, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  DollarSign, 
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const GuideView: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const redFlags = [
    {
      title: '1. Heavy Offer for Sale (OFS) vs Minimal Fresh Issue',
      desc: 'When promoters or early PE funds offload 80-100% of the total issue with zero fresh capital flowing into company operations, the primary beneficiary is the exiting sellers rather than company expansion.',
    },
    {
      title: '2. Sudden Pre-IPO Profit Spikes (Window Dressing)',
      desc: 'Be skeptical if a company reports modest 5% profit margins for two years, and then magically expands to 22% in the immediate pre-IPO fiscal year by slashing marketing or deferring depreciation expenses.',
    },
    {
      title: '3. Divergence Between Accounting Profit and Cash Flow',
      desc: 'Consistently reporting high Net Profit (PAT) while Operating Cash Flow (CFO) is negative or shrinking indicates aggressive revenue recognition, unpaid receivables, or uncollected inventory buildup.',
    },
    {
      title: '4. High Debt or Overleveraged Balance Sheet',
      desc: 'A Debt-to-Equity ratio exceeding 1.5x to 2.0x in non-banking businesses leaves little margin of safety if macroeconomic cycles turn or interest rates rise.',
    },
    {
      title: '5. Excessive Related Party Transactions',
      desc: 'Material loans, purchases, or licensing fees paid to promoter-owned private shell companies or family trusts create significant corporate governance and siphoning risks.',
    },
    {
      title: '6. High Customer or Supplier Concentration',
      desc: 'If the top 3 clients account for over 50% of top-line revenue without long-term multi-year lock-in agreements, the loss of a single contract could devastate profitability.',
    },
    {
      title: '7. Significant Material Litigations or Tax Demands',
      desc: 'Inspect Section III of the DRHP. Unresolved GST or income tax disputes exceeding the company net worth pose existential solvency hazards.',
    },
  ];

  const guideSections = [
    {
      icon: FileText,
      title: 'How to Read an IPO DRHP / Prospectus',
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            The <strong>Draft Red Herring Prospectus (DRHP)</strong> is a comprehensive legal document submitted to SEBI and stock exchanges before an initial public offering. Rather than reading all 400+ pages, seasoned fundamental analysts target these key sections:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
            <li><strong>Section III – Risk Factors:</strong> Lists internal operational vulnerabilities, litigations, and external regulatory headwinds in order of material importance.</li>
            <li><strong>Objects of the Issue:</strong> Details the exact rupee allocation between Debt Repayment, Capital Expenditure, Working Capital, and General Corporate Purposes.</li>
            <li><strong>Restated Financial Statements:</strong> 3 to 5 years of audited Balance Sheets, Profit & Loss, and Cash Flow Statements restated under consistent accounting norms.</li>
            <li><strong>Management Discussion & Analysis (MD&A):</strong> Management commentary explaining why revenues expanded or contracted in prior fiscal periods.</li>
          </ul>
        </div>
      ),
    },
    {
      icon: PieChart,
      title: 'Fresh Issue vs Offer for Sale (OFS): Why It Matters',
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            An IPO issue size is split between two distinct components:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-2 text-xs">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <strong className="text-emerald-900 block mb-1">Fresh Issue (Growth Capital)</strong>
              <p className="text-emerald-800">
                The company issues newly created shares. Money raised goes directly to the company bank account for factory setup, technology investments, or paying down high-cost borrowings.
              </p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
              <strong className="text-amber-900 block mb-1">Offer for Sale / OFS (Promoter Liquidity)</strong>
              <p className="text-amber-800">
                Existing shareholders (founders, venture capital funds) sell their personal shareholding. Money raised goes directly into the sellers' pockets, not the business balance sheet.
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-500 italic">
            Rule of thumb: A higher percentage of Fresh Issue (e.g., &gt;60-70%) is generally viewed positively because it funds long-term enterprise value creation.
          </p>
        </div>
      ),
    },
    {
      icon: DollarSign,
      title: 'Valuation Multiples: P/E, P/B, and EV/EBITDA Demystified',
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            Never judge an IPO as "cheap" or "expensive" based purely on the nominal share price (e.g. ₹50 vs ₹1,000). Always evaluate relative multiples:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs text-slate-700">
            <li>
              <strong>Price-to-Earnings (P/E) = Issue Price / EPS:</strong> Tells you how many rupees investors pay for each rupee of annual net profit. Always compare with listed peers in the same industry.
            </li>
            <li>
              <strong>Price-to-Book (P/B) = Issue Price / Book Value Per Share:</strong> Compares valuation with net asset value. Crucial for asset-heavy and financial sector companies (Banks, NBFCs).
            </li>
            <li>
              <strong>EV / EBITDA = Enterprise Value / Operating Cash Earnings:</strong> Incorporates debt obligations. Ideal for comparing companies with differing debt levels and tax structures.
            </li>
          </ul>
        </div>
      ),
    },
    {
      icon: TrendingUp,
      title: 'Why Cash Flow Matters More Than Accounting Profit',
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            Accrual accounting allows companies to record revenue the moment an invoice is generated, even if the customer hasn't paid cash. <strong>Cash Flow from Operations (CFO)</strong> measures actual liquid cash entering the bank account.
          </p>
          <p>
            If a company shows ₹100 Crore in Net Profit but negative ₹20 Crore in Operating Cash Flow, it may be trapped in customer defaults, unsold inventory, or delayed collections. A high-quality business consistently converts 70-100% of reported PAT into cash.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10 py-4">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
          <BookOpen className="w-3.5 h-3.5" />
          <span>INVESTOR EDUCATION</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          The Pragmatic IPO Analysis Guide
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Master the fundamentals of reading prospectus filings, auditing corporate governance, and identifying red flags before submitting an IPO application.
        </p>
      </div>

      {/* Core Educational Modules */}
      <div className="space-y-4">
        {guideSections.map((sec, idx) => {
          const Icon = sec.icon;
          const isOpen = openFaq === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(isOpen ? null : idx)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 select-none hover:bg-slate-50/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{sec.title}</h3>
                </div>
                <div className="text-slate-400">
                  {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {isOpen && (
                <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 bg-slate-50/30">
                  {sec.content}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Top 7 Common IPO Red Flags */}
      <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-rose-50">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Top 7 Common IPO Red Flags to Audit</h2>
            <p className="text-xs text-slate-500">Examine these warning signs before committing capital</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {redFlags.map((rf, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-rose-50/40 border border-rose-100 text-slate-800 space-y-1.5"
            >
              <h4 className="text-xs font-bold text-rose-950">{rf.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{rf.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Philosophy Statement */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 text-center space-y-3">
        <h3 className="text-lg font-bold text-white">Empower Your Financial Judgment</h3>
        <p className="text-xs text-slate-300 max-w-2xl mx-auto leading-relaxed">
          "The secret to investing is not finding someone with hot tips; it is having the patience and discipline to analyze the underlying balance sheet before the crowd."
        </p>
      </div>

    </div>
  );
};
