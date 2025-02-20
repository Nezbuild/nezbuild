import React, { useState } from 'react';
import spellsData from '../assets/SpellsAndSongs.json'; // Adjust path as needed

const spellImages = import.meta.glob('/src/assets/images/*.png', { eager: true });

const getSpellImage = (name) => {
    const processedName = name.replace(/\s+/g, '');
    const matchedImage = Object.entries(spellImages).find(([path]) => 
      path.toLowerCase().endsWith(`/${processedName.toLowerCase()}.png`)
    );
    return matchedImage ? matchedImage[1].default : '';
};

const SpellPopup = ({ visible, onSelect, onClose, selectedSpells }) => {
    if (!visible) return null;
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
            <h3>Select a Spell</h3>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.5rem',
                padding: '0.5rem',
                background: '#222222',
                borderRadius: '0.25rem',
                width: '100%',
            }}>
                {spellsData.map((spell) => (
                    <button
                        key={spell.Name}
                        onClick={() => {
                            if (selectedSpells.some(s => s.Name === spell.Name)) {
                                alert(`${spell.Name} has already been selected.`);
                                return;
                            }
                            onSelect(spell);
                        }}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            padding: '10px',
                            background: 'transparent',
                            border: '1px solid #FFD700',
                            color: '#FFD700',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        <img src={getSpellImage(spell.Name)} alt={spell.Name} style={{ maxWidth: '60px', maxHeight: '60px', marginBottom: '5px' }} />
                        {spell.Name}
                    </button>
                ))}
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

const Step6 = ({ selectedSpells, setSelectedSpells, onNext, onPrevious, selectedPerks }) => {
    const spellMemoryPerks = ["Spell Memory", "Spell Memory II", "Music Memory", "Music Memory II"];
    
    const shouldShowStep6 = Boolean(selectedPerks && typeof selectedPerks === 'object' && Object.values(selectedPerks).some(perk => perk?.Name && spellMemoryPerks.includes(perk.Name)));
    
    const [popupVisible, setPopupVisible] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    
    const handleSlotClick = (slotIndex) => {
        setSelectedSlot(slotIndex);
        setPopupVisible(true);
    };

    const handleSpellSelection = (spell) => {
        const newSpells = [...selectedSpells];
        newSpells[selectedSlot] = spell;
        setSelectedSpells(newSpells);
        setPopupVisible(false);
    };

    return shouldShowStep6 ? (
        <div style={{ padding: '20px', color: '#FFD700', backgroundColor: '#333', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2>Select Your Spells</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
                {[...Array(10)].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => handleSlotClick(i)}
                        style={{
                            width: '80px',
                            height: '80px',
                            background: selectedSpells[i] ? '#555' : 'transparent',
                            border: '1px solid #FFD700',
                            color: '#FFD700',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {selectedSpells[i] ? <img src={getSpellImage(selectedSpells[i].Name)} alt={selectedSpells[i].Name} style={{ maxWidth: '60px', maxHeight: '60px' }} /> : `Slot ${i + 1}`}
                    </button>
                ))}
            </div>
            <SpellPopup visible={popupVisible} onSelect={handleSpellSelection} onClose={() => setPopupVisible(false)} selectedSpells={selectedSpells} />
        </div>
    ) : null;
};

export default Step6;
