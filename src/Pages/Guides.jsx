// src/Pages/Guides.jsx
import React, { useState, useEffect } from 'react';
import GlobalStyle from '../Styles/GlobalStyle';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FaRegComment, 
  FaShareAlt, 
  FaRegStar, 
  FaThumbsUp, 
  FaThumbsDown, 
  FaFlag 
} from 'react-icons/fa';
import { collection, query, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

// Filtering arrays
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

// Parameter to control the banner width
const bannerWidth = '1160px';

const Guides = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [guides, setGuides] = useState([]);
  // Track votes: { [guideId]: 'like' | 'dislike' }
  const [votedGuides, setVotedGuides] = useState({});
  
  // Filtering and Sorting States
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortOption, setSortOption] = useState('date'); // 'date', 'upVotes', 'downVotes'
  
  // Check current user
  const currentUser = auth.currentUser;
  
  // On mount, check if a filter was passed via navigation state
  useEffect(() => {
    if (location.state?.filterClass) {
      setSelectedClass(location.state.filterClass);
    }
  }, [location.state]);

  // Fetch guides from Firestore
  useEffect(() => {
    const q = query(collection(db, 'guides'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const guidesArray = [];
      querySnapshot.forEach((doc) => {
        guidesArray.push({ id: doc.id, ...doc.data() });
      });
      setGuides(guidesArray);
    });
    return () => unsubscribe();
  }, []);
  
  // Filtering function
  const filterGuides = (guide) => {
    if (selectedClass && guide.class !== selectedClass) return false;
    if (selectedCategory && guide.category !== selectedCategory) return false;
    if (selectedTag && (!guide.tags || !guide.tags.includes(selectedTag))) return false;
    return true;
  };

  // Sorting function
  const sortGuides = (a, b) => {
    if (sortOption === 'date') {
      // Assuming datePublished is a Firestore timestamp object
      const dateA = a.datePublished?.seconds || 0;
      const dateB = b.datePublished?.seconds || 0;
      return dateB - dateA;
    }
    if (sortOption === 'upVotes') {
      return (b.upVotes || 0) - (a.upVotes || 0);
    }
    if (sortOption === 'downVotes') {
      return (b.downVotes || 0) - (a.downVotes || 0);
    }
    return 0;
  };

  // Apply filtering and sorting to guides
  const displayedGuides = guides.filter(filterGuides).sort(sortGuides);

  return (
    <>
      <GlobalStyle />
      <div style={{ background: '#000', minHeight: '100vh' }}>
        <div style={{
          margin: '0 auto',
          maxWidth: '1200px',
          padding: '20px 20px',
          background: '#111',
          color: '#FFD700',
          minHeight: '100vh'
        }}>
          <h1 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '2.5rem', textShadow: '1px 1px 3px #000' }}>
            Browse Guides
          </h1>
          
          {/* Filtering and Sorting Controls */}
          <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <select style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #333', background: '#222', color: '#FFD700' }}
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">All Classes</option>
              {classes.map((cls) => (
                <option key={cls.name} value={cls.name}>{cls.name}</option>
              ))}
            </select>

            <select style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #333', background: '#222', color: '#FFD700' }}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.name} value={cat.name}>{cat.name}</option>
              ))}
            </select>

            <select style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #333', background: '#222', color: '#FFD700' }}
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
            >
              <option value="">All Tags</option>
              {guideTags.map((tag) => (
                <option key={tag.name} value={tag.name}>{tag.name}</option>
              ))}
            </select>

            <select style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #333', background: '#222', color: '#FFD700' }}
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="date">Sort by Date</option>
              <option value="upVotes">Sort by Upvotes</option>
              <option value="downVotes">Sort by Downvotes</option>
            </select>
          </div>
          
          {displayedGuides.length === 0 ? (
            <p style={{ textAlign: 'center' }}>No guides available yet.</p>
          ) : (
            displayedGuides.map((guide) => (
              // Make the entire banner a clickable element
              <div
                key={guide.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  backgroundColor: '#1E1E1E',
                  borderRadius: '6px',
                  marginBottom: '1rem',
                  transition: 'background 0.3s',
                  width: bannerWidth,
                  cursor: 'pointer'
                }}
                onClick={() => navigate(`/guides/${guide.id}`)}
              >
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: '1.6rem', color: '#FFD700' }}>{guide.title}</h3>
                  <p style={{ margin: '0.25rem 0', fontSize: '1rem', color: '#CCCCCC' }}>{guide.shortDescription}</p>
                  <p style={{ margin: '0.25rem 0', fontSize: '1rem', color: '#CCCCCC' }}>
                    <strong>Category:</strong> {guide.category || 'N/A'} | <strong>Tags:</strong> {guide.tags && guide.tags.length > 0 ? guide.tags.join(', ') : 'None'}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} onClick={(e) => e.stopPropagation()}>
                  <button
                    style={{ background: 'none', border: 'none', color: '#FFD700', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    onClick={() => {}}
                  >
                    <FaThumbsUp /> {guide.upVotes || 0}
                  </button>
                  <button
                    style={{ background: 'none', border: 'none', color: '#FFD700', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    onClick={() => {}}
                  >
                    <FaThumbsDown /> {guide.downVotes || 0}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Guides;
