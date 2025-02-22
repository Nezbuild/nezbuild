import React, { useState, useEffect } from 'react';
import spellsData from '../assets/SpellsAndSongs.json';
import PentagonLayout from '../Styles/PentagonLayout.jsx';

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
    <div
      style={{
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
      }}
    >
      <h3>Select a Spell</h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.5rem',
          padding: '0.5rem',
          background: '#222222',
          borderRadius: '0.25rem',
          width: '100%',
        }}
      >
        {filteredSpells.map((spell) => (
          <button
            key={spell.Name}
            onClick={() => {
              // Prevent duplicates
              if (selectedSpells.some((s) => s?.Name === spell.Name)) {
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
      <button
        onClick={onClose}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          background: '#FFD700',
          border: 'none',
          color: '#222222',
          borderRadius: '0.25rem',
          cursor: 'pointer',
        }}
      >
        Close
      </button>
    </div>
  );
};

/**
 * A Memory Bar that shows the memory capacity threshold as a vertical line.
 * If totalCost > memory, fill is red; otherwise green.
 */
function MemoryBar({ totalCost, memory }) {
  const barWidth = 350;
  const maxScale = Math.max(memory, totalCost);
  const fillPercentage = (totalCost / maxScale) * 100;

  return (
    <div style={{ width: barWidth, margin: '20px 0', position: 'relative' }}>
      {/* Outer bar */}
      <div
        style={{
          height: '15px',
          backgroundColor: '#444',
          borderRadius: '5px',
          border: '1px solid #888',
          position: 'relative',
        }}
      >
        {/* Filled portion */}
        <div
          style={{
            width: `${fillPercentage}%`,
            height: '100%',
            background: totalCost <= memory ? 'green' : 'red',
            borderRadius: '5px',
            transition: 'width 0.3s',
          }}
        />

        {/* Vertical memory threshold line */}
        {memory <= maxScale && (
          <div
            style={{
              position: 'absolute',
              left: `${(memory / maxScale) * 100}%`,
              top: 0,
              bottom: 0,
              width: '2px',
              backgroundColor: '#FFD700',
            }}
          />
        )}
      </div>
      <div style={{ textAlign: 'center', marginTop: '5px', color: '#FFD700' }}>
        {totalCost} / {memory} {totalCost > memory ? '(Over Capacity!)' : ''}
      </div>
    </div>
  );
}

/**
 * Step6
 * @param {Boolean} readOnly - if true, hides "Select Your Spells" & remove logic
 */
const Step6 = ({
  selectedSpells,
  setSelectedSpells,
  onNext,
  onPrevious,
  selectedPerks,
  currentClass,
  memory,
  readOnly = false,
}) => {
  // 1) Calculate total tier cost
  const getTotalTierCost = () =>
    selectedSpells.reduce((sum, spell) => sum + (spell?.Tier || 0), 0);

  // 2) Over-capacity map
  const overCapacityMap = (() => {
    let runningTotal = 0;
    let isOverCapacity = false;
    return selectedSpells.map((spell) => {
      const cost = spell?.Tier || 0;
      runningTotal += cost;
      if (runningTotal > memory) {
        isOverCapacity = true;
      }
      return isOverCapacity;
    });
  })();

  // 3) Identify memory perks
  const spellMemoryPerks = [
    'Spell Memory',
    'Spell Memory II',
    'Music Memory',
    'Music Memory II',
    'Sorcery Memory',
    'Sorcery Memory II',
  ];

  const memoryPerksSelected = Object.values(selectedPerks).filter(
    (perk) => perk?.Name && spellMemoryPerks.includes(perk.Name)
  );

  const hasMemoryII = memoryPerksSelected.some((perk) =>
    perk.Name.toLowerCase().endsWith('ii')
  );
  const hasMemoryI = memoryPerksSelected.some((perk) =>
    !perk.Name.toLowerCase().endsWith('ii')
  );

  // 4) Filter spells by current class
  const filteredSpells = spellsData.filter(
    (spell) => spell['Class Requirements'] === currentClass
  );

  // 5) Should we show Step6 at all?
  const shouldShowStep6 = memoryPerksSelected.length > 0;

  // 6) Clear spells in disabled slots if not readOnly
  useEffect(() => {
    if (!shouldShowStep6 || readOnly) return;

    const newSpells = [...selectedSpells];
    let changed = false;

    // If no Memory I => clear slots 0–4
    if (!hasMemoryI) {
      for (let i = 0; i < 5; i++) {
        if (newSpells[i]) {
          newSpells[i] = null;
          changed = true;
        }
      }
    }
    // If no Memory II => clear slots 5–9
    if (!hasMemoryII) {
      for (let i = 5; i < 10; i++) {
        if (newSpells[i]) {
          newSpells[i] = null;
          changed = true;
        }
      }
    }

    if (changed) {
      setSelectedSpells(newSpells);
    }
  }, [
    shouldShowStep6,
    hasMemoryI,
    hasMemoryII,
    selectedSpells,
    setSelectedSpells,
    readOnly,
  ]);

  // 7) Popup logic
  const [popupVisible, setPopupVisible] = useState(false);

  const handleSlotClick = () => {
    if (readOnly) return; // No slot-click in readOnly
    setPopupVisible(true);
  };

  const handleSpellSelection = (spell) => {
    // fill from left to right in enabled slots
    let enabledSlots = [];
    if (hasMemoryI) enabledSlots.push(...[0, 1, 2, 3, 4]);
    if (hasMemoryII) enabledSlots.push(...[5, 6, 7, 8, 9]);

    const slotIndex = enabledSlots.find((index) => !selectedSpells[index]);
    if (slotIndex === undefined) {
      alert('No free slots left in enabled slots!');
      return;
    }
    const newSpells = [...selectedSpells];
    newSpells[slotIndex] = spell;
    setSelectedSpells(newSpells);
    setPopupVisible(false);
  };

  const handleRemoveSpell = (slotIndex) => {
    if (readOnly) return; // no removal in readOnly
    const newSpells = [...selectedSpells];
    newSpells[slotIndex] = null;
    setSelectedSpells(newSpells);
  };

  // 9) Split spells for each pentagon
  const spellsFirstPentagon = selectedSpells.slice(0, 5);
  const spellsSecondPentagon = selectedSpells.slice(5, 10);

  return shouldShowStep6 ? (
    <div
      style={{
        padding: '20px',
        color: '#FFD700',
        backgroundColor: '#333',
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Hide heading if readOnly */}
      {!readOnly && <h2>Select Your Spells</h2>}

      <div style={{ display: 'flex', gap: '50px', marginBottom: '20px' }}>
        {/* Pentagon 1 (slots 0–4) */}
        <PentagonLayout
          spells={spellsFirstPentagon}
          startIndex={0}
          onSlotClick={!readOnly && hasMemoryI ? handleSlotClick : undefined}
          onRemoveSpell={!readOnly && hasMemoryI ? handleRemoveSpell : undefined}
          getSpellImage={getSpellImage}
          overCapacityMap={overCapacityMap}
          isEnabled={hasMemoryI}
          readOnly={readOnly}
        />
        {/* Pentagon 2 (slots 5–9) */}
        <PentagonLayout
          spells={spellsSecondPentagon}
          startIndex={5}
          onSlotClick={!readOnly && hasMemoryII ? handleSlotClick : undefined}
          onRemoveSpell={!readOnly && hasMemoryII ? handleRemoveSpell : undefined}
          getSpellImage={getSpellImage}
          overCapacityMap={overCapacityMap}
          isEnabled={hasMemoryII}
          readOnly={readOnly}
        />
      </div>

      <MemoryBar totalCost={getTotalTierCost()} memory={memory} />

      {/* Spell selection popup (only if not readOnly) */}
      {!readOnly && (
        <SpellPopup
          visible={popupVisible}
          onSelect={handleSpellSelection}
          onClose={() => setPopupVisible(false)}
          selectedSpells={selectedSpells}
          filteredSpells={filteredSpells}
        />
      )}

      <h3>Total Spell Cost: {getTotalTierCost()}</h3>
      <h3>Memory Capacity: {memory}</h3>
    </div>
  ) : null;
};

export default Step6;
