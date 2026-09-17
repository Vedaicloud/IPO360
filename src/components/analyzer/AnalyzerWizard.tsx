import React, { useState } from 'react';
import { IPOFormData, SectorType, RiskChecklist, PeerCompany, FinancialYearData } from '../../types/ipo';
import { 
  Building2, 
  TrendingUp, 
  Activity, 
  DollarSign, 
  PieChart, 
  Users, 
  ShieldAlert, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  RotateCcw, 
  Save, 
  Plus, 
  Trash2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { DEMO_COMPANY_DATA } from '../../lib/demoData';

interface AnalyzerWizardProps {
  initialData: IPOFormData;
  onAnalyze: (data: IPOFormData) => void;
  onSaveDraft?: (data: IPOFormData) => void;
}

const SECTORS: SectorType[] = [
  'IT',
  'Technology',
  'Pharma',
  'Manufacturing',
  'Banking',
  'NBFC',
  'Insurance',
  'FMCG',
  'Automobile',
  'Real Estate',
  'Energy',
  'Consumer',
  'Other',
];

const RISK_ITEMS: { key: keyof RiskChecklist; label: string; desc: string }[] = [
  { key: 'highDebt', label: 'High Debt / Financial Leverage', desc: 'Is total debt significantly high relative to net worth or operating profit?' },
  { key: 'negativeCashFlow', label: 'Negative Operating Cash Flow', desc: 'Has operating cash flow been negative in recent years despite accounting net profit?' },
  { key: 'customerConcentration', label: 'Customer Concentration', desc: 'Do the top 5 or 10 customers account for over 35-40% of overall revenue?' },
  { key: 'supplierConcentration', label: 'Supplier / Vendor Concentration', desc: 'Is the business heavily dependent on a few specific vendors or import channels?' },
  { key: 'regulatoryRisk', label: 'Regulatory / Compliance Risk', desc: 'Does the company operate in heavily regulated sectors prone to frequent policy changes?' },
  { key: 'legalProceedings', label: 'Material Legal or Tax Proceedings', desc: 'Are there significant pending court litigations or tax claims against promoters or company?' },
  { key: 'promoterConcerns', label: 'Promoter or Management Governance Concerns', desc: 'Any history of SEBI scrutiny, pledge of shares, or sudden promoter turnover?' },
  { key: 'highCompetition', label: 'Intense Industry Competition', desc: 'Is the industry characterized by low entry barriers and severe price wars?' },
  { key: 'cyclicalBusiness', label: 'Cyclical Business Model', desc: 'Are company revenues tied to commodity cycles or broader macroeconomic swings?' },
  { key: 'relatedPartyTransactions', label: 'High Related Party Transactions', desc: 'Significant revenue or expenditure with promoter-owned affiliate entities?' },
  { key: 'dependenceOnKeyCustomers', label: 'Dependence on Key Personnel or Clients', desc: 'Risk of losing principal contracts without long-term binding agreements?' },
  { key: 'dependenceOnGovtPolicies', label: 'Dependence on Government Subsidies / Policies', desc: 'Relying heavily on government incentives (PLI, tax waivers, duty barriers)?' },
  { key: 'marginDecline', label: 'Operating Margin Compression', desc: 'Have EBITDA or PAT margins been declining across recent reported years?' },
  { key: 'profitVolatility', label: 'Earnings / PAT Volatility', desc: 'Unpredictable swings between profit and loss across fiscal years?' },
];

export const AnalyzerWizard: React.FC<AnalyzerWizardProps> = ({
  initialData,
  onAnalyze,
  onSaveDraft,
}) => {
  const [formData, setFormData] = useState<IPOFormData>(initialData);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [notification, setNotification] = useState<string | null>(null);

  const steps = [
    { number: 1, title: 'Company', icon: Building2 },
    { number: 2, title: 'Financials', icon: TrendingUp },
    { number: 3, title: 'Health & Ratios', icon: Activity },
    { number: 4, title: 'Valuation', icon: DollarSign },
    { number: 5, title: 'IPO Structure', icon: PieChart },
    { number: 6, title: 'Peer Valuation', icon: Users },
    { number: 7, title: 'Risk Factors', icon: ShieldAlert },
  ];

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCompanyChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      company: { ...prev.company, [field]: value },
    }));
  };

  const handleFinancialChange = (index: number, field: keyof FinancialYearData, value: any) => {
    const updated = [...formData.financials];
    updated[index] = { ...updated[index], [field]: Number(value) || 0 };
    setFormData((prev) => ({ ...prev, financials: updated }));
  };

  const addFinancialYear = () => {
    const nextYear = `FY${2022 + formData.financials.length}`;
    const newYearData: FinancialYearData = {
      year: nextYear,
      revenue: 0,
      ebitda: 0,
      ebit: 0,
      pat: 0,
      eps: 0,
      operatingCashFlow: 0,
      freeCashFlow: 0,
      totalDebt: 0,
      netWorth: 0,
      totalAssets: 0,
      currentAssets: 0,
      currentLiabilities: 0,
      interestExpense: 0,
    };
    setFormData((prev) => ({ ...prev, financials: [...prev.financials, newYearData] }));
  };

  const removeFinancialYear = (index: number) => {
    if (formData.financials.length <= 2) {
      showNotification('At least 2 financial years are recommended for trend analysis.');
      return;
    }
    const updated = formData.financials.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, financials: updated }));
  };

  const handleValuationChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      valuation: { ...prev.valuation, [field]: Number(value) || 0 },
    }));
  };

  const handleStructureChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      structure: { ...prev.structure, [field]: Number(value) || 0 },
    }));
  };

  const handleMarketDataChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      marketData: { ...prev.marketData, [field]: Number(value) || 0 },
    }));
  };

  const handleRiskChange = (key: keyof RiskChecklist, value: 'yes' | 'no' | 'unknown') => {
    setFormData((prev) => ({
      ...prev,
      risks: { ...prev.risks, [key]: value },
    }));
  };

  const handlePeerChange = (index: number, field: keyof PeerCompany, value: any) => {
    const updated = [...formData.peers];
    updated[index] = {
      ...updated[index],
      [field]: field === 'name' ? value : Number(value) || 0,
    };
    setFormData((prev) => ({ ...prev, peers: updated }));
  };

  const addPeer = () => {
    if (formData.peers.length >= 5) {
      showNotification('Maximum 5 peer comparisons supported.');
      return;
    }
    const newPeer: PeerCompany = {
      id: `peer-${Date.now()}`,
      name: `Peer Company ${formData.peers.length + 1}`,
      pe: 25,
      pb: 5,
      evEbitda: 15,
      revenueGrowth: 15,
      patMargin: 12,
      roe: 18,
      roce: 20,
    };
    setFormData((prev) => ({ ...prev, peers: [...prev.peers, newPeer] }));
  };

  const removePeer = (index: number) => {
    const updated = formData.peers.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, peers: updated }));
  };

  const loadDemoData = () => {
    setFormData(DEMO_COMPANY_DATA);
    showNotification('Demo IPO data loaded (ApexTech Solutions Ltd.)');
  };

  const resetForm = () => {
    setFormData({
      company: {
        name: '',
        sector: 'IT',
        industry: '',
        ipoPrice: 0,
        priceBandMin: 0,
        priceBandMax: 0,
        issueSize: 0,
        listingExchange: 'NSE & BSE',
        openDate: '',
        closeDate: '',
      },
      financials: [
        { year: 'FY2023', revenue: 0, ebitda: 0, ebit: 0, pat: 0, eps: 0, operatingCashFlow: 0, freeCashFlow: 0, totalDebt: 0, netWorth: 0, totalAssets: 0 },
        { year: 'FY2024', revenue: 0, ebitda: 0, ebit: 0, pat: 0, eps: 0, operatingCashFlow: 0, freeCashFlow: 0, totalDebt: 0, netWorth: 0, totalAssets: 0 },
        { year: 'FY2025', revenue: 0, ebitda: 0, ebit: 0, pat: 0, eps: 0, operatingCashFlow: 0, freeCashFlow: 0, totalDebt: 0, netWorth: 0, totalAssets: 0 },
      ],
      valuation: { ipoPrice: 0, eps: 0, bookValuePerShare: 0, enterpriseValue: 0, ebitda: 0 },
      peers: [],
      structure: { freshIssue: 0, offerForSale: 0, debtRepayment: 0, capex: 0, workingCapital: 0, generalCorporate: 0 },
      marketData: {},
      risks: {
        highDebt: 'unknown',
        negativeCashFlow: 'unknown',
        customerConcentration: 'unknown',
        supplierConcentration: 'unknown',
        regulatoryRisk: 'unknown',
        legalProceedings: 'unknown',
        promoterConcerns: 'unknown',
        highCompetition: 'unknown',
        cyclicalBusiness: 'unknown',
        relatedPartyTransactions: 'unknown',
        dependenceOnKeyCustomers: 'unknown',
        dependenceOnGovtPolicies: 'unknown',
        marginDecline: 'unknown',
        profitVolatility: 'unknown',
      },
    });
    setCurrentStep(1);
    showNotification('Form reset to clean slate.');
  };

  const handleSaveDraft = () => {
    localStorage.setItem('ipo360_draft', JSON.stringify(formData));
    if (onSaveDraft) onSaveDraft(formData);
    showNotification('Draft saved securely to your browser storage.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze(formData);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Top Banner & Fast Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            IPO Analysis Input Wizard
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Step {currentStep} of 7 • Enter company financials, valuation multiples, and risk factors
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            id="wizard-load-demo-btn"
            type="button"
            onClick={loadDemoData}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Load Demo IPO
          </button>
          <button
            id="wizard-save-draft-btn"
            type="button"
            onClick={handleSaveDraft}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            Save Draft
          </button>
          <button
            id="wizard-reset-btn"
            type="button"
            onClick={resetForm}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Reset Form"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="p-3 bg-blue-600 text-white text-xs font-medium rounded-xl shadow-md flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          {notification}
        </div>
      )}

      {/* Step Progress Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[620px] gap-2">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isCompleted = currentStep > s.number;
            const isCurrent = currentStep === s.number;
            return (
              <React.Fragment key={s.number}>
                <button
                  type="button"
                  onClick={() => setCurrentStep(s.number)}
                  className="flex items-center gap-2 group cursor-pointer text-left"
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                        : isCompleted
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : s.number}
                  </div>
                  <div>
                    <span
                      className={`text-xs font-bold block ${
                        isCurrent ? 'text-blue-700' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                      }`}
                    >
                      {s.title}
                    </span>
                    <span className="text-[10px] text-slate-400">Step {s.number}</span>
                  </div>
                </button>
                {idx < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 rounded-full mx-1 ${
                      currentStep > s.number ? 'bg-emerald-400' : 'bg-slate-200'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Wizard Form Body */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* STEP 1: Company Details */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Step 1: Company & Offer Overview</h3>
              <p className="text-xs text-slate-500">Provide basic IPO details and prospectus identifiers</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ApexTech Solutions Ltd."
                  value={formData.company.name}
                  onChange={(e) => handleCompanyChange('name', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Sector Benchmark *</label>
                <select
                  value={formData.company.sector}
                  onChange={(e) => handleCompanyChange('sector', e.target.value as SectorType)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {SECTORS.map((sec) => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Industry Sub-Category</label>
                <input
                  type="text"
                  placeholder="e.g. Enterprise SaaS & Cloud"
                  value={formData.company.industry}
                  onChange={(e) => handleCompanyChange('industry', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Issue Price (₹ per share) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  step="0.1"
                  placeholder="500"
                  value={formData.company.ipoPrice || ''}
                  onChange={(e) => {
                    handleCompanyChange('ipoPrice', Number(e.target.value));
                    handleValuationChange('ipoPrice', Number(e.target.value));
                  }}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Total Issue Size (₹ Crores) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="1500"
                  value={formData.company.issueSize || ''}
                  onChange={(e) => handleCompanyChange('issueSize', Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Price Band (Min – Max ₹)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min (475)"
                    value={formData.company.priceBandMin || ''}
                    onChange={(e) => handleCompanyChange('priceBandMin', Number(e.target.value))}
                    className="w-1/2 px-2.5 py-2 text-sm rounded-xl border border-slate-300 font-mono"
                  />
                  <input
                    type="number"
                    placeholder="Max (500)"
                    value={formData.company.priceBandMax || ''}
                    onChange={(e) => handleCompanyChange('priceBandMax', Number(e.target.value))}
                    className="w-1/2 px-2.5 py-2 text-sm rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Listing Exchange</label>
                <select
                  value={formData.company.listingExchange}
                  onChange={(e) => handleCompanyChange('listingExchange', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white"
                >
                  <option value="NSE & BSE">NSE & BSE</option>
                  <option value="NSE">NSE Only</option>
                  <option value="BSE">BSE Only</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">DRHP / RHP Link (Optional)</label>
                <input
                  type="url"
                  placeholder="https://.../drhp.pdf"
                  value={formData.company.drhpUrl || ''}
                  onChange={(e) => handleCompanyChange('drhpUrl', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Historical Financials (3-5 Years) */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900">Step 2: Historical Financial Data (₹ Crores)</h3>
                <p className="text-xs text-slate-500">
                  Input 3 to 5 years of financials from Restated Financial Statements in DRHP
                </p>
              </div>
              <button
                type="button"
                onClick={addFinancialYear}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Year
              </button>
            </div>

            {/* Financial Data Table with Horizontal Scroll */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="min-w-full divide-y divide-slate-200 text-xs">
                <thead className="bg-slate-50 font-bold text-slate-700">
                  <tr>
                    <th className="py-2.5 px-3 text-left">Financial Metric</th>
                    {formData.financials.map((f, i) => (
                      <th key={i} className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <span>{f.year}</span>
                          {formData.financials.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeFinancialYear(i)}
                              className="text-slate-400 hover:text-rose-600 p-0.5"
                              title="Delete Year"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  <tr>
                    <td className="py-2 px-3 font-sans font-medium text-slate-900">Revenue (₹ Cr)</td>
                    {formData.financials.map((f, i) => (
                      <td key={i} className="py-1.5 px-2">
                        <input
                          type="number"
                          step="0.1"
                          value={f.revenue}
                          onChange={(e) => handleFinancialChange(i, 'revenue', e.target.value)}
                          className="w-24 text-right px-2 py-1 border border-slate-200 rounded focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans font-medium text-slate-900">EBITDA (₹ Cr)</td>
                    {formData.financials.map((f, i) => (
                      <td key={i} className="py-1.5 px-2">
                        <input
                          type="number"
                          step="0.1"
                          value={f.ebitda}
                          onChange={(e) => handleFinancialChange(i, 'ebitda', e.target.value)}
                          className="w-24 text-right px-2 py-1 border border-slate-200 rounded"
                        />
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans font-medium text-slate-900">EBIT (₹ Cr)</td>
                    {formData.financials.map((f, i) => (
                      <td key={i} className="py-1.5 px-2">
                        <input
                          type="number"
                          step="0.1"
                          value={f.ebit}
                          onChange={(e) => handleFinancialChange(i, 'ebit', e.target.value)}
                          className="w-24 text-right px-2 py-1 border border-slate-200 rounded"
                        />
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans font-medium text-slate-900">PAT / Net Profit (₹ Cr)</td>
                    {formData.financials.map((f, i) => (
                      <td key={i} className="py-1.5 px-2">
                        <input
                          type="number"
                          step="0.1"
                          value={f.pat}
                          onChange={(e) => handleFinancialChange(i, 'pat', e.target.value)}
                          className="w-24 text-right px-2 py-1 border border-slate-200 rounded font-semibold text-emerald-700"
                        />
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans font-medium text-slate-900">EPS (₹ per share)</td>
                    {formData.financials.map((f, i) => (
                      <td key={i} className="py-1.5 px-2">
                        <input
                          type="number"
                          step="0.01"
                          value={f.eps}
                          onChange={(e) => handleFinancialChange(i, 'eps', e.target.value)}
                          className="w-24 text-right px-2 py-1 border border-slate-200 rounded font-semibold text-blue-700"
                        />
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans font-medium text-slate-900">Operating Cash Flow (₹ Cr)</td>
                    {formData.financials.map((f, i) => (
                      <td key={i} className="py-1.5 px-2">
                        <input
                          type="number"
                          step="0.1"
                          value={f.operatingCashFlow}
                          onChange={(e) => handleFinancialChange(i, 'operatingCashFlow', e.target.value)}
                          className="w-24 text-right px-2 py-1 border border-slate-200 rounded"
                        />
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans font-medium text-slate-900">Total Debt (₹ Cr)</td>
                    {formData.financials.map((f, i) => (
                      <td key={i} className="py-1.5 px-2">
                        <input
                          type="number"
                          step="0.1"
                          value={f.totalDebt}
                          onChange={(e) => handleFinancialChange(i, 'totalDebt', e.target.value)}
                          className="w-24 text-right px-2 py-1 border border-slate-200 rounded text-rose-600"
                        />
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans font-medium text-slate-900">Net Worth / Equity (₹ Cr)</td>
                    {formData.financials.map((f, i) => (
                      <td key={i} className="py-1.5 px-2">
                        <input
                          type="number"
                          step="0.1"
                          value={f.netWorth}
                          onChange={(e) => handleFinancialChange(i, 'netWorth', e.target.value)}
                          className="w-24 text-right px-2 py-1 border border-slate-200 rounded"
                        />
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <span>CAGR will be automatically computed across beginning and ending fiscal years.</span>
              <span className="font-semibold text-blue-600">Auto Formula Active</span>
            </div>
          </div>
        )}

        {/* STEP 3: Financial Health & Ratios */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Step 3: Balance Sheet Health & Capital Efficiency</h3>
              <p className="text-xs text-slate-500">Liquidity ratios, leverage, and Return on Capital Employed</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Interest Expense (₹ Cr)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 1.8"
                  value={formData.financials[formData.financials.length - 1]?.interestExpense || ''}
                  onChange={(e) => handleFinancialChange(formData.financials.length - 1, 'interestExpense', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Used for Interest Coverage (EBIT / Interest)</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Current Assets (₹ Cr)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 580"
                  value={formData.financials[formData.financials.length - 1]?.currentAssets || ''}
                  onChange={(e) => handleFinancialChange(formData.financials.length - 1, 'currentAssets', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Current Liabilities (₹ Cr)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 220"
                  value={formData.financials[formData.financials.length - 1]?.currentLiabilities || ''}
                  onChange={(e) => handleFinancialChange(formData.financials.length - 1, 'currentLiabilities', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Calculates Current Liquidity Ratio</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reported ROE (%)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 28.9"
                  value={formData.financials[formData.financials.length - 1]?.roe || ''}
                  onChange={(e) => handleFinancialChange(formData.financials.length - 1, 'roe', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Auto-derived if left blank</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reported ROCE (%)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 33.2"
                  value={formData.financials[formData.financials.length - 1]?.roce || ''}
                  onChange={(e) => handleFinancialChange(formData.financials.length - 1, 'roce', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Return on Capital Employed</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Valuation Analyzer */}
        {currentStep === 4 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Step 4: Valuation Multiples & Capitalization</h3>
              <p className="text-xs text-slate-500">P/E, P/B, and Enterprise Value multiples at the upper price band</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">IPO Issue Price (₹) *</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.valuation.ipoPrice}
                  onChange={(e) => handleValuationChange('ipoPrice', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Latest Diluted EPS (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.valuation.eps}
                  onChange={(e) => handleValuationChange('eps', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 font-mono text-blue-700 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Book Value Per Share (BVPS) *</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.valuation.bookValuePerShare}
                  onChange={(e) => handleValuationChange('bookValuePerShare', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Enterprise Value (₹ Cr)</label>
                <input
                  type="number"
                  step="1"
                  value={formData.valuation.enterpriseValue}
                  onChange={(e) => handleValuationChange('enterpriseValue', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Latest EBITDA (₹ Cr)</label>
                <input
                  type="number"
                  step="1"
                  value={formData.valuation.ebitda}
                  onChange={(e) => handleValuationChange('ebitda', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 font-mono"
                />
              </div>
            </div>

            {/* Real-time Computed Multiples Preview */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-blue-50/60 rounded-xl border border-blue-200/70 text-center">
              <div>
                <span className="text-[11px] text-slate-500 font-medium block">Computed P/E</span>
                <span className="text-lg font-black text-blue-700 font-mono">
                  {formData.valuation.eps > 0
                    ? `${(formData.valuation.ipoPrice / formData.valuation.eps).toFixed(1)}x`
                    : '—'}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium block">Computed P/B</span>
                <span className="text-lg font-black text-blue-700 font-mono">
                  {formData.valuation.bookValuePerShare > 0
                    ? `${(formData.valuation.ipoPrice / formData.valuation.bookValuePerShare).toFixed(1)}x`
                    : '—'}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium block">EV / EBITDA</span>
                <span className="text-lg font-black text-blue-700 font-mono">
                  {formData.valuation.ebitda > 0
                    ? `${(formData.valuation.enterpriseValue / formData.valuation.ebitda).toFixed(1)}x`
                    : '—'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: IPO Structure & Proceeds */}
        {currentStep === 5 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Step 5: IPO Structure & Fund Utilization</h3>
              <p className="text-xs text-slate-500">Fresh Issue vs. Offer for Sale (OFS) and planned capital deployment</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Fresh Issue (₹ Cr) *</label>
                <input
                  type="number"
                  step="1"
                  placeholder="e.g. 1100"
                  value={formData.structure.freshIssue || ''}
                  onChange={(e) => handleStructureChange('freshIssue', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 font-mono text-emerald-700 font-bold"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">New shares issued; proceeds go directly into company</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Offer for Sale / OFS (₹ Cr) *</label>
                <input
                  type="number"
                  step="1"
                  placeholder="e.g. 400"
                  value={formData.structure.offerForSale || ''}
                  onChange={(e) => handleStructureChange('offerForSale', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 font-mono text-amber-700 font-bold"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Existing promoters/PE investors cashing out shares</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                Planned Deployment of Fresh Issue Proceeds (₹ Cr)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Capex / Expansion</label>
                  <input
                    type="number"
                    step="1"
                    placeholder="620"
                    value={formData.structure.capex || ''}
                    onChange={(e) => handleStructureChange('capex', e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Debt Repayment</label>
                  <input
                    type="number"
                    step="1"
                    placeholder="15"
                    value={formData.structure.debtRepayment || ''}
                    onChange={(e) => handleStructureChange('debtRepayment', e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Working Capital</label>
                  <input
                    type="number"
                    step="1"
                    placeholder="265"
                    value={formData.structure.workingCapital || ''}
                    onChange={(e) => handleStructureChange('workingCapital', e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">General Corporate</label>
                  <input
                    type="number"
                    step="1"
                    placeholder="200"
                    value={formData.structure.generalCorporate || ''}
                    onChange={(e) => handleStructureChange('generalCorporate', e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Optional Market Sentiment Inputs */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Optional Market Sentiment (GMP & Subscriptions)
                </h4>
                <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Excluded from fundamental score
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">GMP (₹ Premium)</label>
                  <input
                    type="number"
                    placeholder="85"
                    value={formData.marketData.gmp || ''}
                    onChange={(e) => handleMarketDataChange('gmp', e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">QIB Sub (x times)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="42.5"
                    value={formData.marketData.qibSubscription || ''}
                    onChange={(e) => handleMarketDataChange('qibSubscription', e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">NII Sub (x times)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="18.2"
                    value={formData.marketData.niiSubscription || ''}
                    onChange={(e) => handleMarketDataChange('niiSubscription', e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Retail Sub (x times)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="8.6"
                    value={formData.marketData.retailSubscription || ''}
                    onChange={(e) => handleMarketDataChange('retailSubscription', e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Peer Comparison */}
        {currentStep === 6 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900">Step 6: Listed Peer Company Benchmarking</h3>
                <p className="text-xs text-slate-500">
                  Add 1 to 5 listed industry peers to establish relative valuation and margin benchmarks
                </p>
              </div>
              <button
                type="button"
                onClick={addPeer}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Peer ({formData.peers.length}/5)
              </button>
            </div>

            {formData.peers.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-600 font-medium">No peer companies added yet.</p>
                <p className="text-[11px] text-slate-400 mb-3">Adding peers allows calculation of Median P/E and premium/discount.</p>
                <button
                  type="button"
                  onClick={addPeer}
                  className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-white border border-blue-200 rounded-lg shadow-xs"
                >
                  + Add First Peer
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {formData.peers.map((peer, idx) => (
                  <div key={peer.id || idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={peer.name}
                          onChange={(e) => handlePeerChange(idx, 'name', e.target.value)}
                          placeholder="Peer Company Name"
                          className="font-bold text-slate-800 text-xs px-2 py-1 bg-white rounded border border-slate-200"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removePeer(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Remove Peer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-xs font-mono">
                      <div>
                        <span className="text-[10px] font-sans text-slate-500 block mb-0.5">P/E (x)</span>
                        <input
                          type="number"
                          step="0.1"
                          value={peer.pe}
                          onChange={(e) => handlePeerChange(idx, 'pe', e.target.value)}
                          className="w-full px-2 py-1 bg-white rounded border border-slate-200"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-sans text-slate-500 block mb-0.5">P/B (x)</span>
                        <input
                          type="number"
                          step="0.1"
                          value={peer.pb}
                          onChange={(e) => handlePeerChange(idx, 'pb', e.target.value)}
                          className="w-full px-2 py-1 bg-white rounded border border-slate-200"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-sans text-slate-500 block mb-0.5">EV/EBITDA</span>
                        <input
                          type="number"
                          step="0.1"
                          value={peer.evEbitda}
                          onChange={(e) => handlePeerChange(idx, 'evEbitda', e.target.value)}
                          className="w-full px-2 py-1 bg-white rounded border border-slate-200"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-sans text-slate-500 block mb-0.5">Rev Growth %</span>
                        <input
                          type="number"
                          step="0.1"
                          value={peer.revenueGrowth}
                          onChange={(e) => handlePeerChange(idx, 'revenueGrowth', e.target.value)}
                          className="w-full px-2 py-1 bg-white rounded border border-slate-200"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-sans text-slate-500 block mb-0.5">PAT Margin %</span>
                        <input
                          type="number"
                          step="0.1"
                          value={peer.patMargin}
                          onChange={(e) => handlePeerChange(idx, 'patMargin', e.target.value)}
                          className="w-full px-2 py-1 bg-white rounded border border-slate-200"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-sans text-slate-500 block mb-0.5">ROE %</span>
                        <input
                          type="number"
                          step="0.1"
                          value={peer.roe}
                          onChange={(e) => handlePeerChange(idx, 'roe', e.target.value)}
                          className="w-full px-2 py-1 bg-white rounded border border-slate-200"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-sans text-slate-500 block mb-0.5">ROCE %</span>
                        <input
                          type="number"
                          step="0.1"
                          value={peer.roce}
                          onChange={(e) => handlePeerChange(idx, 'roce', e.target.value)}
                          className="w-full px-2 py-1 bg-white rounded border border-slate-200"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 7: Risk Factors Checklist */}
        {currentStep === 7 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Step 7: Risk Analysis Checklist (14 Factors)</h3>
              <p className="text-xs text-slate-500">
                Audit material risk factors as disclosed in Section III of the Draft Red Herring Prospectus (DRHP)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {RISK_ITEMS.map((item) => {
                const currentVal = formData.risks[item.key] || 'unknown';
                return (
                  <div
                    key={item.key}
                    className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/70 flex flex-col justify-between"
                  >
                    <div className="mb-2">
                      <span className="font-bold text-slate-800 text-xs block">{item.label}</span>
                      <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">{item.desc}</p>
                    </div>

                    <div className="flex items-center gap-1.5 pt-2 border-t border-slate-200/60">
                      <button
                        type="button"
                        onClick={() => handleRiskChange(item.key, 'no')}
                        className={`flex-1 py-1 text-xs font-semibold rounded-lg transition-all ${
                          currentVal === 'no'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        No / Clean
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRiskChange(item.key, 'yes')}
                        className={`flex-1 py-1 text-xs font-semibold rounded-lg transition-all ${
                          currentVal === 'yes'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        Yes / Risk
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRiskChange(item.key, 'unknown')}
                        className={`flex-1 py-1 text-xs font-semibold rounded-lg transition-all ${
                          currentVal === 'unknown'
                            ? 'bg-slate-700 text-white shadow-xs'
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        Unknown
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Wizard Bottom Controls */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Previous Step
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {currentStep < 7 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-all"
              >
                Next Step
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                id="wizard-submit-analyze-btn"
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-xl shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Generate Comprehensive Analysis
              </button>
            )}
          </div>
        </div>

      </form>
    </div>
  );
};
