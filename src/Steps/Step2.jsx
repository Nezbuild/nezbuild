import React, { useState, useEffect } from 'react';

const Step2 = ({ data, updateData }) => {
  const [selectedClasses, setSelectedClasses] = useState({ synergies: [], threats: [] });
  const [synergyText, setSynergyText] = useState('');
  const [threatText, setThreatText] = useState('');

  const classes = [
    { name: 'Fighter', icon: '../src/assets/images/Fighter.png' },
    { name: 'Barbarian', icon: '../src/assets/images/Barbarian.png' },
    { name: 'Rogue', icon: '../src/assets/images/Rogue.png' },
    { name: 'Ranger', icon: '../src/assets/images/Ranger.png' },
    { name: 'Wizard', icon: '../src/assets/images/Wizard.png' },
    { name: 'Cleric', icon: '../src/assets/images/Cleric.png' },
    { name: 'Bard', icon: '../src/assets/images/Bard.png' },
    { name: 'Warlock', icon: '../src/assets/images/Warlock.png' },
    { name: 'Druid', icon: '../src/assets/images/Druid.png' },
    { name: 'Sorcerer', icon: '../src/assets/images/Sorcerer.png' },
  ];

  useEffect(() => {
    if (data.synergyText) setSynergyText(data.synergyText);
    if (data.threatText) setThreatText(data.threatText);
    if (data.selectedClasses) setSelectedClasses(data.selectedClasses);
  }, [data]);

  const handleClassClick = (className, type) => {
    const updatedSelections = { ...selectedClasses };
    const isSelected = updatedSelections[type].includes(className);

    if (isSelected) {
      updatedSelections[type] = updatedSelections[type].filter((item) => item !== className);
    } else {
      updatedSelections[type].push(className);
    }

    setSelectedClasses(updatedSelections);
    updateData('selectedClasses', updatedSelections);
  };

  const handleTextChange = (e, type) => {
    const value = e.target.value;
    if (type === 'synergies') {
      setSynergyText(value);
      updateData('synergyText', value);
    } else if (type === 'threats') {
      setThreatText(value);
      updateData('threatText', value);
    }
  };

  return (
    <div>
      <h2>Step 2: Synergies and Threats</h2>

      <h3 style={{ color: 'green' }}>Synergies</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1rem' }}>
        {classes.map(({ name, icon }) => (
          <button
            key={name}
            onClick={() => handleClassClick(name, 'synergies')}
            style={{
              padding: '1rem',
              backgroundColor: selectedClasses.synergies.includes(name) ? '#50C878' : '#2F2F2F',
              color: '#FFD700',
              cursor: 'pointer',
              outline: 'none',

            }}
          >
            <img
              src={icon}
              alt={name}
              style={{ width: '100px', height: '100px', marginBottom: '0.5rem' }}
            />
            {name}
          </button>
        ))}
      </div>
      <textarea
        value={synergyText}
        onChange={(e) => handleTextChange(e, 'synergies')}
        placeholder="Write about synergies here..."
        style={{
          width: '100%',
          height: '200px',
          padding: '1rem',
          marginBottom: '2rem',
          border: '1px solid #FFD700',
          borderRadius: '0.375rem',
          outline: 'none',
          boxShadow: '0 0 5px rgba(255, 215, 0, 0.8)',
        }}
      />

      <h3 style={{ color: 'red' }}>Threats</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1rem' }}>
        {classes.map(({ name, icon }) => (
          <button
            key={name}
            onClick={() => handleClassClick(name, 'threats')}
            style={{
              padding: '1rem',
              backgroundColor: selectedClasses.threats.includes(name) ? '#800020' : '#2F2F2F',
              color: '#FFD700',
              cursor: 'pointer',
              outline: 'none',

            }}
          >
            <img
              src={icon}
              alt={name}
              style={{ width: '100px', height: '100px', marginBottom: '0.5rem' }}
            />
            {name}
          </button>
        ))}
      </div>
      <textarea
        value={threatText}
        onChange={(e) => handleTextChange(e, 'threats')}
        placeholder="Write about threats here..."
        style={{
          width: '100%',
          height: '200px',
          padding: '1rem',
          border: '1px solid #FFD700',
          borderRadius: '0.375rem',
          outline: 'none',
          boxShadow: '0 0 5px rgba(255, 215, 0, 0.8)',
        }}
      />
    </div>
  );
};

export default Step2;
