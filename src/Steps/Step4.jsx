import React, { useState, useEffect } from 'react';
import GearLayout from '../Styles/GearLayout';
import GearPopup from './Popups/GearPopup';
import RarityPopup from './Popups/RarityPopup.jsx';
import { truncateName } from './Utils/gearHelpers';
import gearData from '../assets/DarkAndDarkerGear.json';
import shieldsData from '../assets/Shields.json';
import weaponsData from '../assets/Weapons.json';
import mergeWeapons from '../assets/merged_weapons_shields.json';
import accessoriesData from '../assets/Accessories.json';
import skillsData from '../assets/SkillsAndPerks.json';
import ClassGearStatsTable from '../Components/ClassGearStatsTable';

const gearImages = import.meta.glob('/src/assets/images/*.png', { eager: true });

// Map rarities to colors
const rarityColors = {
  Poor: '#A9A9A9',    // light gray
  Common: '#FFFFFF',  // white
  Uncommon: 'green',
  Rare: 'blue',
  Epic: 'purple',
  Legendary: 'orange',
  Unique: '#f0e6d2'   // off-white
};

const getGearImage = (name, slot) => {
  const shouldTruncate = ['head', 'chest', 'gloves', 'cape', 'legs', 'feet'].includes(slot);
  const processedName = shouldTruncate ? truncateName(name) : name.replace(/\s+/g, '');

  const matchedImage = Object.entries(gearImages).find(([path]) =>
    path.toLowerCase().endsWith(`/${processedName.toLowerCase()}.png`)
  );
  return matchedImage ? matchedImage[1].default : '';
};

const getGearDataBySlot = (slot) => {
  if (['Weapon11', 'Weapon12', 'Weapon21', 'Weapon22'].includes(slot)) {
    return mergeWeapons;
  }
  if (['ring1', 'ring2', 'amulet'].includes(slot)) {
    return accessoriesData;
  }
  if (['head', 'chest', 'gloves', 'cape', 'legs', 'feet'].includes(slot)) {
    return gearData;
  }
  if (['perk1', 'perk2', 'perk3', 'perk4', 'skill1', 'skill2'].includes(slot)) {
    return skillsData;
  }
  return [];
};

const Step4 = ({ data, updateData, handleGearSelection, gearSelections, onStatsUpdate }) => {
  const [calculatedStats, setCalculatedStats] = useState({});
  const [popupVisible, setPopupVisible] = useState(null);
  const [rarityPromptVisible, setRarityPromptVisible] = useState(false);
  const [selectedGearName, setSelectedGearName] = useState(null);
  const [selectedGear, setSelectedGear] = useState({});
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [lockedSlots, setLockedSlots] = useState([]);
  // For the overlay: track which slot is hovered
  const [hoveredSlot, setHoveredSlot] = useState(null);

  // --- STATS update logic
  const handleStatsUpdate = (stats) => {
    console.log('📥 Step4 Received Stats:', stats);
    setCalculatedStats(stats);
    if (onStatsUpdate) {
      console.log('📤 Step4 Sending Stats to GuideCreationPage:', stats);
      onStatsUpdate(stats);
    } else {
      console.error('🚨 `onStatsUpdate` is undefined in Step4!');
    }
  };

  useEffect(() => {
    if (gearSelections && Object.keys(gearSelections).length > 0) {
      console.log('♻️ Reloading saved gear selections into updatedGear:', gearSelections);
      setSelectedGear(gearSelections);
    }
  }, [gearSelections]);

  // Remove gear logic
  const handleRemoveGear = (slot) => {
    setSelectedGear((prev) => {
      const { [slot]: removedGear, ...updatedGear } = prev;
      console.log(`🗑 Removed gear from slot: ${slot}`, removedGear);

      // If removing Demon Armor => remove all Plate
      const isDemonArmorRemoved = removedGear?.Name === 'Demon Armor';
      if (isDemonArmorRemoved) {
        Object.keys(updatedGear).forEach((key) => {
          if (updatedGear[key]?.Name?.split(' ')[0] === 'Plate') {
            console.log(`❌ Removing ${updatedGear[key].Name} (Blocked because Demon Armor was removed)`);
            delete updatedGear[key];
          }
        });
      }

      // If removing Weapon Mastery => remove non-Fighter weapons
      const isWeaponMasteryRemoved = removedGear?.Name === 'Weapon Mastery';
      if (isWeaponMasteryRemoved) {
        Object.keys(updatedGear).forEach((key) => {
          if (
            updatedGear[key]?.Type === 'Weapon' &&
            updatedGear[key]?.['Class Requirements'] &&
            !updatedGear[key]['Class Requirements'].includes('Fighter')
          ) {
            console.log(`❌ Removing ${updatedGear[key].Name} (Blocked because Weapon Mastery was removed)`);
            delete updatedGear[key];
          }
        });
      }

      handleGearSelection(updatedGear);
      return updatedGear;
    });
  };

  const lockAndRemoveSlots = (primarySlot, secondarySlot) => {
    setSelectedGear((prev) => {
      const updatedGear = { ...prev };
      handleRemoveGear(secondarySlot);
      return updatedGear;
    });
    setLockedSlots((prevLocks) => [...prevLocks, secondarySlot]);
  };

  const unlockSlots = (primarySlot, secondarySlot) => {
    setLockedSlots((prevLocks) => prevLocks.filter((slot) => slot !== secondarySlot));
  };

  const handleGearClick = (slot) => {
    if (lockedSlots.includes(slot)) {
      console.warn(`Slot ${slot} is locked.`);
      return;
    }
    setSelectedSlot(slot);
    setPopupVisible(slot);
  };

  const handleSelectGearName = (gearName) => {
    setSelectedGearName(gearName);
    setPopupVisible(null);
    setRarityPromptVisible(true);
  };

  const handleSelectRarity = (rarity) => {
    const shouldTruncate = ['head', 'chest', 'gloves', 'cape', 'legs', 'feet'].includes(selectedSlot);
    const processedName = shouldTruncate ? truncateName(selectedGearName) : selectedGearName;
    const gearList = getGearDataBySlot(selectedSlot);

    const selectedGearItem = gearList.find(
      (gear) =>
        (shouldTruncate ? truncateName(gear.Name) : gear.Name) === processedName &&
        gear.Rarity === rarity
    );
    if (!selectedGearItem) {
      console.error(`❌ No gear found for ${processedName} with rarity ${rarity}`);
      return;
    }

    // -- WEAPON Logic
    const isTwoHanded = selectedGearItem['Slot']?.includes('Two Handed');
    const isPrimarySlot = ['Weapon11', 'Weapon21'].includes(selectedSlot);
    const primarySlot = isPrimarySlot ? selectedSlot : selectedSlot === 'Weapon12' ? 'Weapon11' : 'Weapon21';
    const secondarySlot = primarySlot === 'Weapon11' ? 'Weapon12' : 'Weapon22';
    const isWeapon = selectedGearItem['Type']?.includes('Weapon');
    const isPWeapon = selectedGearItem['Slot']?.includes('Primary Weapon');

    setSelectedGear((prev) => {
      const updatedGear = { ...prev };

      if (isWeapon) {
        if (isTwoHanded) {
          lockAndRemoveSlots(primarySlot, secondarySlot);
          updatedGear[primarySlot] = selectedGearItem;
          console.log(`⚔ Two-handed weapon assigned to ${primarySlot}`);
        } else {
          unlockSlots(primarySlot, secondarySlot);
          if (isPWeapon) {
            updatedGear[primarySlot] = selectedGearItem;
          } else {
            updatedGear[secondarySlot] = selectedGearItem;
            if (
              updatedGear[primarySlot] &&
              updatedGear[primarySlot].Slot.includes('Two Handed')
            ) {
              handleRemoveGear(primarySlot);
            }
          }
        }
      } else {
        updatedGear[selectedSlot] = selectedGearItem;
      }

      console.log('🔄 Updated Gear State:', updatedGear);
      handleGearSelection(updatedGear);
      return updatedGear;
    });

    updateData('gearSelections', {
      ...data.gearSelections,
      [primarySlot]: selectedGearItem
    });

    setRarityPromptVisible(false);
    setSelectedSlot(null);
  };

  // Function to retrieve text color for a gear's rarity
  const getRarityColor = (gear) => {
    if (!gear || !gear.Rarity) return '#FFD700'; // fallback color
    return rarityColors[gear.Rarity] || '#FFD700';
  };

  // Renders an overlay on hover with gear stats
  const renderHoverOverlay = (slot) => {
    const gear = selectedGear[slot];
    if (!gear) return null; // no gear => no overlay
    if (hoveredSlot !== slot) return null; // only show if hovered

    const textColor = getRarityColor(gear);

    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(128,128,128,0.5)', // gray overlay
          color: textColor,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '0.5rem',
          boxSizing: 'border-box'
        }}
      >
        {/* We'll show gear Rarity, Attributes, Other. We omit gear name. */}
        {gear.Rarity && (
          <p style={{ margin: 0 }}>
            <strong>Rarity:</strong> {gear.Rarity}
          </p>
        )}
        {gear.Attributes && (
          <p style={{ margin: 0 }}>
            <strong>Attributes:</strong> {gear.Attributes}
          </p>
        )}
        {gear.Other && (
          <p style={{ margin: 0 }}>
            <strong>Other:</strong> {gear.Other}
          </p>
        )}
      </div>
    );
  };

  return (
    <div>
      <h2>Step 3: Gear Layout</h2>

      <GearLayout>
        {[
          'head', 'chest', 'gloves', 'amulet', 'ring1', 'ring2', 'cape', 'legs', 'feet',
          'perk1', 'perk2', 'perk3', 'perk4', 'skill1', 'skill2',
          'Weapon11', 'Weapon12', 'Weapon21', 'Weapon22'
        ].map((slot) => {
          const gear = selectedGear[slot];
          const gearImage = gear ? getGearImage(gear.Name, slot) : null;

          return (
            <div
              key={slot}
              className={`gear-slot ${slot} ${lockedSlots.includes(slot) ? 'locked' : ''}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}
              onMouseEnter={() => setHoveredSlot(slot)}
              onMouseLeave={() => setHoveredSlot(null)}
            >
              {/* Gear Slot (clickable) */}
              <div
                onClick={() => handleGearClick(slot)}
                style={{
                  opacity: lockedSlots.includes(slot) ? 0.5 : 1,
                  pointerEvents: lockedSlots.includes(slot) ? 'none' : 'auto',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '100%'
                }}
              >
                {gear ? (
                  <img
                    src={gearImage}
                    alt={gear.Name}
                    style={{ width: '80%', height: '80%', objectFit: 'contain' }}
                  />
                ) : (
                  slot
                )}
              </div>

              {/* Hover Overlay with stats */}
              {renderHoverOverlay(slot)}

              {/* Remove Button */}
              {gear && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveGear(slot);
                  }}
                  style={{
                    position: 'absolute',
                    bottom: '-20px',
                    backgroundColor: 'transparent',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    padding: '4px 8px',
                    cursor: 'pointer',
                    fontSize: '6px'
                  }}
                >
                  ❌
                </button>
              )}
            </div>
          );
        })}
      </GearLayout>

      {/* Popups */}
      <GearPopup
        visible={popupVisible}
        selectedSlot={selectedSlot}
        currentClass={data.class}
        onSelect={handleSelectGearName}
        onClose={() => setPopupVisible(null)}
        updatedGear={gearSelections}
      />

      <RarityPopup
        visible={rarityPromptVisible}
        gearName={selectedGearName}
        onSelect={handleSelectRarity}
        onClose={() => setRarityPromptVisible(false)}
      />

      {/* Class Stats Table */}
      <div
        style={{
          flex: '0.5',
          maxWidth: '300px',
          padding: '10px',
          backgroundColor: '#222',
          border: '1px solid #FFD700',
          borderRadius: '10px',
          color: '#fff'
        }}
      >
        <ClassGearStatsTable
          selectedClass={data.class}
          equippedGear={selectedGear}
          onStatsUpdate={handleStatsUpdate}
        />
      </div>
    </div>
  );
};

export default Step4;
