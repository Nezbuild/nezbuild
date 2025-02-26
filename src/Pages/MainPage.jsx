// src/Pages/MainPage.jsx
import React, { useState, useEffect } from 'react';
import GlobalStyle from '../Styles/GlobalStyle';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

// Arrays for filtering
const classes = [
  { name: 'Fighter', icon: '/src/assets/images/Fighter.png' },
  { name: 'Barbarian', icon: '/src/assets/images/Barbarian.png' },
  { name: 'Rogue', icon: '/src/assets/images/Rogue.png' },
  { name: 'Ranger', icon: '/src/assets/images/Ranger.png' },
  { name: 'Wizard', icon: '/src/assets/images/Wizard.png' },
  { name: 'Cleric', icon: '/src/assets/images/Cleric.png' },
  { name: 'Bard', icon: '/src/assets/images/Bard.png' },
  { name: 'Warlock', icon: '/src/assets/images/Warlock.png' },
  { name: 'Druid', icon: '/src/assets/images/Druid.png' },
  { name: 'Sorcerer', icon: '/src/assets/images/Sorcerer.png' },
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

// Constants for carousel dimensions and animation
const GUIDE_CARD_WIDTH_PX = 225; // width of each guide card in pixels
const GUIDE_CARD_HEIGHT_PX = 250; // height of each guide card in pixels
const CARD_GAP = 20; // gap between cards in pixels
const SCROLL_DURATION = 10; // seconds for one full loop of the duplicated content
const SCROLL_EASING = 'linear'; // continuous smooth motion

// Create a keyframes animation for continuous scrolling
const infiniteScroll = (totalWidth) => keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-${totalWidth}px); }
`;

const MainPage = () => {
  const navigate = useNavigate();

  const [guides, setGuides] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortOption, setSortOption] = useState('date');

  // Fetch guides from Firestore (ordered by datePublished descending)
  useEffect(() => {
    const q = query(collection(db, 'guides'), orderBy('datePublished', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const guidesArray = [];
      snapshot.forEach((doc) => {
        guidesArray.push({ id: doc.id, ...doc.data() });
      });
      setGuides(guidesArray);
    });
    return () => unsubscribe();
  }, []);

  // Filtering function (if needed)
  const filterGuides = (guide) => {
    if (selectedClass && guide.class !== selectedClass) return false;
    if (selectedCategory && guide.category !== selectedCategory) return false;
    if (selectedTag && (!guide.tags || !guide.tags.includes(selectedTag))) return false;
    return true;
  };

  // Sorting function
  const sortGuides = (a, b) => {
    if (sortOption === 'date') {
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

  // For the featured guides carousel, use the top 5 guides
  const featuredGuides = guides.filter(filterGuides).sort(sortGuides).slice(0, 5);

  // Calculate the total width of one set of featured guides
  const totalSlideWidth = featuredGuides.length * (GUIDE_CARD_WIDTH_PX + CARD_GAP);

  // Duplicate the featuredGuides array for infinite loop effect
  const sliderItems = featuredGuides.concat(featuredGuides);

  // When a class is clicked in the hero section, navigate to the Guides page with that class filter preselected.
  const handleClassSelect = (clsName) => {
    navigate('/guides', { state: { filterClass: clsName } });
  };

  return (
    <>
      <GlobalStyle />
      <MainContainer className="content-container">
        {/* Hero Section */}
        <HeroSection>
          <HeroContent>
            <HeroTitle>Welcome to Nezbuild</HeroTitle>
            <HeroSubtitle>Your ultimate guide creation hub for Dark and Darker!</HeroSubtitle>
            <HeroSubtitle>Build, explore, and share your guides with the community!</HeroSubtitle>
            <ClassSelector>
              {classes.map((cls) => (
                <ClassOption key={cls.name} onClick={() => handleClassSelect(cls.name)}>
                  <ClassIcon src={cls.icon} alt={cls.name} />
                  <ClassName>{cls.name}</ClassName>
                </ClassOption>
              ))}
            </ClassSelector>
          </HeroContent>
        </HeroSection>

        {/* Featured Guides Carousel */}
        <CarouselSection>
          <SectionTitle>Featured Guides</SectionTitle>
          {featuredGuides.length > 0 && (
            <SliderWrapper>
              <SliderInner totalWidth={totalSlideWidth} duration={SCROLL_DURATION} easing={SCROLL_EASING}>
                {sliderItems.map((guide, index) => (
                  <CarouselItem key={index} onClick={() => navigate(`/guides/${guide.id}`)}>
                    <GuideCard>
                      <GuideTitle>{guide.title}</GuideTitle>
                      <GuideCategory>
                        <strong>Category:</strong> {guide.category || 'N/A'}
                      </GuideCategory>
                      <GuideTags>
                        <strong>Tags:</strong> {guide.tags && guide.tags.length > 0 ? guide.tags.join(', ') : 'None'}
                      </GuideTags>
                      <GuideClass>
                        <strong>Class:</strong> {guide.class}
                      </GuideClass>
                      <GuideDescription>{guide.shortDescription}</GuideDescription>
                    </GuideCard>
                  </CarouselItem>
                ))}
              </SliderInner>
            </SliderWrapper>
          )}
        </CarouselSection>

        {/* Footer */}
        <Footer>
          <FooterLink href="/">Home</FooterLink>
          <FooterLink href="/guides">Guides</FooterLink>
          <FooterLink href="/create-guide">Create Guide</FooterLink>
          <FooterLink href="/tier-lists">Tier Lists</FooterLink>
          <FooterLink href="/latest-patch">Latest Patch Notes</FooterLink>
        </Footer>
      </MainContainer>
    </>
  );
};

export default MainPage;

// Styled Components

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 40px;
`;

const HeroSection = styled.section`
  background: url('/src/assets/images/hero-background.jpg') no-repeat center center/cover;
  padding: 0px 20px;
  border-radius: 8px;
  text-align: center;
  color: #FFBF00;
  position: relative;
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 20px;
  font-family: 'Playfair Display', serif;
`;

const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 10px;
`;

const ClassSelector = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
`;

const ClassOption = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.05);
  }
`;

const ClassIcon = styled.img`
  width: 90px;
  height: 90px;
  object-fit: contain;
  margin-bottom: 10px;
`;

const ClassName = styled.span`
  font-size: 1rem;
  font-weight: bold;
`;

const CarouselSection = styled.section`
  padding: 20px;
  background-color: #2F2F2F;
  border-radius: 8px;
  overflow: hidden;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 20px;
  font-family: 'Playfair Display', serif;
`;

const SliderWrapper = styled.div`
  overflow: hidden;
  width: 100%;
`;

const SliderInner = styled.div`
  display: flex;
  gap: ${CARD_GAP}px;
  animation: ${({ totalWidth, duration, easing }) => infiniteScroll(totalWidth)} ${props => props.duration}s ${props => props.easing} infinite;
`;

const CarouselItem = styled.div`
  min-width: ${GUIDE_CARD_WIDTH_PX}px;
  height: ${GUIDE_CARD_HEIGHT_PX}px;
  cursor: pointer;
  transition: transform 0.3s;
  &:hover {
    transform: scale(1.03);
  }
`;

const GuideCard = styled.div`
  padding: 10px;
  color: #FFD700;
  background-color: #333333;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  width: 100%;
  height: 100%;
`;

const GuideTitle = styled.h3`
  font-size: 1.8rem;
  margin-bottom: 10px;
`;

const GuideCategory = styled.p`
  margin: 5px 0;
  font-size: 1rem;
`;

const GuideTags = styled.p`
  margin: 5px 0;
  font-size: 1rem;
`;

const GuideClass = styled.p`
  margin: 5px 0;
  font-size: 1rem;
`;

const GuideDescription = styled.p`
  margin-top: 10px;
  font-size: 1.1rem;
  line-height: 1.4;
`;

const Footer = styled.footer`
  display: flex;
  justify-content: center;
  gap: 30px;
  padding: 20px 0;
  border-top: 1px solid #444;
  font-size: 1rem;
`;

const FooterLink = styled.a`
  color: #FFBF00;
  text-decoration: none;
  transition: color 0.3s;
  &:hover {
    color: #FFFFFF;
  }
`;
