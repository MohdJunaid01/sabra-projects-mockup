import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import ProjectShowcase from './components/ProjectShowcase';
import MaterialCatalogue from './components/MaterialCatalogue';
import CabinetDesignPage from './components/CabinetDesignPage';
import EstimatorFlow from './components/BudgetEstimator/EstimatorFlow';
import ConsultationFlow from './components/Consultation/ConsultationFlow';
import CloseFooter from './components/CloseFooter';
import Preloader from './components/Preloader';
import ScrollProgressIndicator from './components/ScrollProgressIndicator';

const INITIAL_STATE = {
  // Material Type & Finish from Material Library
  materialType: 'timber',
  cabinetFinish: 'smoked-oak',

  // Cabinet Designer Architectural Configuration
  cabinetStyle: 'slatted',
  cabinetLayout: '3-door',
  hardware: 'brushed-brass',
  benchtop: 'calacatta',

  // Estimator & Project Scope
  projectType: 'full-kitchen',
  size: 'medium',
  finishLevel: 'premium',
  features: ['island', 'stone-splashback', 'integrated-appliances'],

  // Site & Consultation
  suburb: 'Mosman',
  timeline: '1-3-months'
};

export default function App() {
  const [plannerState, setPlannerState] = useState(INITIAL_STATE);
  // View options: 'home' | 'design' | 'estimator' | 'consultation'
  const [currentView, setCurrentView] = useState('home');
  const [preloaderComplete, setPreloaderComplete] = useState(false);

  const updateField = (field, value) => {
    setPlannerState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const navigateToView = (viewName, targetElementId = null) => {
    setCurrentView(viewName);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (viewName === 'home' && targetElementId) {
      setTimeout(() => {
        const elem = document.getElementById(targetElementId);
        if (elem) {
          const navOffset = 76;
          const elementPosition = elem.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: elementPosition - navOffset,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  };

  const handleReset = () => {
    setPlannerState(INITIAL_STATE);
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectMaterialAndOpenDesign = (timberId) => {
    setPlannerState(prev => ({
      ...prev,
      cabinetFinish: timberId,
      materialType: 'timber'
    }));
    navigateToView('design');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F5F3EF',
      color: '#111111',
      position: 'relative'
    }}>
      {/* 0. Initial Editorial Preloader */}
      {!preloaderComplete && (
        <Preloader onComplete={() => setPreloaderComplete(true)} />
      )}

      {/* 1. Floating Stage / Scroll Progress Indicator (Right Sidebar) */}
      <ScrollProgressIndicator
        currentView={currentView}
        onNavigate={navigateToView}
      />

      {/* 3. Fixed Architectural Light Header */}
      <Navigation
        currentView={currentView}
        onNavigate={navigateToView}
        onReset={handleReset}
      />

      {/* Main Experience Flow based on current dedicated view */}
      <main style={{ paddingTop: '76px' }} key={currentView} className="page-enter-animation">
        {/* VIEW 1: HOME (HERO + 4x4 MATERIAL CATALOGUE) */}
        {currentView === 'home' && (
          <div>
            {/* HERO */}
            <div id="hero">
              <Hero
                onStartPlanning={() => {
                  const elem = document.getElementById('material-lab');
                  if (elem) {
                    const navOffset = 76;
                    const pos = elem.getBoundingClientRect().top + window.pageYOffset;
                    window.scrollTo({ top: pos - navOffset, behavior: 'smooth' });
                  }
                }}
              />
            </div>

            {/* 01 / MATERIAL LIBRARY: 4 × 4 Architectural Material Library */}
            <MaterialCatalogue
              selectedMaterialId={plannerState.cabinetFinish}
              onSelectAndOpenDesign={handleSelectMaterialAndOpenDesign}
            />
          </div>
        )}

        {/* VIEW 2: DEDICATED CABINET DESIGN STUDIO */}
        {currentView === 'design' && (
          <CabinetDesignPage
            plannerState={plannerState}
            onUpdateField={updateField}
            onBackToMaterials={() => navigateToView('home', 'material-lab')}
            onProceedToEstimator={() => navigateToView('estimator')}
            onProceedToConsultation={() => navigateToView('consultation')}
          />
        )}

        {/* VIEW 3: DEDICATED BUDGET ESTIMATOR */}
        {currentView === 'estimator' && (
          <EstimatorFlow
            plannerState={plannerState}
            onUpdateField={updateField}
            onProceedToConsultation={() => navigateToView('consultation')}
            onBackToDesign={() => navigateToView('design')}
          />
        )}

        {/* VIEW 4: DEDICATED QUALIFIED CONSULTATION BRIEF */}
        {currentView === 'consultation' && (
          <ConsultationFlow
            plannerState={plannerState}
            onUpdateField={updateField}
            onReset={handleReset}
            onBackToEstimator={() => navigateToView('estimator')}
          />
        )}
      </main>

      {/* CLOSING: Centered Editorial Statement & Sabra Projects Footer */}
      <CloseFooter onBackToTop={() => navigateToView('home', 'hero')} />
    </div>
  );
}
