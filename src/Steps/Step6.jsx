import React, { useState } from 'react';
import spellsData from '../assets/SpellsAndSongs.json'; // Adjust path as needed
import PentagonLayout from '../Styles/PentagonLayout.jsx';      // Our layout module
// We'll keep your SpellPopup and getSpellImage logic here

const spellImages = import.meta.glob('/src/assets/images/*.png', { eager: true });
const getSpellImage = (name) => {
  if (!name) return '';
  const processedName = name.replace(/\s+/g, '');
  const matchedImage = Object.entries(spellImages).find(([path]) =>
    path.toLowerCase().endsWith(`/${processedName.toLowerCase()}.png`)
  );
  return matchedImage ? matchedImage[1].default : '';
};

const SpellPopup = ({ visible, onSelect, onClose, selectedSpells, filteredSpells }) => {
  if (!visible) return null;
  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 1000,
      background: '#333333',
      color: '#FFD700',
      padding: '1rem',
      borderRadius: '0.5rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      maxHeight: '80vh',
      overflowY: 'auto',
      width: '100%',
      maxWidth: '500px',
    }}>
      <h3>Select a Spell</h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.5rem',
        padding: '0.5rem',
        background: '#222222',
        borderRadius: '0.25rem',
        width: '100%',
      }}>
        {filteredSpells.map((spell) => (
          <button
            key={spell.Name}
            onClick={() => {
              if (selectedSpells.some(s => s?.Name === spell.Name)) {
                alert(`${spell.Name} has already been selected.`);
                return;
              }
              onSelect(spell);
            }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '10px',
              background: 'transparent',
              border: '1px solid #FFD700',
              color: '#FFD700',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            <img 
              src={getSpellImage(spell.Name)} 
              alt={spell.Name} 
              style={{ maxWidth: '60px', maxHeight: '60px', marginBottom: '5px' }} 
            />
            {spell.Name}
          </button>
        ))}
      </div>
      <button onClick={onClose} style={{
        marginTop: '1rem',
        padding: '0.5rem 1rem',
        background: '#FFD700',
        border: 'none',
        color: '#222222',
        borderRadius: '0.25rem',
        cursor: 'pointer'
      }}>
        Close
      </button>
    </div>
  );
};

const Step6 = ({ 
  selectedSpells, 
  setSelectedSpells, 
  onNext, 
  onPrevious, 
  selectedPerks, 
  currentClass, 
  memory 
}) => {
  // Calculate total tier cost
  const getTotalTierCost = () =>
    selectedSpells.reduce((sum, spell) => sum + (spell?.Tier || 0), 0);

  const spellMemoryPerks = [
    "Spell Memory", 
    "Spell Memory II", 
    "Music Memory", 
    "Music Memory II", 
    "Sorcery Memory", 
    "Sorcery Memory II"
  ];

  // Filter spells by class requirement
  const filteredSpells = spellsData.filter(spell =>
    spell["Class Requirements"] === currentClass
  );

  // Check if we should show Step6 
  const shouldShowStep6 = Boolean(
    selectedPerks &&
    typeof selectedPerks === 'object' &&
    Object.values(selectedPerks).some(perk => 
      perk?.Name && spellMemoryPerks.includes(perk.Name)
    )
  );

  // Popup logic
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleSlotClick = (slotIndex) => {
    setSelectedSlot(slotIndex);
    setPopupVisible(true);
  };

  const handleSpellSelection = (spell) => {
    const newSpells = [...selectedSpells];
    newSpells[selectedSlot] = spell;
    setSelectedSpells(newSpells);
    setPopupVisible(false);
  };

  // Split the 10 spells into two groups of 5
  const spellsFirstPentagon  = selectedSpells.slice(0, 5);
  const spellsSecondPentagon = selectedSpells.slice(5, 10);

  return shouldShowStep6 ? (
    <div style={{
      padding: '20px', 
      color: '#FFD700', 
      backgroundColor: '#333', 
      borderRadius: '10px', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center'
    }}>
      <h2>Select Your Spells</h2>

      {/* Two pentagons side by side */}
      <div style={{ display: 'flex', gap: '50px', marginBottom: '20px' }}>
        {/* Pentagon 1 (slots 0-4) */}
        <PentagonLayout
          spells={spellsFirstPentagon}
          startIndex={0}
          onSlotClick={handleSlotClick}
          getSpellImage={getSpellImage}
        />

        {/* Pentagon 2 (slots 5-9) */}
        <PentagonLayout
          spells={spellsSecondPentagon}
          startIndex={5}
          onSlotClick={handleSlotClick}
          getSpellImage={getSpellImage}
        />
      </div>

      {/* Spell Selection Popup */}
      <SpellPopup
        visible={popupVisible}
        onSelect={handleSpellSelection}
        onClose={() => setPopupVisible(false)}
        selectedSpells={selectedSpells}
        filteredSpells={filteredSpells}
      />

      <h3>Total Spell Tier Cost: {getTotalTierCost()}</h3>
      <h3>Spell Memory: {getTotalTierCost()} / {memory}</h3>

      <div style={{ marginTop: '20px' }}>
        <button onClick={onPrevious} style={{ marginRight: '10px' }}>
          Previous
        </button>
        <button onClick={onNext}>
          Next
        </button>
      </div>
    </div>
  ) : null;
};

export default Step6;
