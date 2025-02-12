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

const Step4 = ({ data, updateData }) => {
  const [popupVisible, setPopupVisible] = useState(null);
  const [rarityPromptVisible, setRarityPromptVisible] = useState(false);
  const [selectedGearName, setSelectedGearName] = useState(null);
  const [selectedGear, setSelectedGear] = useState({});
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [lockedSlots, setLockedSlots] = useState([]);

  useEffect(() => {
    console.log("Loaded Gear Data:", { gearData, shieldsData, weaponsData, accessoriesData });
  }, []);

  const lockAndRemoveSlots = (primarySlot, secondarySlot) => {
    setSelectedGear((prev) => {
      const updatedGear = { ...prev };
      delete updatedGear[secondarySlot]; // Only remove the secondary slot
      return updatedGear;
    });
  
    setLockedSlots((prevLocks) => [...prevLocks, secondarySlot]); // Lock only the secondary slot
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
    
    // Determine whether to truncate
    const shouldTruncate = ['head', 'chest', 'gloves', 'cape', 'legs', 'feet'].includes(selectedSlot);
  
    // Processed name with or without truncation
    const processedName = shouldTruncate ? truncateName(selectedGearName) : selectedGearName;
  
    // Get gear list for the selected slot
    const gearList = getGearDataBySlot(selectedSlot);
  
    // Log all available gear names in the list
    gearList.forEach((gear) => {
    });
  
    // Attempt to find the correct gear in the list
    const selectedGearItem = gearList.find(
      (gear) => (shouldTruncate ? truncateName(gear.Name) : gear.Name) === processedName && gear.Rarity === rarity
    );
  
    if (!selectedGearItem) {
      console.error(`❌ No gear found for ${processedName} with rarity ${rarity}`);
      return;
    }
    
    // --- WEAPON LOGIC ---
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
          }
        }
      } else {
        updatedGear[selectedSlot] = selectedGearItem;
      }
  
      console.log("🔄 Updated Gear State:", updatedGear);
      return updatedGear;
    });
  
    // Update the data with the correct slot assignment
    updateData('gearSelections', {
      ...data.gearSelections,
      [primarySlot]: selectedGearItem
    });
  
    setRarityPromptVisible(false);
    setSelectedSlot(null);
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
              onClick={() => handleGearClick(slot)}
              style={{
                opacity: lockedSlots.includes(slot) ? 0.5 : 1,
                pointerEvents: lockedSlots.includes(slot) ? 'none' : 'auto',
              }}
            >
              {gear ? (
                <img
                  src={gearImage}
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

      <GearPopup
        visible={popupVisible}
        selectedSlot={selectedSlot}
        currentClass={data.class}
        onSelect={handleSelectGearName}
        onClose={() => setPopupVisible(null)}
      />

      <RarityPopup
        visible={rarityPromptVisible}
        gearName={selectedGearName}
        onSelect={handleSelectRarity}
        onClose={() => setRarityPromptVisible(false)}
      />
    </div>
  );
};

export default Step4;