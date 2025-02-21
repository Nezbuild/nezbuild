import React, { useState, useEffect } from 'react';
import GlobalStyle from '../Styles/GlobalStyle';
import NavigationButtons from '../Components/NavigationButtons';
import ProgressBar from '../Components/ProgressBar';
import Step1 from '../Steps/Step1';
import Step2 from '../Steps/Step2';
import Step3 from '../Steps/Step3';
import Step4 from '../Steps/Step4';
import Step5 from '../Steps/Step5';
import Step6 from '../Steps/Step6';
import GearLayout from '../Styles/GearLayout';
import { truncateName } from '../Steps/Utils/gearHelpers';
import ClassGearStatsTable from '../Components/ClassGearStatsTable';

const gearImages = import.meta.glob('/src/assets/images/*.png', { eager: true });

const getGearImage = (name, slot) => {
  const shouldTruncate = ['head', 'chest', 'gloves', 'cape', 'legs', 'feet'].includes(slot);
  const processedName = shouldTruncate ? truncateName(name) : name.replace(/\s+/g, '');

  const matchedImage = Object.entries(gearImages).find(([path]) =>
    path.toLowerCase().endsWith(`/${processedName.toLowerCase()}.png`)
  );

  return matchedImage ? matchedImage[1].default : '';
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
    threatText: ''
  });

  const [isStep1And3Completed, setStep1And3Completed] = useState(false);
  const [isStep4And5Completed, setStep4And5Completed] = useState(false);
  const [isPreviewVisible, setPreviewVisible] = useState(false);

  // Load from localStorage on mount
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

  // Auto-save every 5s
  useEffect(() => {
    const saveInterval = setInterval(() => {
      localStorage.setItem('savedGuide', JSON.stringify(guideData));
    }, 5000);
    return () => clearInterval(saveInterval);
  }, [guideData]);

  // Check if perk is a memory perk
  const spellMemoryPerks = [
    'Spell Memory', 'Spell Memory II',
    'Music Memory', 'Music Memory II',
    'Sorcery Memory', 'Sorcery Memory II'
  ];
  const hasSpellMemoryPerk =
    guideData.gearSelections &&
    Object.values(guideData.gearSelections).some(gear => spellMemoryPerks.includes(gear?.Name));

  console.log('YA RAB YA MOSAHEL', hasSpellMemoryPerk);

  // Next step logic
  const handleNext = () => {
    if (currentStep === 1 && (!guideData.title || !guideData.shortDescription)) {
      alert('Please complete the required fields before proceeding.');
      return;
    }
    if (currentStep === 2 && !guideData.class) {
      alert('Please complete the required fields before proceeding.');
      return;
    }
    if (currentStep === 3 && (!guideData.gearSelections || !guideData.strategyDescription)) {
      alert('Please complete the required fields before proceeding.');
      return;
    }

    // If a spell memory perk is selected, go to Step 6 before finishing
    if (currentStep === 4 && hasSpellMemoryPerk) {
      setCurrentStep(6);
    } else if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Handle gear selections from Step4
  const handleGearSelection = (updatedGear) => {
    console.log('🔹 handleGearSelection received updatedGear:', updatedGear);
    setGuideData(prevState => {
      console.log('✅ Updating Guide Data with Full Gear State');
      return {
        ...prevState,
        gearSelections: updatedGear
      };
    });
  };

  // Function to update guide data for any key
  const updateData = (key, value) => {
    setGuideData(prevState => {
      let updatedState = { ...prevState, [key]: value };

      // Check if class changed -> clear gearSelections
      if (key === 'class' && value !== prevState.class) {
        updatedState.gearSelections = {};
        console.log('[updateData] Class changed -> gearSelections cleared.');
      }

      // If we have selectedClasses data, auto-populate synergies/threats
      if (key === 'selectedClasses') {
        updatedState.synergies = value.synergies || [];
        updatedState.threats = value.threats || [];
      }

      console.log('Updated Guide Data:', updatedState); // Debugging
      return updatedState;
    });

    // Update completion flags
    if ((guideData.title && guideData.shortDescription) && guideData.class) {
      setStep1And3Completed(true);
    }
    if (guideData.gearSelections && guideData.strategyDescription) {
      setStep4And5Completed(true);
    }
  };

  // Manual save
  const handleManualSave = () => {
    localStorage.setItem('savedGuide', JSON.stringify(guideData));
    console.log('Guide manually saved:', guideData); // Debugging
  };

  // Clear local storage
  const clearSavedGuide = () => {
    localStorage.removeItem('savedGuide');
    setGuideData({
      title: '',
      shortDescription: '',
      class: '',
      category: '',
      tags: [],
      gearSelections: {},
      strategyDescription: '',
      synergies: [],
      threats: [],
      synergyText: '',
      threatText: ''
    });
    console.log('Guide data cleared.'); // Debugging
  };

  // Export as JSON
  const exportGuide = () => {
    const blob = new Blob([JSON.stringify(guideData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'guide.json';
    link.click();
    console.log('Guide exported:', guideData); // Debugging
  };

  return (
    <>
      <GlobalStyle />
      <div className="content-container">
        <h1>Guide Creation Progress</h1>
        <ProgressBar currentStep={currentStep} totalSteps={4} />

        {currentStep === 1 && (
          <>
            <Step1 data={guideData} updateData={updateData} isStepCompleted={isStep1And3Completed} />
            <Step3 data={guideData} updateData={updateData} isStepCompleted={isStep1And3Completed} />
          </>
        )}

        {currentStep === 2 && (
          <Step2 data={guideData} updateData={updateData} />
        )}

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
            setSelectedSpells={spells => updateData('spells', spells)}
            selectedPerks={guideData.gearSelections}
            currentClass={guideData.class}
            memory={characterStats.Memory || 0}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )}

        <div style={{ display: 'flex', justifyContent: 'left', marginTop: '20px' }}>
          <NavigationButtons
            currentStep={currentStep}
            totalSteps={10}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        </div>

        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          <button
            onClick={handleManualSave}
            style={{
              padding: '10px',
              backgroundColor: '#CD7F32',
              color: '#FFF',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Save Now
          </button>
          <button
            onClick={clearSavedGuide}
            style={{
              padding: '10px',
              backgroundColor: '#FF6347',
              color: '#FFF',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Clear Saved Data
          </button>
          <button
            onClick={exportGuide}
            style={{
              padding: '10px',
              backgroundColor: '#4CAF50',
              color: '#FFF',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Download Guide
          </button>
          <button
            onClick={() => setPreviewVisible(!isPreviewVisible)}
            style={{
              padding: '10px',
              backgroundColor: '#1E90FF',
              color: '#FFF',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Preview Guide
          </button>
        </div>

        {isPreviewVisible && (
          <div
            style={{
              marginTop: '20px',
              padding: '20px',
              border: '5px solid #FFBF00',
              borderRadius: '10px'
            }}
          >
            <h2>{guideData.title}</h2>
            <p>{guideData.shortDescription}</p>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '1rem' }}>
              <img
                src={`../src/assets/images/${guideData.class}.png`}
                onError={e => (e.target.src = '../src/assets/images/fallback.png')}
                alt={guideData.class}
                style={{ width: '100px', height: '100px' }}
              />
              <span style={{ fontSize: '16px', textAlign: 'center' }}>{guideData.class}</span>
            </div>
            <p>
              <strong>Category:</strong> {guideData.category}
            </p>
            <p>
              <strong>Tags:</strong> {guideData.tags.join(', ')}
            </p>

            {/* Gear Layout */}
            <GearLayout>
              {[
                'head', 'chest', 'gloves', 'amulet', 'ring1', 'ring2', 'cape', 'legs', 'feet',
                'perk1', 'perk2', 'perk3', 'perk4', 'skill1', 'skill2',
                'Weapon11', 'Weapon12', 'Weapon21', 'Weapon22'
              ].map(slot => {
                const gear = guideData.gearSelections[slot];
                const imageSrc = gear ? getGearImage(gear.Name, slot) : null;

                return (
                  <div key={slot} className={`gear-slot ${slot}`}>
                    {gear ? (
                      <img
                        src={imageSrc}
                        onError={e => (e.target.src = '/src/assets/images/fallback.png')}
                        alt={gear.Name}
                        style={{ width: '80%', height: '80%', objectFit: 'contain' }}
                      />
                    ) : (
                      `${slot}`
                    )}
                  </div>
                );
              })}
            </GearLayout>

            {/* Synergies */}
            {guideData.synergies.length > 0 ? (
              <>
                <h3 style={{ color: 'green' }}>Synergies</h3>
                <div
                  style={{
                    marginBottom: '1rem',
                    display: 'flex',
                    gap: '20px',
                    flexWrap: 'wrap'
                  }}
                >
                  {guideData.synergies.map((synergy, index) => (
                    <div
                      key={index}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    >
                      <img
                        src={`../src/assets/images/${synergy}.png`}
                        onError={e => (e.target.src = '../src/assets/images/fallback.png')}
                        alt={synergy}
                        style={{ width: '75px', height: '75px', marginBottom: '5px' }}
                      />
                      <span style={{ fontSize: '14px', textAlign: 'center' }}>{synergy}</span>
                    </div>
                  ))}
                </div>
                <p>{guideData.synergyText}</p>
              </>
            ) : (
              <p style={{ color: 'gray' }}>No synergies added yet.</p>
            )}

            {/* Threats */}
            {guideData.threats.length > 0 ? (
              <>
                <h3 style={{ color: 'red' }}>Threats</h3>
                <div
                  style={{
                    marginBottom: '1rem',
                    display: 'flex',
                    gap: '20px',
                    flexWrap: 'wrap'
                  }}
                >
                  {guideData.threats.map((threat, index) => (
                    <div
                      key={index}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    >
                      <img
                        src={`../src/assets/images/${threat}.png`}
                        onError={e => (e.target.src = '../src/assets/images/fallback.png')}
                        alt={threat}
                        style={{ width: '75px', height: '75px', marginBottom: '5px' }}
                      />
                      <span style={{ fontSize: '14px', textAlign: 'center' }}>{threat}</span>
                    </div>
                  ))}
                </div>
                <p>{guideData.threatText}</p>
              </>
            ) : (
              <p style={{ color: 'gray' }}>No threats added yet.</p>
            )}

            <h3>Gear Selections</h3>
            {console.log('🟢 gearSelections Preview Rendering:', guideData.gearSelections)}

            <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
              {/* Additional gear info if needed */}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default GuideCreationPage;
