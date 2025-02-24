import React, { useState, useMemo, useCallback } from 'react';
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

const extractPerks = (gearObj) => {
  return Object.values(gearObj)
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

  // Memoize extracted perks from updatedGear
  const perks = useMemo(() => extractPerks(updatedGear), [updatedGear]);
  const hasSlayer = useMemo(() => perks.includes('Slayer'), [perks]);
  const hasWeaponMastery = useMemo(() => perks.includes('Weapon Mastery'), [perks]);
  const hasDemonArmor = useMemo(() => perks.includes('Demon Armor'), [perks]);

  // Determine whether to truncate gear names
  const shouldTruncate = useMemo(() => 
    ['head', 'chest', 'gloves', 'cape', 'legs', 'feet'].includes(selectedSlot),
    [selectedSlot]
  );

  // Mapping for display types based on slot
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

  // Memoize the filtered, unique gear list based on the slot and class
  const uniqueGear = useMemo(() => {
    let gearArray;
    if (['Weapon11','Weapon12','Weapon21','Weapon22'].includes(selectedSlot)) {
      gearArray = mergeWeapons;
    } else if (['ring1','ring2','amulet'].includes(selectedSlot)) {
      gearArray = accessoriesData;
    } else if (['perk1','perk2','perk3','perk4'].includes(selectedSlot)) {
      gearArray = skillsData.filter((gear) => gear.Type === 'Perk');
    } else if (['skill1','skill2'].includes(selectedSlot)) {
      gearArray = skillsData.filter((gear) => gear.Type === 'Skill');
    } else {
      gearArray = gearData;
    }
    // Filter logic:
    const filtered = gearArray.filter((gear) => {
      const firstWord = gear.Name.split(' ')[0];
      const isPlate = firstWord === 'Plate';
      const isWeapon = typeMap[selectedSlot] === 'Weapon';
      const isPerk = typeMap[selectedSlot] === 'Perk';
      const hasPlateArmorEquipped = Object.values(updatedGear).some(
        (eqGear) => eqGear?.Name && eqGear.Name.split(' ')[0] === 'Plate'
      );
      if (hasSlayer && isPlate && !hasDemonArmor) return false;
      if (hasWeaponMastery && isWeapon) return true;
      if (hasDemonArmor && isPlate && gear.Type === typeMap[selectedSlot]) return true;
      if (isPerk && gear.Name === 'Slayer' && hasPlateArmorEquipped) return false;
      const matchesTypeOrSlot =
        ['perk1','perk2','perk3','perk4','skill1','skill2'].includes(selectedSlot) ||
        gear.Type === typeMap[selectedSlot];
      const classReqOk =
        ['ring1','ring2','amulet'].includes(selectedSlot) ||
        !gear['Class Requirements'] ||
        gear['Class Requirements'] === 'None' ||
        gear['Class Requirements'].includes(currentClass);
      return matchesTypeOrSlot && classReqOk;
    });
    // Remove duplicates by Name
    const unique = [];
    for (const g of filtered) {
      if (!unique.some((u) => u.Name === g.Name)) {
        unique.push(g);
      }
    }
    return unique;
  }, [selectedSlot, currentClass, updatedGear, hasSlayer, hasDemonArmor, hasWeaponMastery, typeMap]);

  // Handler for selecting gear
  const handleSelectGear = useCallback((gearObj) => {
    const slotType = ['perk1','perk2','perk3','perk4','skill1','skill2'].includes(selectedSlot)
      ? selectedSlot
      : null;
    // Prevent duplicates for perks/skills
    if (
      slotType &&
      Object.values(updatedGear).some((item) => item?.Name === gearObj.Name)
    ) {
      alert(`${gearObj.Name} has already been selected.`);
      return;
    }
    onSelect(gearObj.Name);
  }, [selectedSlot, updatedGear, onSelect]);

  // State for which gear is hovered
  const [hoveredGear, setHoveredGear] = useState(null);

  // Memoized function to get color from rarity
  const getRarityColor = useCallback((rarity) => {
    if (!rarity) return '#FFFFFF';
    return rarityColorMap[rarity] || '#FFFFFF';
  }, []);

  // Render overlay with gear stats
  const renderHoverOverlay = useCallback((gearObj) => {
    const color = getRarityColor(gearObj.Rarity);
    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(64,64,64,0.7)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '5px',
          color: color,
          textAlign: 'center',
          cursor: 'pointer'
        }}
      >
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
  }, [getRarityColor]);

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
        maxWidth: '500px'
      }}
    >
      <h3>
        Select {selectedSlot?.charAt(0).toUpperCase() + selectedSlot?.slice(1)}
      </h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.5rem',
          padding: '0.5rem',
          background: '#222222',
          borderRadius: '0.25rem',
          width: '100%'
        }}
      >
        {uniqueGear.map((gearObj) => {
          const name = gearObj.Name;
          const imgSrc = getGearImage(name, selectedSlot);
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
                overflow: 'hidden'
              }}
            >
              <img
                src={imgSrc}
                alt={name}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  pointerEvents: 'none',
                  userSelect: 'none'
                }}
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              />
              {displayName}
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
          cursor: 'pointer'
        }}
      >
        Close
      </button>
    </div>
  );
}
