import React from 'react';
import gearData from '/src/assets/DarkAndDarkerGear.json';
import weaponsData from '/src/assets/Weapons.json';
import mergeData from '/src/assets/merged_weapons_shields.json';
import accessoriesData from '/src/assets/Accessories.json';
import skillsData from '/src/assets/SkillsAndPerks.json';

const getRelevantGear = (gearName) => {
  const allGear = [...gearData, ...mergeData, ...accessoriesData, skillsData];
  return [...new Set(allGear
    .filter(gear => gear.Name === gearName && gear.Rarity)
    .map(gear => gear.Rarity))];
};

const RarityPopup = ({ visible, gearName, onSelect, onClose }) => {
  if (!visible) return null;

  const rarities = getRelevantGear(gearName);
  console.log('RARITYPOPUP ', gearName);

  if (rarities.length === 0 || rarities.length === 1) {
    onSelect(rarities[0]);
    return null;
  }

  if (rarities.length === 1) {
    onSelect(rarities[0]);
    return null;
  }

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
      maxHeight: '50vh',
      overflowY: 'auto',
      width: '100%',
      maxWidth: '400px',
     }}>
      <h3>Select Rarity</h3>
      <div style={{ 
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        justifyContent: 'center',
        padding: '0.5rem',
        background: '#222222',
        borderRadius: '0.25rem',
      }}>
        {rarities.map((rarity) => (
          <button
            key={rarity}
            onClick={() => onSelect(rarity)}
            style={{ 
              padding: '0.5rem 1rem',
              background: 'transparent',
              border: '1px solid #FFD700',
              color: '#FFD700',
              textAlign: 'center',
              cursor: 'pointer',
              borderRadius: '0.25rem',
             }}
          >
            {rarity}
          </button>
        ))}
      </div>
      <button onClick={onClose} style={{ 
        display: 'block',
        margin: '1rem auto 0',
        padding: '0.5rem 1rem',
        background: '#FFD700',
        color: '#000',
        border: 'none',
        borderRadius: '0.25rem',
        cursor: 'pointer',
      }}>
        Close
      </button>
    </div>
  );
};

export default RarityPopup;





// import React from 'react';
// import gearData from '/src/assets/DarkAndDarkerGear.json';
// import weaponsData from '/src/assets/Weapons.json';
// import mergeData from '/src/assets/merged_weapons_shields.json';
// import accessoriesData from '/src/assets/Accessories.json';
// import skillsData from '/src/assets/SkillsAndPerks.json';

// const getRelevantGear = (gearName) => {
//   const allGear = [...gearData, ...mergeData, ...accessoriesData, skillsData];
//   return [...new Set(allGear
//     .filter(gear => gear.Name === gearName)
//     .map(gear => gear.Rarity))];
// };

// const RarityPopup = ({ visible, gearName, onSelect, onClose }) => {
//   if (!visible) return null;

//   const rarities = getRelevantGear(gearName);
//   console.log('RARITYPOPUP ', gearName);
//   return (
//     <div style={{ 
//       position: 'fixed',
//       top: '50%',
//       left: '50%',
//       transform: 'translate(-50%, -50%)',
//       zIndex: 1000,
//       background: '#333333',
//       color: '#FFD700',
//       padding: '1rem',
//       borderRadius: '0.5rem',
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       maxHeight: '50vh',
//       overflowY: 'auto',
//       width: '100%',
//       maxWidth: '400px',
//      }}>
//       <h3>Select Rarity</h3>
//       <div style={{ 
//         display: 'flex',
//         flexWrap: 'wrap',
//         gap: '0.5rem',
//         justifyContent: 'center',
//         padding: '0.5rem',
//         background: '#222222',
//         borderRadius: '0.25rem',
//       }}>
//         {rarities.map((rarity) => (
//           <button
//             key={rarity}
//             onClick={() => onSelect(rarity)}
//             style={{ 
//               padding: '0.5rem 1rem',
//               background: 'transparent',
//               border: '1px solid #FFD700',
//               color: '#FFD700',
//               textAlign: 'center',
//               cursor: 'pointer',
//               borderRadius: '0.25rem',
//              }}
//           >
//             {rarity}
//           </button>
//         ))}
//       </div>
//       <button onClick={onClose} style={{ 
//         display: 'block',
//         margin: '1rem auto 0',
//         padding: '0.5rem 1rem',
//         background: '#FFD700',
//         color: '#000',
//         border: 'none',
//         borderRadius: '0.25rem',
//         cursor: 'pointer',
//       }}>
//         Close
//       </button>
//     </div>
//   );
// };

// export default RarityPopup;