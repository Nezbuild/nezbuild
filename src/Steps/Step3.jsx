import Tooltip from '../Components/Tooltip';

const Step3 = ({ data, updateData }) => {
  const classes = [
    { name: 'Fighter', icon: '../src/assets/images/Fighter.png' },
    { name: 'Barbarian', icon: '../src/assets/images/Barbarian.png' },
    { name: 'Rogue', icon: '../src/assets/images/Rogue.png' },
    { name: 'Ranger', icon: '../src/assets/images/Ranger.png' },
    { name: 'Wizard', icon: '../src/assets/images/Wizard.png' },
    { name: 'Cleric', icon: '../src/assets/images/Cleric.png' },
    { name: 'Bard', icon: '../src/assets/images/Bard.png' },
    { name: 'Warlock', icon: '../src/assets/images/Warlock.png' },
    { name: 'Druid', icon: '../src/assets/images/Druid.png' },
    { name: 'Sorcerer', icon: '../src/assets/images/Sorcerer.png' },
  ];

  const categories = [
    { name: 'Arena', icon: '🏟️' },
    { name: 'High Roller', icon: '🏆' },
    { name: 'Normal', icon: '✅' },
  ];

  const guideTags = [
    { name: 'DPS', icon: '💥' },
    { name: 'Tank', icon: '🛡️' },
    { name: 'Support', icon: '🤝' },
    { name: 'CC', icon: '🔒' },
    { name: 'Hybrid', icon: '⚖️' },
    { name: 'Solo Play', icon: '🏃‍♂️' },
    { name: 'PvE', icon: '🌍' },
    { name: 'PvP', icon: '⚔️' },
    { name: 'Meta Build', icon: '⭐' },
    { name: 'Off-Meta', icon: '💡' },
    { name: 'Rat', icon: '🐀' },
  ];

  const toggleTag = (tag) => {
    const selectedTags = data.tags || [];

    if (selectedTags.includes(tag)) {
      updateData('tags', selectedTags.filter((t) => t !== tag));
    } else if (tag === 'Meta Build' && selectedTags.includes('Off-Meta')) {
      alert('Meta Build and Off-Meta cannot be selected together.');
    } else if (tag === 'Off-Meta' && selectedTags.includes('Meta Build')) {
      alert('Meta Build and Off-Meta cannot be selected together.');
    } else if (selectedTags.length < 5) {
      updateData('tags', [...selectedTags, tag]);
    } else {
      alert('You can select up to 5 tags.');
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '2rem' }}>
        Step 2: Class, Category, and Style Selection
        <Tooltip text="Select your class, category, and up to 5 tags that describe your guide." />
      </h2>

      <h3 style={{ fontSize: '1.5rem' }}>
        Class Selection
        <Tooltip text="Choose a class for your guide. This step must be completed before selecting a category or tags." />
      </h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {classes.map(({ name, icon }) => (
          <button
            key={name}
            onClick={() => updateData('class', name)}
            disabled={!data.title || !data.shortDescription}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '1rem',
              fontSize: '1.25rem',
              backgroundColor: data.class === name ? '#FFD700' : '#2F2F2F',
              color: data.class === name ? '#000000' : '#FFD700',
              border: '1px  #FFD700',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              opacity: (!data.title || !data.shortDescription) ? 0.5 : 1,
              width: '120px',
              height: '130px',
            }}
          >
            {/* Control the size of the image */}
            <img
              src={icon}
              alt={name}
              style={{
                width: '100px', // IMAGE WIDTH
                height: '100px', // IMAGE HEIGHT
                marginBottom: '0.5rem',
              }}
            />
            {name}
          </button>
        ))}
      </div>

      <h3 style={{ fontSize: '1.5rem' }}>
        Category Selection
        <Tooltip text="Select the game mode category for your guide." />
      </h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {categories.map(({ name, icon }) => (
          <button
            key={name}
            onClick={() => updateData('category', name)}
            disabled={!data.class}
            style={{
              padding: '1rem 2rem',
              fontSize: '1.25rem',
              backgroundColor: data.category === name ? '#FFD700' : '#2F2F2F',
              color: data.category === name ? '#000000' : '#FFD700',
              border: '1px #FFD700',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              opacity: data.class ? 1 : 0.5,
            }}
          >
            <span style={{ fontSize: '2.5rem' }}>{icon}</span> {name}
          </button>
        ))}
      </div>

      <h3 style={{ fontSize: '1.5rem' }}>
        Guide Style Tags
        <Tooltip text="Select up to 5 tags to describe the style of your guide." />
      </h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
        {guideTags.map(({ name, icon }) => (
          <button
            key={name}
            onClick={() => toggleTag(name)}
            disabled={!data.category}
            style={{
              padding: '1rem 2rem',
              fontSize: '1.25rem',
              backgroundColor: (data.tags || []).includes(name) ? '#FFD700' : '#2F2F2F',
              color: (data.tags || []).includes(name) ? '#000000' : '#FFD700',
              border: '1px #FFD700',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              opacity: data.category ? 1 : 0.5,
            }}
          >
            <span style={{ fontSize: '2.5rem' }}>{icon}</span> {name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Step3;
