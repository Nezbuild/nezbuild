import React, { useState, useEffect, useCallback } from 'react';
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

const rarityColors = {
  Poor: '#A9A9A9',
  Common: '#FFFFFF',
  Uncommon: 'green',
  Rare: 'blue',
  Epic: 'purple',
  Legendary: 'orange',
  Unique: '#f0e6d2'
};

const gearImages = import.meta.glob('/src/assets/images/*.png', { eager: true });
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
  const [hoveredSlot, setHoveredSlot] = useState(null);

  const handleStatsUpdateInternal = useCallback((stats) => {
    setCalculatedStats(stats);
    if (onStatsUpdate) {
      onStatsUpdate(stats);
    }
  }, [onStatsUpdate]);

  useEffect(() => {
    if (gearSelections && Object.keys(gearSelections).length > 0) {
      setSelectedGear(gearSelections);
    }
  }, [gearSelections]);

  const handleRemoveGear = useCallback((slot) => {
    setSelectedGear((prev) => {
      const { [slot]: removedGear, ...updatedGear } = prev;
      // Remove Plate if Demon Armor is removed
      if (removedGear?.Name === 'Demon Armor') {
        Object.keys(updatedGear).forEach((key) => {
          if (updatedGear[key]?.Name?.split(' ')[0] === 'Plate') {
            delete updatedGear[key];
          }
        });
      }
      // Remove non-Fighter weapons if Weapon Mastery is removed
      if (removedGear?.Name === 'Weapon Mastery') {
        Object.keys(updatedGear).forEach((key) => {
          if (
            updatedGear[key]?.Type === 'Weapon' &&
            updatedGear[key]?.['Class Requirements'] &&
            !updatedGear[key]['Class Requirements'].includes('Fighter')
          ) {
            delete updatedGear[key];
          }
        });
      }
      handleGearSelection(updatedGear);
      return updatedGear;
    });
  }, [handleGearSelection]);

  const lockAndRemoveSlots = useCallback((primarySlot, secondarySlot) => {
    setSelectedGear((prev) => {
      const updatedGear = { ...prev };
      handleRemoveGear(secondarySlot);
      return updatedGear;
    });
    setLockedSlots((prev) => [...prev, secondarySlot]);
  }, [handleRemoveGear]);

  const unlockSlots = useCallback((primarySlot, secondarySlot) => {
    setLockedSlots((prev) => prev.filter((slot) => slot !== secondarySlot));
  }, []);

  const handleGearClick = useCallback((slot) => {
    if (lockedSlots.includes(slot)) return;
    setSelectedSlot(slot);
    setPopupVisible(slot);
  }, [lockedSlots]);

  const handleSelectGearName = useCallback((gearName) => {
    setSelectedGearName(gearName);
    setPopupVisible(null);
    setRarityPromptVisible(true);
  }, []);

  const handleSelectRarity = useCallback((rarity) => {
    const shouldTruncate = ['head', 'chest', 'gloves', 'cape', 'legs', 'feet'].includes(selectedSlot);
    const processedName = shouldTruncate ? truncateName(selectedGearName) : selectedGearName;
    const gearList = getGearDataBySlot(selectedSlot);
    const selectedGearItem = gearList.find(
      (gear) =>
        (shouldTruncate ? truncateName(gear.Name) : gear.Name) === processedName &&
        gear.Rarity === rarity
    );
    if (!selectedGearItem) return;
    const isTwoHanded = selectedGearItem['Slot']?.includes('Two Handed');
    const isPrimarySlot = ['Weapon11', 'Weapon21'].includes(selectedSlot);
    const primarySlot = isPrimarySlot
      ? selectedSlot
      : selectedSlot === 'Weapon12'
      ? 'Weapon11'
      : 'Weapon21';
    const secondarySlot = primarySlot === 'Weapon11' ? 'Weapon12' : 'Weapon22';
    const isWeapon = selectedGearItem['Type']?.includes('Weapon');
    const isPWeapon = selectedGearItem['Slot']?.includes('Primary Weapon');

    setSelectedGear((prev) => {
      const updatedGear = { ...prev };
      if (isWeapon) {
        if (isTwoHanded) {
          lockAndRemoveSlots(primarySlot, secondarySlot);
          updatedGear[primarySlot] = selectedGearItem;
        } else {
          unlockSlots(primarySlot, secondarySlot);
          if (isPWeapon) {
            updatedGear[primarySlot] = selectedGearItem;
          } else {
            updatedGear[secondarySlot] = selectedGearItem;
            if (updatedGear[primarySlot] && updatedGear[primarySlot].Slot.includes('Two Handed')) {
              handleRemoveGear(primarySlot);
            }
          }
        }
      } else {
        updatedGear[selectedSlot] = selectedGearItem;
      }
      handleGearSelection(updatedGear);
      return updatedGear;
    });

    updateData('gearSelections', {
      ...data.gearSelections,
      ...(isWeapon ? { [primarySlot]: selectedGearItem } : { [selectedSlot]: selectedGearItem })
    });
    setRarityPromptVisible(false);
    setSelectedSlot(null);
  }, [selectedSlot, selectedGearName, updateData, data.gearSelections, lockAndRemoveSlots, unlockSlots, handleRemoveGear, handleGearSelection]);

  const rarityColorsMap = useCallback((gear) => {
    if (!gear || !gear.Rarity) return '#FFD700';
    return rarityColors[gear.Rarity] || '#FFD700';
  }, []);

  const renderHoverOverlay = useCallback((slot) => {
    const gear = selectedGear[slot];
    if (!gear || hoveredSlot !== slot) return null;
    const textColor = rarityColorsMap(gear);
    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(128,128,128,0.5)',
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
  }, [selectedGear, hoveredSlot, rarityColorsMap]);

  return (
    <div
      style={{
        margin: '2rem 0',
        padding: '2rem',
        backgroundColor: '#222',
        border: '1px solid #444',
        borderRadius: '0.5rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
        color: '#FFD700'
      }}
    >
      <h2
        style={{
          fontSize: '2rem',
          marginBottom: '1.5rem',
          textShadow: '1px 1px 2px #000'
        }}
      >
        Step 4: Gear Layout
      </h2>

      <GearLayout>
        {[
          'head', 'chest', 'gloves', 'amulet', 'ring1', 'ring2', 'cape', 'legs', 'feet',
          'perk1', 'perk2', 'perk3', 'perk4', 'skill1', 'skill2',
          'Weapon11', 'Weapon12', 'Weapon21', 'Weapon22'
        ].map((slot) => {
          const gear = selectedGear[slot];
          const gearImage = gear ? getGearImage(gear.Name, slot) : null;
          const isLocked = lockedSlots.includes(slot);
          return (
            <div
              key={slot}
              className={`gear-slot ${slot} ${isLocked ? 'locked' : ''}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={() => setHoveredSlot(slot)}
              onMouseLeave={() => setHoveredSlot(null)}
            >
              <div
                onClick={() => handleGearClick(slot)}
                style={{
                  opacity: isLocked ? 0.5 : 1,
                  pointerEvents: isLocked ? 'none' : 'auto',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '100%'
                }}
                onMouseEnter={(e) => {
                  if (!isLocked) e.currentTarget.parentElement.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.parentElement.style.transform = 'scale(1)';
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

              {renderHoverOverlay(slot)}

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

      <div
        style={{
          flex: '0.5',
          maxWidth: '300px',
          padding: '10px',
          backgroundColor: '#222',
          border: '1px solid #FFD700',
          borderRadius: '10px',
          color: '#fff',
          marginTop: '1.5rem'
        }}
      >
        <ClassGearStatsTable
          selectedClass={data.class}
          equippedGear={selectedGear}
          onStatsUpdate={handleStatsUpdateInternal}
        />
      </div>
    </div>
  );
};

export default Step4;
