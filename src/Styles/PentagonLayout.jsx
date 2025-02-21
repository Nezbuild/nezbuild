// PentagonLayout.js
import React from 'react';

/**
 * Calculates the (left, top) coordinates for a regular pentagon's vertices,
 * all centered within a square of size x size.
 * 
 * @param {Number} size   The width/height of the container (px).
 * @param {Number} offset The center offset from edges (distance from top/left).
 * @return {Array}        Array of 5 objects like { left, top } in px.
 */
function getPentagonPositions(size = 200, offset = 100) {
  const numVertices = 5;
  const angleStep = (2 * Math.PI) / numVertices;
  const radius = size * 0.4; // distance from center to vertex (tweak as needed)

  const positions = [];
  for (let i = 0; i < numVertices; i++) {
    // Start at -90 degrees so the first vertex is at the top
    const angle = i * angleStep - Math.PI / 2;
    const x = offset + radius * Math.cos(angle);
    const y = offset + radius * Math.sin(angle);
    positions.push({ left: x, top: y });
  }
  return positions;
}

/**
 * PentagonLayout
 * Renders 5 slots in a pentagon shape using absolute positioning.
 * 
 * @param {Array}   spells       Array of 5 spells (or empty placeholders)
 * @param {Number}  startIndex   Starting slot index (0 for first pentagon, 5 for second)
 * @param {Function} onSlotClick Callback when a slot is clicked
 * @param {Function} getSpellImage Function to get image path from spell name
 */
export default function PentagonLayout({ spells, startIndex, onSlotClick, getSpellImage }) {
  // We'll fix the container to 200px by 200px for demonstration
  const size = 350;
  const positions = getPentagonPositions(size, size / 2); 
  // positions is array of { left, top } for each of the 5 vertices

  return (
    <div
      style={{
        position: 'relative',
        width: `${size}px`,
        height: `${size}px`,
        border: '0px solid #FFD700',
        borderRadius: '10px',
        // background: '#444', // just to visualize container, remove if you want
      }}
    >
      {positions.map((pos, i) => {
        const spell = spells[i];
        const slotIndex = startIndex + i;

        return (
          <button
            key={slotIndex}
            onClick={() => onSlotClick(slotIndex)}
            style={{
              position: 'absolute',
              left: `${pos.left}px`,
              top: `${pos.top}px`,
              transform: 'translate(-50%, -20%)',
              width: '100px',
              height: '100px',
              border: '1px solid #FFD700',
              borderRadius: '10%',
              background: spell ? '#666' : 'transparent',
              color: '#FFD700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {spell ? (
              <img
                src={getSpellImage(spell.Name)}
                alt={spell.Name}
                style={{ width: '80px', height: '80px', objectFit:"contain" }}
              />
            ) : (
              <span style={{ fontSize: '12px' }}>Slot {slotIndex + 1}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
