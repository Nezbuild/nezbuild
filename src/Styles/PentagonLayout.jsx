import React from 'react';

/**
 * Calculates (left, top) coordinates for the 5 vertices of a regular pentagon,
 * centered in a container of a given size.
 */
function getPentagonPositions(size = 200, offset = 100) {
  const numVertices = 5;
  const angleStep = (2 * Math.PI) / numVertices;
  const radius = size * 0.4;
  const positions = [];
  for (let i = 0; i < numVertices; i++) {
    // start at -90° (top center)
    const angle = i * angleStep - Math.PI / 2;
    const x = offset + radius * Math.cos(angle);
    const y = offset + radius * Math.sin(angle);
    positions.push({ left: x, top: y });
  }
  return positions;
}

/**
 * PentagonLayout
 * 
 * @param {Array} spells        - Array of 5 spells for these slots
 * @param {Number} startIndex   - 0 for the first pentagon, 5 for the second
 * @param {Function} onSlotClick
 * @param {Function} onRemoveSpell
 * @param {Function} getSpellImage
 * @param {Array} overCapacityMap
 * @param {Boolean} isEnabled   - If false, all these slots are disabled/grayed out
 * @param {Boolean} readOnly    - If true, hide over-capacity overlay & remove button
 */
export default function PentagonLayout({
  spells,
  startIndex,
  onSlotClick,
  onRemoveSpell,
  getSpellImage,
  overCapacityMap = [],
  isEnabled = false,
  readOnly = false
}) {
  const size = 350;
  const positions = getPentagonPositions(size, size / 2);

  return (
    // Outer wrapper: takes full width of the 1200px page with left/right padding.
    <div
      style={{
        width: '600px',
        boxSizing: 'border-box',
        padding: '0 20px', // Adjust this padding if needed
        margin: '20px auto'
      }}
    >
      {/* Inner container remains fixed at 350px x 350px and is centered */}
      <div
        style={{
          position: 'relative',
          width: `${size}px`,
          height: `${size}px`,
          margin: '0 auto'
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
                disabled={!isEnabled || readOnly}
                style={{
                  width: '90px',
                  height: '90px',
                  border: '1px solid #FFD700',
                  borderRadius: '10%',
                  background: isEnabled
                    ? (spell ? '#666' : 'transparent')
                    : 'transparent',
                  color: '#FFD700',
                  cursor: isEnabled && !readOnly ? 'pointer' : 'not-allowed',
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
                    {/* Red overlay if over capacity and not readOnly */}
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
                  <span style={{ fontSize: '12px' }}>Slot {slotIndex + 1}</span>
                )}
              </button>

              {/* "Remove" button (only shown if a spell exists and not in readOnly mode) */}
              {spell && !readOnly && (
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
    </div>
  );
}
