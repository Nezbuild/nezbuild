// src/Steps/Step7.jsx
import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import GearLayout from '../Styles/GearLayout';
import { truncateName } from './Utils/gearHelpers';
import ClassGearStatsTable from '../Components/ClassGearStatsTable';
import Step6 from './Step6'; // Reuse Step6 for read-only spells

// Reuse getGearImage logic
const gearImages = import.meta.glob('/src/assets/images/*.png', { eager: true });
const getGearImage = (name, slot) => {
  const shouldTruncate = ['head', 'chest', 'gloves', 'cape', 'legs', 'feet'].includes(slot);
  const processedName = shouldTruncate ? truncateName(name) : name.replace(/\s+/g, '');
  const matchedImage = Object.entries(gearImages).find(([path]) =>
    path.toLowerCase().endsWith(`/${processedName.toLowerCase()}.png`)
  );
  return matchedImage ? matchedImage[1].default : '';
};

const rarityColors = {
  Poor: '#A9A9A9',
  Common: '#FFFFFF',
  Uncommon: 'green',
  Rare: 'blue',
  Epic: 'purple',
  Legendary: 'orange',
  Unique: '#f0e6d2'
};

const Step7 = ({
  guideData,
  characterStats,
  onPrevious,    // callback to go back
  onPublish,     // callback to finalize/publish
  hideBottomButtons // if true, bottom buttons will not render
}) => {
  const statsLeft = 850; // in pixels
  const [hoveredSlot, setHoveredSlot] = useState(null);

  const rarityColorsMap = useCallback((gear) => {
    if (!gear || !gear.Rarity) return '#FFD700';
    return rarityColors[gear.Rarity] || '#FFD700';
  }, []);

  // Render an overlay with gear details and dynamic text color based on rarity.
  const renderHoverOverlay = useCallback((slot) => {
    const gear = guideData.gearSelections[slot];
    if (!gear || hoveredSlot !== slot) return null;
    const textColor = rarityColorsMap(gear);
    return (
      <OverlayDiv style={{ color: textColor }}>
        {gear.Rarity && <p style={{ margin: 0 }}><strong>Rarity:</strong> {gear.Rarity}</p>}
        {gear.Attributes && <p style={{ margin: 0 }}><strong>Attributes:</strong> {gear.Attributes}</p>}
        {gear.Other && <p style={{ margin: 0 }}><strong>Other:</strong> {gear.Other}</p>}
      </OverlayDiv>
    );
  }, [guideData.gearSelections, hoveredSlot, rarityColorsMap]);

  return (
    <div style={{
      margin: '2rem 0',
      padding: '2rem',
      background: '#222',
      border: '1px solid #FFD700',
      borderRadius: '10px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.7)',
      color: '#FFD700',
      position: 'relative'
    }}>
      <h2 style={{ fontSize: '4rem', marginBottom: '1rem', textAlign: 'left' }}>
        {guideData.title || 'Untitled Guide'}
      </h2>

      {/* Short Description */}
      <div style={{
        fontSize: '2rem',
        marginBottom: '1rem',
        textAlign: 'left',
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
        maxWidth: '80%',
        margin: '0'
      }}>
        {guideData.shortDescription}
      </div>

      {/* Class */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        marginBottom: '2rem',
        justifyContent: 'left'
      }}>
        <img
          src={`../src/assets/images/${guideData.class}.png`}
          onError={(e) => (e.target.src = '../src/assets/images/fallback.png')}
          alt={guideData.class}
          style={{ width: '100px', height: '100px', borderRadius: '5px' }}
        />
        <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>
          {guideData.class}
        </span>
      </div>

      {/* Category & Tags */}
      <p style={{ textAlign: 'left', marginBottom: '0.5rem', fontSize: '2rem' }}>
        <strong>Category:</strong> {guideData.category}
      </p>
      <p style={{ textAlign: 'left', marginBottom: '1rem', fontSize: '2rem' }}>
        <strong>Tags:</strong> {guideData.tags.join(', ')}
      </p>

      {/* Container for Gear Layout and Stats Table overlay */}
      <div style={{ position: 'relative', marginBottom: '0rem' }}>
        <GearLayout>
          {[
            'head','chest','gloves','amulet','ring1','ring2','cape','legs','feet',
            'perk1','perk2','perk3','perk4','skill1','skill2',
            'Weapon11','Weapon12','Weapon21','Weapon22'
          ].map((slot) => {
            const gear = guideData.gearSelections[slot];
            const imageSrc = gear ? getGearImage(gear.Name, slot) : null;
            return (
              <div
                key={slot}
                className={`gear-slot ${slot}`}
                style={{ textAlign:'center', position: 'relative' }}
                onMouseEnter={() => setHoveredSlot(slot)}
                onMouseLeave={() => setHoveredSlot(null)}
              >
                {gear ? (
                  <img
                    src={imageSrc}
                    onError={(e) => (e.target.src = '../src/assets/images/fallback.png')}
                    alt={gear.Name}
                    style={{ width: '80%', height: '80%', objectFit: 'contain' }}
                  />
                ) : (
                  slot
                )}
                {renderHoverOverlay(slot)}
              </div>
            );
          })}
        </GearLayout>

        {/* Stats Table Overlaid on the Right */}
        <div style={{
          position: 'absolute',
          top: 80,
          left: `${statsLeft}px`
        }}>
          <ClassGearStatsTable
            selectedClass={guideData.class}
            equippedGear={guideData.gearSelections}
            onStatsUpdate={() => {}}
          />
        </div>
      </div>

      {/* Synergies */}
      {guideData.synergies.length > 0 ? (
        <>
          <h3 style={{ color: 'green', textAlign: 'left', fontSize: '3rem' }}>Synergies</h3>
          <div style={{
            marginBottom: '1rem',
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            justifyContent: 'left'
          }}>
            {guideData.synergies.map((synergy, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <img
                  src={`../src/assets/images/${synergy}.png`}
                  onError={(e) => (e.target.src = '../src/assets/images/fallback.png')}
                  alt={synergy}
                  style={{ width: '90px', height: '90px', marginBottom: '0.5rem' }}
                />
                <span style={{ fontSize: '1.5rem' }}>{synergy}</span>
              </div>
            ))}
          </div>
          <div style={{
            textAlign: 'left',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            maxWidth: '80%',
            margin: '0',
            fontSize: '1.75rem'
          }}>
            {guideData.synergyText}
          </div>
        </>
      ) : (
        <p style={{ color: 'gray', textAlign: 'left' }}>No synergies added yet.</p>
      )}

      {/* Threats */}
      {guideData.threats.length > 0 ? (
        <>
          <h3 style={{ color: 'red', textAlign: 'left', fontSize: '3rem' }}>Threats</h3>
          <div style={{
            marginBottom: '1rem',
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            justifyContent: 'left'
          }}>
            {guideData.threats.map((threat, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <img
                  src={`../src/assets/images/${threat}.png`}
                  onError={(e) => (e.target.src = '../src/assets/images/fallback.png')}
                  alt={threat}
                  style={{ width: '90px', height: '90px', marginBottom: '0.5rem' }}
                />
                <span style={{ fontSize: '1.5rem' }}>{threat}</span>
              </div>
            ))}
          </div>
          <div style={{
            textAlign: 'left',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            maxWidth: '80%',
            margin: '0',
            fontSize: '1.75rem'
          }}>
            {guideData.threatText}
          </div>
        </>
      ) : (
        <p style={{ color: 'gray', textAlign: 'left' }}>No threats added yet.</p>
      )}

      {/* Spells */}
      <h3 style={{ marginTop: '2rem', textAlign: 'center', fontSize: '3rem' }}>Spells</h3>
      <Step6
        selectedSpells={guideData.spells}
        setSelectedSpells={() => {}}
        selectedPerks={guideData.gearSelections}
        currentClass={guideData.class}
        memory={characterStats.Memory || 0}
        onNext={() => {}}
        onPrevious={() => {}}
        readOnly={true}
      />

      {/* Strategy Description */}
      {guideData.strategyDescription && (
        <div style={{ marginTop: '2rem', textAlign: 'left' }}>
          <h3 style={{ fontSize: '3rem' }}>Strategy Description</h3>
          <div
            style={{
              fontSize: '1.5rem',
              maxWidth: '80%',
              margin: '0'
            }}
            dangerouslySetInnerHTML={{ __html: guideData.strategyDescription }}
          />
        </div>
      )}

      {/* Bottom Button */}
      {!hideBottomButtons && (
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button
            onClick={onPublish}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#4CAF50',
              color: '#FFF',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            Publish
          </button>
        </div>
      )}
    </div>
  );
};

export default Step7;

const OverlayDiv = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(128, 128, 128, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 0.5rem;
  box-sizing: border-box;
`;
