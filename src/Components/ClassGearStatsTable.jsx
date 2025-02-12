import React from 'react';
import ClassStats from './ClassStats'; // Import class base stats

const ClassGearStatsTable = ({ selectedClass, equippedGear }) => {
  if (!selectedClass || !ClassStats[selectedClass]) return null; // Ensure class exists

  const baseStats = ClassStats[selectedClass];

  // Function to calculate total stats
  const calculateTotalStats = () => {
    let totalStats = { ...baseStats };
    let flatHealthBonus = 0;
    let percentHealthBonus = 0;

    Object.values(equippedGear).forEach((gear) => {
      if (gear) {
        // Extract attributes
        if (gear.Attributes) {
          const attributesArray = gear.Attributes.split(',');
          attributesArray.forEach((attr) => {
            const [value, stat] = attr.trim().split(' ');
            if (stat && !isNaN(value)) {
              totalStats[stat] = (totalStats[stat] || 0) + parseInt(value, 10);
            }
          });
        }

        // Extract flat max health bonus
        if (gear.Other) {
          const flatHealthMatch = gear.Other.match(/(\d+)~?\d*\s*Max Health/);
          if (flatHealthMatch) {
            flatHealthBonus += parseInt(flatHealthMatch[1]);
          }

          // Extract percentage max health bonus
          const percentHealthMatch = gear.Other.match(/(\d+)~?\d*%\s*Max Health Bonus/);
          if (percentHealthMatch) {
            percentHealthBonus += parseInt(percentHealthMatch[1]) / 100;
          }
        }
      }
    });

    // Apply health calculations
    totalStats.Health = Math.floor((baseStats.Health + flatHealthBonus) * (1 + percentHealthBonus));
    return totalStats;
  };

  const totalStats = calculateTotalStats();

  return (
    <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #FFD700', borderRadius: '10px' }}>
      <h3>{selectedClass} Stats</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr>
            <th>Stat</th>
            <th>Base</th>
            <th>Gear Bonus</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(baseStats).map((stat) => (
            <tr key={stat}>
              <td>{stat}</td>
              <td>{baseStats[stat]}</td>
              <td>{totalStats[stat] - baseStats[stat] || 0}</td>
              <td>{totalStats[stat]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClassGearStatsTable;
