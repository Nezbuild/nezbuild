import React from 'react';
import ClassStats from './ClassStats'; // Import class base stats

const ClassGearStatsTable = ({ selectedClass, equippedGear }) => {
  console.log("Selected Class:", selectedClass);
  console.log("Equipped Gear:", equippedGear);

  if (!selectedClass || !ClassStats[selectedClass]) return null; // Ensure class exists

  const baseStats = ClassStats[selectedClass];

  // Function to extract perks from equippedGear
  const extractPerks = () => {
    return Object.values(equippedGear)
      .filter(gear => gear.Type === 'Perk')
      .map(perk => perk.Name);
  };

  const perks = extractPerks();
  console.log("Extracted Perks:", perks);

  // Function to calculate total stats
  const calculateTotalStats = () => {
    let totalStats = { ...baseStats };
    let flatHealthBonus = 0;
    let percentHealthBonus = 0;
    let addedStrength = 0;
    let addedVigor = 0;

    Object.values(equippedGear).forEach((gear) => {
      if (gear) {
        console.log("Processing Gear:", gear);
        // Extract attributes
        if (gear.Attributes) {
          const attributesArray = gear.Attributes.split(',');
          attributesArray.forEach((attr) => {
            const [value, stat] = attr.trim().split(' ');
            if (stat && !isNaN(value)) {
              totalStats[stat] = (totalStats[stat] || 0) + parseInt(value, 10);
              if (stat === 'Strength') addedStrength += parseInt(value, 10);
              if (stat === 'Vigor') addedVigor += parseInt(value, 10);
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

    console.log("Total Strength Added:", addedStrength);
    console.log("Total Vigor Added:", addedVigor);

    // Apply new health formula using added Strength and Vigor only
    totalStats.Health = Math.ceil(baseStats.Health + (0.438 * addedStrength) + (1.513 * addedVigor) + flatHealthBonus);
    totalStats.AddedStrength = addedStrength;
    totalStats.AddedVigor = addedVigor;

    // Apply perk effects
    if (perks.includes('Malice')) {
      totalStats.Will = Math.ceil((totalStats.Will || baseStats.Will || 0) * 1.1);
    }
    if (perks.includes('Robust')) {
      totalStats.Health = Math.ceil(totalStats.Health * 1.1);
    }
    if (perks.includes('Sage')) {
      totalStats.Knowledge = Math.ceil((totalStats.Knowledge || baseStats.Knowledge || 0) * 1.1);
    }
    if (perks.includes('Jokester')) {
      Object.keys(totalStats).forEach((stat) => {
        if (typeof totalStats[stat] === 'number') {
          totalStats[stat] += 2;
        }
      });
    }

    console.log("Final Total Stats:", totalStats);
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
              <td>{stat === 'Strength' ? totalStats.AddedStrength : stat === 'Vigor' ? totalStats.AddedVigor : totalStats[stat] - baseStats[stat] || 0}</td>
              <td>{totalStats[stat]}</td>
            </tr>
          ))}
          <tr>
            <td>Health</td>
            <td>{baseStats.Health}</td>
            <td>{totalStats.Health - baseStats.Health}</td>
            <td>{totalStats.Health}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ClassGearStatsTable;
