import React, { useState, useEffect } from 'react';
import ClassStats from './ClassStats';
import styled from 'styled-components';

const ClassGearStatsTable = ({ selectedClass, equippedGear, onStatsUpdate }) => {
  if (!selectedClass || !ClassStats[selectedClass]) return null; // Ensure class exists

  const baseStats = ClassStats[selectedClass];

  // Extract perks from equippedGear
  const extractPerks = () =>
    Object.values(equippedGear)
      .filter(gear => gear.Type === 'Perk')
      .map(perk => perk.Name);

  const perks = extractPerks();

  // Calculate total stats
  const calculateTotalStats = () => {
    let totalStats = { ...baseStats };
    let flatHealthBonus = 0;
    let percentHealthBonus = 0;
    let addedStrength = 0;
    let addedVigor = 0;

    Object.values(equippedGear).forEach((gear) => {
      if (gear) {
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
        if (gear.Other) {
          const flatHealthMatch = gear.Other.match(/(\d+)~?\d*\s*Max Health/);
          if (flatHealthMatch) {
            flatHealthBonus += parseInt(flatHealthMatch[1], 10);
          }
          const percentHealthMatch = gear.Other.match(/(\d+)~?\d*%\s*Max Health Bonus/);
          if (percentHealthMatch) {
            percentHealthBonus += parseInt(percentHealthMatch[1], 10) / 100;
          }
        }
      }
    });

    // Calculate Health using added Strength and Vigor only
    totalStats.Health = Math.ceil(
      baseStats.Health +
        (0.438 * addedStrength) +
        (1.513 * addedVigor) +
        flatHealthBonus
    );
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
    return totalStats;
  };

  const [prevStats, setPrevStats] = useState(null);
  const totalStats = calculateTotalStats();

  // Prevent unnecessary updates
  useEffect(() => {
    if (JSON.stringify(prevStats) !== JSON.stringify(totalStats)) {
      setPrevStats(totalStats);
      onStatsUpdate({ ...totalStats, Memory: totalStats.Knowledge - 6 });
    }
  }, [totalStats, onStatsUpdate, prevStats]);

  return (
    <StatsContainer>
      <StatsTitle>{selectedClass} Stats</StatsTitle>
      <StatsTable>
        <thead>
          <tr>
            <TableHeader>Stat</TableHeader>
            <TableHeader>Base</TableHeader>
            <TableHeader>Bonus</TableHeader>
            <TableHeader>Total</TableHeader>
          </tr>
        </thead>
        <tbody>
          {Object.keys(baseStats).map((stat) =>
            stat !== 'Health' && stat !== 'Memory' && (
              <TableRow key={stat}>
                <TableCell>{stat}</TableCell>
                <TableCell>{baseStats[stat]}</TableCell>
                <TableCell>
                  {stat === 'Strength'
                    ? totalStats.AddedStrength
                    : stat === 'Vigor'
                    ? totalStats.AddedVigor
                    : totalStats[stat] - baseStats[stat] || 0}
                </TableCell>
                <TableCell>{totalStats[stat]}</TableCell>
              </TableRow>
            )
          )}
          <TableRow>
            <TableCell>Health</TableCell>
            <TableCell>{Math.ceil(baseStats.Health)}</TableCell>
            <TableCell>{totalStats.Health - Math.ceil(baseStats.Health)}</TableCell>
            <TableCell>{totalStats.Health}</TableCell>
          </TableRow>
          {baseStats.Memory !== undefined && (
            <TableRow>
              <TableCell>Memory</TableCell>
              <TableCell>{baseStats.Knowledge - 6}</TableCell>
              <TableCell>{totalStats.Knowledge - 6 - baseStats.Memory}</TableCell>
              <TableCell>{totalStats.Knowledge - 6}</TableCell>
            </TableRow>
          )}
        </tbody>
      </StatsTable>
    </StatsContainer>
  );
};

export default ClassGearStatsTable;

// Styled Components

const StatsContainer = styled.div`
  margin-top: 20px;
  padding: 10px 15px;
  border: 1px solid #ffd700;
  border-radius: 10px;
  background: #1a1a1a;
  color: #ffd700;
  font-family: 'Roboto', sans-serif;
`;

const StatsTitle = styled.h3`
  margin-bottom: 10px;
  font-size: 1.5rem;
  text-align: center;
  border-bottom: 1px solid #ffd700;
  padding-bottom: 5px;
`;

const StatsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
`;

const TableHeader = styled.th`
  padding: 8px 5px;
  text-align: left;
  border-bottom: 1px solid #ffd700;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background: rgba(255, 215, 0, 0.1);
  }
`;

const TableCell = styled.td`
  padding: 8px 5px;
  border-bottom: 1px solid #333;
`;
