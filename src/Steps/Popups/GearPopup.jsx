import React, { useState } from 'react';
import { addSpacesBeforeCapitals, truncateName } from '../Utils/gearHelpers';
import gearData from '/src/assets/DarkAndDarkerGear.json';
import weaponsData from '/src/assets/Weapons.json';
import accessoriesData from '/src/assets/Accessories.json';
import mergeWeapons from '/src/assets/merged_weapons_shields.json';
import skillsData from '/src/assets/SkillsAndPerks.json';
console.log("🔍 Skills Data Loaded:", skillsData);
const gearImages = import.meta.glob('/src/assets/images/*.png', { eager: true });
console.log("Accessories Data:", accessoriesData);

const getGearImage = (name, slot) => {
    const shouldTruncate = ['head', 'chest', 'gloves', 'cape', 'legs', 'feet'].includes(slot);
    const processedName = shouldTruncate ? truncateName(name) : name.replace(/\s+/g, '');
    const matchedImage = Object.entries(gearImages).find(([path]) => 
      path.toLowerCase().endsWith(`/${processedName.toLowerCase()}.png`)
    );
    return matchedImage ? matchedImage[1].default : '';
};

const GearPopup = ({ visible, selectedSlot, currentClass, onSelect, onClose, updatedGear }) => {
    const selectedGearArray = Object.values(updatedGear).flat();  // Convert object to array
    const shouldTruncate = ['head', 'chest', 'gloves', 'cape', 'legs', 'feet'].includes(selectedSlot);
    const [selectedImage, setSelectedImage] = useState(null);
    if (!visible) return null;

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

    const getRelevantGear = () => {
        if (['Weapon11', 'Weapon12', 'Weapon21', 'Weapon22'].includes(selectedSlot)) {
            return mergeWeapons;
        }
        if (['ring1', 'ring2', 'amulet'].includes(selectedSlot)) {
            return accessoriesData;
        }
        if (['perk1', 'perk2', 'perk3', 'perk4'].includes(selectedSlot)) {
            return skillsData.filter(gear => gear.Type === 'Perk');
        }
        if (['skill1', 'skill2'].includes(selectedSlot)) {
            return skillsData.filter(gear => gear.Type === 'Skill');
        }
        return gearData;
    };

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
          <h3>Select {selectedSlot?.charAt(0).toUpperCase() + selectedSlot?.slice(1)}</h3>
          <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '0.5rem',
                  padding: '0.5rem',
                  background: '#222222',
                  borderRadius: '0.25rem',
                  width: '100%',
          }}>
            {[...new Set(getRelevantGear()
              .filter(gear => 
                (
                  ['perk1', 'perk2', 'perk3', 'perk4', 'skill1', 'skill2'].includes(selectedSlot) || 
                  gear.Type === typeMap[selectedSlot]
                ) &&
                (
                  ['ring1', 'ring2', 'amulet'].includes(selectedSlot) || 
                  !gear['Class Requirements'] || gear['Class Requirements'] === "None" || 
                  gear['Class Requirements'].includes(currentClass)
                )
              )
              .map(gear => gear.Name)
            )].map((name) => {
              const imgSrc = getGearImage(name, selectedSlot);
              return (
                <button
                  key={name}
                  onClick={() => {
                    if (
                      (['perk1', 'perk2', 'perk3', 'perk4'].includes(selectedSlot) &&
                          Object.values(updatedGear).some(item => item?.Name === name)) ||
                      (['skill1', 'skill2'].includes(selectedSlot) &&
                          Object.values(updatedGear).some(item => item?.Name === name))
                      ) {
                          alert(`${name} has already been selected.`);
                          return;
                      }
                  
                    console.log(updatedGear);
                    setSelectedImage(imgSrc);
                    onSelect(name);
                  }}
                
                  style={{                  
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
                      height: imgSrc ? 'auto' : '80px'
                  }}
                >
                  <img
                    src={imgSrc}
                    alt={name}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', pointerEvents: 'none', userSelect: 'none' }}
                    onContextMenu={(e) => e.preventDefault()} 
                    onDragStart={(e) => e.preventDefault()} 
                  />
                  {addSpacesBeforeCapitals(shouldTruncate ? truncateName(name) : name)}
                </button>
              );
            })}
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

export default GearPopup;
