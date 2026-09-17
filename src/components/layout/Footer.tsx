import React from 'react';
import { TrendingUp, ShieldCheck, AlertCircle, FileText, HelpCircle, Mail } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 no-print">
      {/* Disclaimer Banner inside Footer */}
      <div className="bg-slate-950/80 border-b border-slate-800/80 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-start gap-3 text-xs text-slate-400">
          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-slate-200">Regulatory Disclaimer:</strong> IPO360 provides educational and analytical information based strictly on user-provided financial data and disclosed prospectus filings. The scores, calculations, ratios, and observations do not constitute investment advice, research analyst recommendations, or a guarantee of future performance, listing gains, or capital preservation. The final investment decision must remain solely with the investor.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand & Identity */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-white">
                <TrendingUp className="w-4 h-4 text-white stroke-[2.5]" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                IPO<span className="text-blue-400">360</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              "Understand the IPO. Analyze the Numbers. Decide for Yourself."
            </p>
            <p className="text-xs text-slate-500">
              An objective, formula-driven analytical engine for Indian & global primary market offerings.
            </p>
          </div>

          {/* Col 2: Platform Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Platform Tools</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  id="footer-link-analyzer"
                  onClick={() => onNavigate('analyzer')} 
                  className="hover:text-white transition-colors"
                >
                  IPO 7-Step Analyzer
                </button>
              </li>
              <li>
                <button 
                  id="footer-link-results"
                  onClick={() => onNavigate('results')} 
                  className="hover:text-white transition-colors"
                >
                  Interactive Results Dashboard
                </button>
              </li>
              <li>
                <button 
                  id="footer-link-compare"
                  onClick={() => onNavigate('compare')} 
                  className="hover:text-white transition-colors"
                >
                  Side-by-Side Peer Comparison
                </button>
              </li>
              <li>
                <button 
                  id="footer-link-guide"
                  onClick={() => onNavigate('guide')} 
                  className="hover:text-white transition-colors"
                >
                  How to Read DRHP Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Sectors & Benchmarks */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Configured Sectors</h4>
            <p className="text-xs text-slate-400 mb-2 leading-relaxed">
              Dynamically adapts valuation & leverage criteria across 12+ industry categories:
            </p>
            <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-400">
              {['IT', 'Pharma', 'Banking', 'Manufacturing', 'FMCG', 'Auto', 'Energy', 'Tech'].map((s) => (
                <span key={s} className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/60">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Col 4: Legal & Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Governance & Support</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  id="footer-link-disclaimer"
                  onClick={() => onNavigate('disclaimer')} 
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  Terms of Use & Disclaimer
                </button>
              </li>
              <li>
                <button 
                  id="footer-link-privacy"
                  onClick={() => onNavigate('privacy')} 
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  id="footer-link-about"
                  onClick={() => onNavigate('about')} 
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  About Methodology
                </button>
              </li>
              <li>
                <button 
                  id="footer-link-contact"
                  onClick={() => onNavigate('contact')} 
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  Contact & Support
                </button>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 text-center sm:flex sm:justify-between sm:items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} IPO360. Built for empirical financial due diligence.</p>
          <p className="mt-2 sm:mt-0">Version 2.4 Production • Client-side encryption & local persistence</p>
        </div>
      </div>
    </footer>
  );
};
