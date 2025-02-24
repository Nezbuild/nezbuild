import React, { useState, useEffect, useCallback } from 'react';
import GlobalStyle from '../Styles/GlobalStyle';
import NavigationButtons from '../Components/NavigationButtons';
import ProgressBar from '../Components/ProgressBar';
import Step1 from '../Steps/Step1';
import Step2 from '../Steps/Step2';
import Step3 from '../Steps/Step3';
import Step4 from '../Steps/Step4';   // Gear + strategy
import Step5 from '../Steps/Step5';   // Possibly synergy/threat step, or another
import Step6 from '../Steps/Step6';   // Spells
import Step7 from '../Steps/Step7';   // Final page with "Publish"
import { truncateName } from '../Steps/Utils/gearHelpers';

// Publish handler – ensures votes, awards, comments, and date are set
const handlePublish = (guideData) => {
  const finalGuideData = {
    ...guideData,
    upVotes: 0,
    downVotes: 0,
    commentCount: 0,
    awards: [],
    datePublished: new Date().toISOString(),
    // username will be filled from user auth later
  };
  console.log('✅ Publish clicked. Final data:', finalGuideData);
  alert('Guide published successfully!');
};

const GuideCreationPage = () => {
  const [characterStats, setCharacterStats] = useState({});
  const [currentStep, setCurrentStep] = useState(1);

  const [guideData, setGuideData] = useState({
    title: '',
    shortDescription: '',
    class: '',
    category: '',
    tags: [],
    gearSelections: {},
    perks: [],
    skills: [],
    spells: [],
    strategyDescription: '',
    synergies: [],
    threats: [],
    synergyText: '',
    threatText: '',
    upVotes: 0,
    downVotes: 0,
    commentCount: 0,
    awards: [],
    datePublished: '',
    username: ''
  });

  const [isStep1And3Completed, setStep1And3Completed] = useState(false);
  const [isStep4And5Completed, setStep4And5Completed] = useState(false);

  // Load saved guide on mount
  useEffect(() => {
    try {
      const savedGuide = localStorage.getItem('savedGuide');
      if (savedGuide) {
        const confirmRestore = window.confirm('Would you like to restore your saved guide?');
        if (confirmRestore) {
          setGuideData(JSON.parse(savedGuide));
        }
      }
    } catch (error) {
      console.warn('localStorage is not accessible:', error);
    }
  }, []);

  // Debounced auto-save: writes 5 seconds after the last change to guideData
  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem('savedGuide', JSON.stringify(guideData));
    }, 5000);
    return () => clearTimeout(timeout);
  }, [guideData]);

  const spellMemoryPerks = [
    'Spell Memory', 'Spell Memory II',
    'Music Memory', 'Music Memory II',
    'Sorcery Memory', 'Sorcery Memory II'
  ];
  const hasSpellMemoryPerk =
    guideData.gearSelections &&
    Object.values(guideData.gearSelections).some((gear) => spellMemoryPerks.includes(gear?.Name));

  const handleNext = useCallback(() => {
    if (currentStep === 1) {
      if (!guideData.title || !guideData.shortDescription) {
        alert('Please complete the required fields (title & description).');
        return;
      }
      setCurrentStep(2);
      return;
    }
    if (currentStep === 2) {
      if (!guideData.class) {
        alert('Please select a class before proceeding.');
        return;
      }
      setCurrentStep(3);
      return;
    }
    if (currentStep === 3) {
      if (!guideData.gearSelections || !guideData.strategyDescription) {
        alert('Please complete gear selection and strategy description.');
        return;
      }
      hasSpellMemoryPerk ? setCurrentStep(4) : setCurrentStep(5);
      return;
    }
    if (currentStep === 4) {
      setCurrentStep(5);
      return;
    }
  }, [currentStep, guideData, hasSpellMemoryPerk]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(!hasSpellMemoryPerk && currentStep === 5 ? 3 : currentStep - 1);
    }
  }, [currentStep, hasSpellMemoryPerk]);  

  const handleGearSelection = useCallback((updatedGear) => {
    setGuideData((prev) => ({
      ...prev,
      gearSelections: updatedGear
    }));
  }, []);

  const updateData = useCallback((key, value) => {
    setGuideData((prevState) => {
      let updatedState = { ...prevState, [key]: value };
      if (key === 'class' && value !== prevState.class) {
        updatedState.gearSelections = {};
        updatedState.spells = [];
      }
      if (key === 'selectedClasses') {
        updatedState.synergies = value.synergies || [];
        updatedState.threats = value.threats || [];
      }
      return updatedState;
    });
    if (guideData.title && guideData.shortDescription && guideData.class) {
      setStep1And3Completed(true);
    }
    if (guideData.gearSelections && guideData.strategyDescription) {
      setStep4And5Completed(true);
    }
  }, [guideData]);

  const handleManualSave = useCallback(() => {
    localStorage.setItem('savedGuide', JSON.stringify(guideData));
  }, [guideData]);

  const clearSavedGuide = useCallback(() => {
    localStorage.removeItem('savedGuide');
    setGuideData({
      title: '',
      shortDescription: '',
      class: '',
      category: '',
      tags: [],
      gearSelections: {},
      perks: [],
      skills: [],
      spells: [],
      strategyDescription: '',
      synergies: [],
      threats: [],
      synergyText: '',
      threatText: '',
      upVotes: 0,
      downVotes: 0,
      commentCount: 0,
      awards: [],
      datePublished: '',
      username: ''
    });
  }, []);

  const exportGuide = useCallback(() => {
    const blob = new Blob([JSON.stringify(guideData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'guide.json';
    link.click();
  }, [guideData]);

  return (
    <>
      <GlobalStyle />
      <div style={{ background: '#000', minHeight: '100vh' }}>
        <div
          style={{
            margin: '0 auto',
            maxWidth: '1200px',
            padding: '2rem',
            background: '#111',
            color: '#FFD700',
            minHeight: '100vh'
          }}
        >
          <h1
            style={{
              textAlign: 'center',
              marginBottom: '1.5rem',
              fontSize: '2.5rem',
              textShadow: '1px 1px 3px #000'
            }}
          >
            Guide Creation Progress
          </h1>

          <ProgressBar currentStep={currentStep} totalSteps={5} />

          {currentStep === 1 && (
            <>
              <Step1 data={guideData} updateData={updateData} isStepCompleted={isStep1And3Completed} />
              <Step3 data={guideData} updateData={updateData} isStepCompleted={isStep1And3Completed} />
            </>
          )}

          {currentStep === 2 && <Step2 data={guideData} updateData={updateData} />}

          {currentStep === 3 && (
            <>
              <Step4
                data={guideData}
                updateData={updateData}
                isStepCompleted={isStep4And5Completed}
                gearSelections={guideData.gearSelections}
                handleGearSelection={handleGearSelection}
                onStatsUpdate={setCharacterStats}
              />
              <Step5 data={guideData} updateData={updateData} isStepCompleted={isStep4And5Completed} />
            </>
          )}

          {currentStep === 4 && (
            <Step6
              selectedSpells={guideData.spells}
              setSelectedSpells={(spells) => updateData('spells', spells)}
              selectedPerks={guideData.gearSelections}
              currentClass={guideData.class}
              memory={characterStats.Memory || 0}
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          )}

          {currentStep === 5 && (
            <Step7
              guideData={guideData}
              characterStats={characterStats}
              onPrevious={() => setCurrentStep(hasSpellMemoryPerk ? 4 : 3)}
              onPublish={() => handlePublish(guideData)}
            />
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '2rem', gap: '1rem' }}>
            <NavigationButtons
              currentStep={currentStep}
              totalSteps={5}
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={handleManualSave}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#CD7F32',
                color: '#FFF',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                transition: 'background 0.3s'
              }}
            >
              Save Now
            </button>
            <button
              onClick={clearSavedGuide}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#FF6347',
                color: '#FFF',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                transition: 'background 0.3s'
              }}
            >
              Clear Saved Data
            </button>
            <button
              onClick={exportGuide}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#4CAF50',
                color: '#FFF',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                transition: 'background 0.3s'
              }}
            >
              Download Guide
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GuideCreationPage;
