// PentagonLayout.jsx
import React from 'react';

/**
 * Calculates (left, top) coords for 5 vertices of a regular pentagon,
 * centered in a size x size container.
 */
function getPentagonPositions(size = 200, offset = 100) {
  const numVertices = 5;
  const angleStep = (2 * Math.PI) / numVertices;
  const radius = size * 0.4;

  const positions = [];
  for (let i = 0; i < numVertices; i++) {
    // start at -90°, top center
    const angle = i * angleStep - Math.PI / 2;
    const x = offset + radius * Math.cos(angle);
    const y = offset + radius * Math.sin(angle);
    positions.push({ left: x, top: y });
  }
  return positions;
}

/**
 * PentagonLayout
 * @param {Array} spells        5 spells for these slots
 * @param {Number} startIndex   0 for first pentagon, 5 for second
 * @param {Function} onSlotClick
 * @param {Function} onRemoveSpell
 * @param {Function} getSpellImage
 * @param {Array} overCapacityMap
 * @param {Boolean} isEnabled   If false, all these slots are disabled/grayed out
 */
export default function PentagonLayout({
  spells,
  startIndex,
  onSlotClick,
  onRemoveSpell,
  getSpellImage,
  overCapacityMap = [],
  isEnabled = false
}) {
  const size = 350;
  const positions = getPentagonPositions(size, size / 2);

  return (
    <div
      style={{
        position: 'relative',
        width: `${size}px`,
        height: `${size}px`,
        margin: '20px',
      }}
    >
      {positions.map((pos, i) => {
        const spell = spells[i];
        const slotIndex = startIndex + i;
        const isOver = overCapacityMap[slotIndex];

        return (
          <div
            key={slotIndex}
            style={{
              position: 'absolute',
              left: `${pos.left}px`,
              top: `${pos.top}px`,
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            {/* Spell Button */}
            <button
              onClick={() => onSlotClick?.(slotIndex)}
              disabled={!isEnabled}
              style={{
                width: '90px',
                height: '90px',
                border: '1px solid #FFD700',
                borderRadius: '10%',
                background: isEnabled
                  ? (spell ? '#666' : 'transparent')
                  : 'transparent',            // gray if disabled
                color: '#FFD700',
                cursor: isEnabled ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {spell ? (
                <>
                  <img
                    src={getSpellImage(spell.Name)}
                    alt={spell.Name}
                    style={{
                      width: '80%',
                      height: '80%',
                      objectFit: 'contain'
                    }}
                  />
                  {/* Red overlay if over capacity */}
                  {isOver && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(255, 0, 0, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <div
                        style={{
                          color: '#ff0000',
                          fontSize: '2rem',
                          fontWeight: 'bold',
                          textShadow: '1px 1px 2px #000'
                        }}
                      >
                        X
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <span style={{ fontSize: '12px' }}>
                  Slot {slotIndex + 1}
                </span>
              )}
            </button>

            {/* "Remove" button only if there's a spell. 
                Also disabled if isEnabled === false */}
            {spell && (
              <button
                onClick={() => onRemoveSpell?.(slotIndex)}
                disabled={!isEnabled}
                style={{
                  marginTop: '5px',
                  padding: '0 5px',
                  fontSize: '12px',
                  background: 'transparent',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: isEnabled ? 'pointer' : 'not-allowed'
                }}
              >
                ❌
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
