import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

export const PrivacyPolicyView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          PRIVACY & DATA PROTECTION
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          How IPO360 respects your financial data, drafts, and anonymity.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <div>
          <h3 className="text-base font-bold text-slate-900 mb-2">1. Client-Side Data Storage</h3>
          <p>
            When you enter financial ratios, drafts, or notes into IPO360, your entries are stored locally within your web browser's isolated localStorage sandbox unless explicitly saved to your account. We never sell, auction, or broadcast your analysis inputs to high-frequency trading desks or third-party marketing brokers.
          </p>
        </div>

        <div>
          <h3 className="text-base font-bold text-slate-900 mb-2">2. No Tracking of Portfolio Holdings</h3>
          <p>
            IPO360 does not request your Demat account credentials, PAN numbers, bank account details, or depository access. You can conduct comprehensive fundamental evaluations with complete privacy.
          </p>
        </div>

        <div>
          <h3 className="text-base font-bold text-slate-900 mb-2">3. Cookies and Analytics</h3>
          <p>
            We use minimal, non-invasive telemetry strictly to monitor application runtime errors, server uptime, and load performance. You can disable telemetry at any time via your browser settings.
          </p>
        </div>
      </div>
    </div>
  );
};
