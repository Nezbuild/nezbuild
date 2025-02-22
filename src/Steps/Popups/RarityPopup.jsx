import React, { useState } from 'react';
import gearData from '/src/assets/DarkAndDarkerGear.json';
import weaponsData from '/src/assets/Weapons.json';
import mergeData from '/src/assets/merged_weapons_shields.json';
import accessoriesData from '/src/assets/Accessories.json';
import skillsData from '/src/assets/SkillsAndPerks.json';

const allGear = [
  ...gearData,
  ...mergeData,
  ...accessoriesData,
  ...skillsData
];

// Rarity color scheme
const rarityColors = {
  Poor: '#A9A9A9',      // light gray
  Common: '#FFFFFF',    // white
  Uncommon: 'green',
  Rare: 'blue',
  Epic: 'purple',
  Legendary: 'orange',
  Unique: '#f0e6d2'     // off-white
};

// Finds all gear objects for a given gearName that have a Rarity
function findAllGearByName(gearName) {
  return allGear.filter(
    (gear) => gear.Name === gearName && gear.Rarity
  );
}

// Collect distinct rarities
function getRaritiesForGear(gearName) {
  const relevant = findAllGearByName(gearName);
  return Array.from(new Set(relevant.map((g) => g.Rarity)));
}

// Return the gear object for a specific name+rarity
function getGearByNameAndRarity(gearName, rarity) {
  return allGear.find(
    (gear) => gear.Name === gearName && gear.Rarity === rarity
  );
}

const RarityPopup = ({ visible, gearName, onSelect, onClose }) => {
  if (!visible) return null;

  // The hovered rarity for which we show the drop-down stats
  const [hoveredRarity, setHoveredRarity] = useState(null);

  const rarities = getRaritiesForGear(gearName);
  console.log('RarityPopup for gear:', gearName, 'Rarities:', rarities);

  // If 0 or 1 rarities => auto-select & close
  if (rarities.length === 0) {
    onSelect(undefined);
    return null;
  }
  if (rarities.length === 1) {
    onSelect(rarities[0]);
    return null;
  }

  const hoveredGearObj = hoveredRarity
    ? getGearByNameAndRarity(gearName, hoveredRarity)
    : null;

  // "Drop-down" stats block, displayed absolutely below the container
  const renderStats = (gearObj) => {
    if (!gearObj) return null;

    const color = rarityColors[gearObj.Rarity] || '#FFD700';

    return (
      <div
        style={{
          position: 'absolute',
          top: 'calc(100% + 10px)',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#444',
          color: color,
          padding: '0.5rem',
          borderRadius: '5px',
          border: `1px solid ${color}`,
          width: '250px',
          pointerEvents: 'auto',
          zIndex: 9999
        }}
      >
        {/* Omitting gear name as requested */}
        <p style={{ margin: '5px 0' }}>
          <strong>Rarity:</strong> {gearObj.Rarity}
        </p>
        {gearObj.Attributes && (
          <p style={{ margin: '5px 0' }}>
            <strong>Attributes:</strong> {gearObj.Attributes}
          </p>
        )}
        {gearObj.Other && (
          <p style={{ margin: '5px 0' }}>
            <strong>Other:</strong> {gearObj.Other}
          </p>
        )}
      </div>
    );
  };

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
        // No scrolling / maxHeight => grows as needed
      }}
    >
      <h3>Select Rarity</h3>

      {/* Container for the rarity buttons + the stats drop-down */}
      <div style={{ position: 'relative', width: '100%', marginTop: '0.5rem' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            justifyContent: 'center',
            padding: '0.5rem',
            background: '#222222',
            borderRadius: '0.25rem'
          }}
        >
          {rarities.map((rarity) => {
            const color = rarityColors[rarity] || '#FFD700';
            return (
              <div key={rarity} style={{ position: 'relative' }}>
                <button
                  onClick={() => onSelect(rarity)}
                  onMouseEnter={() => setHoveredRarity(rarity)}
                  onMouseLeave={() => setHoveredRarity(null)}
                  style={{ 
                    padding: '0.5rem 1rem',
                    background: 'transparent',
                    border: `1px solid ${color}`,
                    color: color,
                    textAlign: 'center',
                    cursor: 'pointer',
                    borderRadius: '0.25rem'
                  }}
                >
                  {rarity}
                </button>

                {/* If this is the hovered rarity, show stats drop-down below it */}
                {hoveredRarity === rarity && hoveredGearObj && (
                  <div style={{ position: 'relative' }}>
                    {renderStats(hoveredGearObj)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <button 
        onClick={onClose}
        style={{
          display: 'block',
          margin: '1rem auto 0',
          padding: '0.5rem 1rem',
          background: '#FFD700',
          color: '#000',
          border: 'none',
          borderRadius: '0.25rem',
          cursor: 'pointer'
        }}
      >
        Close
      </button>
    </div>
  );
};

export default RarityPopup;
