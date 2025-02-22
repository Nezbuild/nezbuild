import React, { useState } from 'react';
import { addSpacesBeforeCapitals, truncateName } from '../Utils/gearHelpers';
import gearData from '/src/assets/DarkAndDarkerGear.json';
import weaponsData from '/src/assets/Weapons.json';
import accessoriesData from '/src/assets/Accessories.json';
import mergeWeapons from '/src/assets/merged_weapons_shields.json';
import skillsData from '/src/assets/SkillsAndPerks.json';

const gearImages = import.meta.glob('/src/assets/images/*.png', { eager: true });

// Rarity colors
const rarityColorMap = {
  Poor: '#A9A9A9',      // light gray
  Common: '#FFFFFF',    // white
  Uncommon: 'green',
  Rare: 'blue',
  Epic: 'purple',
  Legendary: 'orange',
  Unique: '#F5F5DC'     // off white
};

const extractPerks = (ol) => {
  return Object.values(ol)
    .filter((gear) => gear.Type === 'Perk')
    .map((perk) => perk.Name);
};

const getGearImage = (name, slot) => {
  const shouldTruncate = ['head', 'chest', 'gloves', 'cape', 'legs', 'feet'].includes(slot);
  const processedName = shouldTruncate ? truncateName(name) : name.replace(/\s+/g, '');
  const matchedImage = Object.entries(gearImages).find(([path]) =>
    path.toLowerCase().endsWith(`/${processedName.toLowerCase()}.png`)
  );
  return matchedImage ? matchedImage[1].default : '';
};

export default function GearPopup({
  visible,
  selectedSlot,
  currentClass,
  onSelect,
  onClose,
  updatedGear
}) {
  if (!visible) return null;

  // Extract any global perks
  const perks = extractPerks(updatedGear);
  const hasSlayer = perks.includes('Slayer');
  const hasWeaponMastery = perks.includes('Weapon Mastery');
  const hasDemonArmor = perks.includes('Demon Armor');

  // For truncation
  const shouldTruncate = ['head', 'chest', 'gloves', 'cape', 'legs', 'feet'].includes(selectedSlot);

  const typeMap = {
    head: 'Head',
    chest: 'Chest',
    gloves: 'Gloves',
    cape: 'Cape',
    legs: 'Pants',
    feet: 'Boots',
    ring1: 'Ring',
    ring2: 'Ring',
    amulet: 'Necklace',
    Weapon11: 'Weapon',
    Weapon12: 'Weapon',
    Weapon21: 'Weapon',
    Weapon22: 'Weapon',
    perk1: 'Perk',
    perk2: 'Perk',
    perk3: 'Perk',
    perk4: 'Perk',
    skill1: 'Skill',
    skill2: 'Skill'
  };

  function getRelevantGear() {
    if (['Weapon11','Weapon12','Weapon21','Weapon22'].includes(selectedSlot)) {
      return mergeWeapons;
    }
    if (['ring1','ring2','amulet'].includes(selectedSlot)) {
      return accessoriesData;
    }
    if (['perk1','perk2','perk3','perk4'].includes(selectedSlot)) {
      return skillsData.filter((gear) => gear.Type === 'Perk');
    }
    if (['skill1','skill2'].includes(selectedSlot)) {
      return skillsData.filter((gear) => gear.Type === 'Skill');
    }
    return gearData;
  }

  // Filter logic
  const relevantGear = getRelevantGear().filter((gear) => {
    const firstWord = gear.Name.split(' ')[0];
    const isPlate = firstWord === 'Plate';
    const isWeapon = typeMap[selectedSlot] === 'Weapon';
    const isPerk = typeMap[selectedSlot] === 'Perk';

    const hasPlateArmorEquipped = Object.values(updatedGear).some(
      (eqGear) => eqGear?.Name && eqGear.Name.split(' ')[0] === 'Plate'
    );

    // If user has Slayer => block plate unless Demon Armor
    if (hasSlayer && isPlate && !hasDemonArmor) return false;
    // If user has Weapon Mastery => any weapon is allowed
    if (hasWeaponMastery && isWeapon) return true;
    // Demon Armor => plate is okay
    if (hasDemonArmor && isPlate && gear.Type === typeMap[selectedSlot]) return true;
    // If perk is "Slayer" but we have plate => block
    if (isPerk && gear.Name === 'Slayer' && hasPlateArmorEquipped) {
      return false;
    }

    // Normal checks
    const matchesTypeOrSlot =
      ['perk1','perk2','perk3','perk4','skill1','skill2'].includes(selectedSlot)
      || gear.Type === typeMap[selectedSlot];

    const classReqOk =
      ['ring1','ring2','amulet'].includes(selectedSlot)
      || !gear['Class Requirements']
      || gear['Class Requirements'] === 'None'
      || gear['Class Requirements'].includes(currentClass);

    return matchesTypeOrSlot && classReqOk;
  });

  // Remove duplicates by Name
  const uniqueGear = [];
  for (const g of relevantGear) {
    if (!uniqueGear.some((u) => u.Name === g.Name)) {
      uniqueGear.push(g);
    }
  }

  // On select gear
  const handleSelectGear = (gearObj) => {
    // If perk/skill is already selected, block duplicates
    if (
      (['perk1','perk2','perk3','perk4'].includes(selectedSlot) &&
        Object.values(updatedGear).some((item) => item?.Name === gearObj.Name)) ||
      (['skill1','skill2'].includes(selectedSlot) &&
        Object.values(updatedGear).some((item) => item?.Name === gearObj.Name))
    ) {
      alert(`${gearObj.Name} has already been selected.`);
      return;
    }
    onSelect(gearObj.Name);
  };

  // Over button hover, show a gray overlay with stats color-coded by Rarity
  // We'll keep track of which gear is hovered. Then each button compares to that gear.
  const [hoveredGear, setHoveredGear] = useState(null);

  // Get color from rarity
  const getRarityColor = (rarity) => {
    if (!rarity) return '#FFFFFF'; // fallback if no rarity
    return rarityColorMap[rarity] || '#FFFFFF';
  };

  // Render the overlay stats block
  const renderHoverOverlay = (gearObj) => {
    // We'll show gear stats (except the name) in a gray background
    // color-coded by rarity
    const color = getRarityColor(gearObj.Rarity);
    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(64,64,64,0.7)', // gray overlay
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '5px',
          color: color,
          textAlign: 'center',
          cursor: 'pointer',
        }}
      >
        {/* We only show gearObj.Attributes and gearObj.Other or any extra fields.
            We skip the gear name to avoid duplication. */}
        {gearObj.Attributes && (
          <p style={{ margin: '0.25rem 0' }}>
            <strong>Attributes:</strong> {gearObj.Attributes}
          </p>
        )}
        {gearObj.Other && (
          <p style={{ margin: '0.25rem 0' }}>
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
        maxHeight: '80vh',
        overflowY: 'auto',
        width: '100%',
        maxWidth: '500px',
      }}
    >
      <h3>Select {selectedSlot?.charAt(0).toUpperCase() + selectedSlot?.slice(1)}</h3>

      {/* Gear grid */}
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
        {uniqueGear.map((gearObj) => {
          const name = gearObj.Name;
          const imgSrc = getGearImage(name, selectedSlot);

          // Keep truncated logic
          const truncatedOrFull = shouldTruncate ? truncateName(name) : name;
          const displayName = addSpacesBeforeCapitals(truncatedOrFull);

          return (
            <button
              key={name}
              onClick={() => handleSelectGear(gearObj)}
              onMouseEnter={() => setHoveredGear(gearObj)}
              onMouseLeave={() => setHoveredGear(null)}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '0.5rem',
                background: 'transparent',
                border: '1px solid #FFD700',
                color: '#FFD700',
                textAlign: 'center',
                cursor: 'pointer',
                borderRadius: '0.25rem',
                width: imgSrc ? 'auto' : '80px',
                height: imgSrc ? 'auto' : '80px',
                overflow: 'hidden',
              }}
            >
              {/* Gear image */}
              <img
                src={imgSrc}
                alt={name}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              />
              {/* Gear truncated name */}
              {displayName}

              {/* If we're hovering THIS gear, show the overlay */}
              {hoveredGear === gearObj && renderHoverOverlay(gearObj)}
            </button>
          );
        })}
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
}
