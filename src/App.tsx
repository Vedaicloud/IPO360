import React, { useState, useEffect } from 'react';
import { IPOFormData, IPOAnalysisResult } from './types/ipo';
import { runIPOAnalysis } from './lib/scoring/scoringEngine';
import { DEMO_COMPANY_DATA } from './lib/demoData';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomeView } from './components/views/HomeView';
import { AnalyzerWizard } from './components/analyzer/AnalyzerWizard';
import { ResultsDashboardView } from './components/views/ResultsDashboardView';
import { CompareView } from './components/views/CompareView';
import { GuideView } from './components/views/GuideView';
import { AboutView } from './components/views/AboutView';
import { ContactView } from './components/views/ContactView';
import { TermsDisclaimerView } from './components/views/TermsDisclaimerView';
import { PrivacyPolicyView } from './components/views/PrivacyPolicyView';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [formData, setFormData] = useState<IPOFormData>(() => {
    const saved = localStorage.getItem('ipo360_draft');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved draft:', e);
      }
    }
    return DEMO_COMPANY_DATA;
  });

  const [analysisResult, setAnalysisResult] = useState<IPOAnalysisResult>(() => {
    return runIPOAnalysis(DEMO_COMPANY_DATA);
  });

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const handleStartAnalysis = () => {
    setCurrentView('analyzer');
  };

  const handleLoadDemo = () => {
    setFormData(DEMO_COMPANY_DATA);
    const result = runIPOAnalysis(DEMO_COMPANY_DATA);
    setAnalysisResult(result);
    setCurrentView('results');
  };

  const handleRunAnalysis = (data: IPOFormData) => {
    setFormData(data);
    const result = runIPOAnalysis(data);
    setAnalysisResult(result);
    // Also save to recent history
    try {
      localStorage.setItem('ipo360_last_analysis', JSON.stringify(result));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
    setCurrentView('results');
  };

  const handleEditInputs = () => {
    setCurrentView('analyzer');
  };

  const handleSaveDraft = (data: IPOFormData) => {
    setFormData(data);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900 font-sans antialiased">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        onLoadDemo={handleLoadDemo}
        onStartAnalysis={handleStartAnalysis}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentView === 'home' && (
          <HomeView
            sampleResult={analysisResult}
            onStartAnalysis={handleStartAnalysis}
            onLoadDemo={handleLoadDemo}
            onNavigate={(view) => setCurrentView(view)}
          />
        )}

        {currentView === 'analyzer' && (
          <AnalyzerWizard
            initialData={formData}
            onAnalyze={handleRunAnalysis}
            onSaveDraft={handleSaveDraft}
          />
        )}

        {currentView === 'results' && analysisResult && (
          <ResultsDashboardView
            result={analysisResult}
            onEdit={handleEditInputs}
            onCompareWithOthers={() => setCurrentView('compare')}
          />
        )}

        {currentView === 'compare' && (
          <CompareView currentAnalysis={analysisResult} />
        )}

        {currentView === 'guide' && <GuideView />}
        {currentView === 'about' && <AboutView onStartAnalysis={handleStartAnalysis} />}
        {currentView === 'contact' && <ContactView />}
        {(currentView === 'terms' || currentView === 'disclaimer') && <TermsDisclaimerView />}
        {currentView === 'privacy' && <PrivacyPolicyView />}
      </main>

      {/* Compliance Footer */}
      <Footer onNavigate={(view) => setCurrentView(view)} />
    </div>
  );
}
