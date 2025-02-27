// src/Pages/MainPage.jsx
import React, { useState, useEffect, useRef } from 'react';
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

// Carousel constants
const GUIDE_CARD_WIDTH_PX = 225;
const GUIDE_CARD_HEIGHT_PX = 250;
const CARD_GAP = 20;
const AUTO_SCROLL_INTERVAL = 5000; // Auto-advance every 5 seconds
const TRANSITION_DURATION = 700; // milliseconds for slide transition

const MainPage = () => {
  const navigate = useNavigate();
  const [guides, setGuides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoScrollRef = useRef(null);

  // Fetch guides from Firestore
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

  // For the featured guides carousel, we use the top 5 guides
  const featuredGuides = guides.slice(0, 5);
  const totalSlides = featuredGuides.length;
  const slideWidth = GUIDE_CARD_WIDTH_PX + CARD_GAP;

  // Set up auto-scroll interval
  useEffect(() => {
    startAutoScroll();
    return () => clearInterval(autoScrollRef.current);
  }, [totalSlides]);

  const startAutoScroll = () => {
    clearInterval(autoScrollRef.current);
    autoScrollRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
    }, AUTO_SCROLL_INTERVAL);
  };

  // Pause auto-scroll on hover
  const handleMouseEnter = () => {
    clearInterval(autoScrollRef.current);
  };

  const handleMouseLeave = () => {
    startAutoScroll();
  };

  // Manual navigation via arrows
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? totalSlides - 1 : prevIndex - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  };

  // When a class is clicked in the hero section, navigate to Guides with that filter preselected.
  const handleClassSelect = (clsName) => {
    navigate('/guides', { state: { filterClass: clsName } });
  };

  return (
    <>
      <GlobalStyle />
      <MainContainer className="content-container">
        {/* Hero Section */}
        <HeroSection>
          <HeroOverlay />
          <HeroContent>
            <HeroTitle animationDelay="0.2s">Welcome to Nezbuild</HeroTitle>
            <HeroSubtitle animationDelay="0.4s">
              Your ultimate guide creation hub for Dark and Darker!
            </HeroSubtitle>
            <HeroSubtitle animationDelay="0.6s">
              Build, explore, and share your guides with the community!
            </HeroSubtitle>
            <ClassSelector>
              {classes.map((cls, index) => (
                <ClassOption key={cls.name} onClick={() => handleClassSelect(cls.name)}>
                  <ClassIcon src={cls.icon} alt={cls.name} animationDelay={`${0.3 + index * 0.1}s`} />
                  <ClassName>{cls.name}</ClassName>
                </ClassOption>
              ))}
            </ClassSelector>
          </HeroContent>
        </HeroSection>

        {/* Featured Guides Carousel */}
        <CarouselSection onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <SectionTitle>Featured Guides</SectionTitle>
          {totalSlides > 0 && (
            <SliderWrapper>
              <SliderInner style={{ transform: `translateX(-${currentIndex * slideWidth}px)` }}>
                {featuredGuides.map((guide, index) => (
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
              <ArrowButtonLeft onClick={prevSlide} aria-label="Previous Slide">&#9664;</ArrowButtonLeft>
              <ArrowButtonRight onClick={nextSlide} aria-label="Next Slide">&#9654;</ArrowButtonRight>
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
  position: relative;
  background: url('/src/assets/images/hero-background.jpg') no-repeat center center/cover;
  padding: 60px 20px;
  border-radius: 8px;
  text-align: center;
  color: #FFBF00;
  overflow: hidden;
`;

const HeroOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 20px;
  font-family: 'Playfair Display', serif;
  opacity: 0;
  animation: ${fadeIn} 0.8s forwards;
  animation-delay: ${({ animationDelay }) => animationDelay || '0s'};
`;

const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 10px;
  opacity: 0;
  animation: ${fadeIn} 0.8s forwards;
  animation-delay: ${({ animationDelay }) => animationDelay || '0s'};
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
  opacity: 0;
  animation: ${fadeIn} 0.8s forwards;
  animation-delay: ${({ animationDelay }) => animationDelay || '0s'};
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
  position: relative;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 20px;
  font-family: 'Playfair Display', serif;
`;

const SliderWrapper = styled.div`
  overflow: hidden;
  width: 100%;
  position: relative;
`;

const SliderInner = styled.div`
  display: flex;
  gap: ${CARD_GAP}px;
  transition: transform ${TRANSITION_DURATION}ms ease;
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

const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: #FFD700;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  z-index: 2;
  transition: background 0.3s;
  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
`;

const ArrowButtonLeft = styled(ArrowButton)`
  left: 10px;
`;

const ArrowButtonRight = styled(ArrowButton)`
  right: 10px;
`;

const GuideCard = styled.div`
  padding: 10px;
  color: #FFD700;
  background-color: #111222;
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
