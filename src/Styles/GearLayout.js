import styled from 'styled-components';

const GearLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(1000, 1fr);
  grid-template-rows: repeat(1000, 1fr);
  gap: 0.25rem;
  justify-items: start;
  align-items: center;
  text-align: left;
  margin: 0 auto;
  width: 100%;
  max-width: 50rem;
  max-height: 50rem;
  margin-left: 0; /* ✅ Ensure it starts from the left */
  .gear-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #333333;
    border: 1px solid #FFD700;
    border-radius: 0.375rem;
    color: #FFD700;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    width: 100%;
    height: 100%;
    min-height: 2rem;
    &:hover {
      background-color: #444444;
    }
  }
  .head { grid-column: 100 / span 25; grid-row: 15 / span 30; }
  .chest { grid-column: 90 / span 45; grid-row: 50 / span 50; }
  .gloves { grid-column: 45 / span 35; grid-row: 130 / span 35; }
  .amulet { grid-column: 130 / span 15; grid-row: 30 / span 15; }
  .ring1 { grid-column: 75 / span 15; grid-row: 105 / span 15; }
  .ring2 { grid-column: 135 / span 15; grid-row: 105 / span 15; }
  .cape { grid-column: 140 / span 30; grid-row: 50 / span 50; }
  .legs { grid-column: 95 / span 35; grid-row: 105 / span 60; }
  .feet { grid-column: 135 / span 35; grid-row: 130 / span 35; }
  .perk1 { grid-column: 2 / span 25; grid-row: 15 / span 25; }
  .perk2 { grid-column: 230 / span 25; grid-row: 15 / span 25; }
  .perk3 { grid-column: 2 / span 25; grid-row: 85 / span 25; }
  .perk4 { grid-column: 230 / span 25; grid-row: 85 / span 25; }
  .skill1 { grid-column: 2 / span 25; grid-row: 140 / span 25; }
  .skill2 { grid-column: 230 / span 25; grid-row: 140 / span 25; }
  .Weapon11 { grid-column: 175 / span 25; grid-row: 15 / span 50; }
  .Weapon12 { grid-column: 200 / span 25; grid-row: 15 / span 50; }
  .Weapon21 { grid-column: 33 / span 25; grid-row: 15 / span 50; }
  .Weapon22 { grid-column: 58 / span 25; grid-row: 15 / span 50; }
`;
export default GearLayout;
