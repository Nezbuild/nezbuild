import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaRegComment, FaShareAlt, FaRegStar, FaThumbsUp, FaThumbsDown, FaFlag } from 'react-icons/fa';

const GuidesContainer = styled.div`
  width: 100%;
  max-width: 1125px;
  padding: 40px 60px; /* Increased padding for better margins */
  background-color: #2F2F2F;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 20px; /* Increased gap for clearer spacing */
  margin: 40px auto; /* Center the content with margin */
`;

const GuideItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background-color: #1E1E1E;
  border-radius: 6px;
  transition: 0.3s;
  &:hover {
    background-color: #3A3A3A;
  }
`;

const GuideInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 20px; /* Increased gap for better readability */
  flex: 1;
`;

const ClassLogo = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const GuideDetails = styled.div`
  display: flex;
  flex-direction: column;
  color: #FFBF00;
`;

const GuideTitle = styled.h3`
  margin: 0;
  font-size: 1.6rem;
`;

const GuideMeta = styled.p`
  margin: 4px 0 0;
  font-size: 1rem;
  color: #CCCCCC;
`;

const Stats = styled.div`
  display: flex;
  align-items: center;
  gap: 20px; /* Increased spacing for better clarity */
  color: #FFBF00;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: #FFBF00;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    color: #FFFFFF;
  }
`;

const guidesData = [
  {
    id: 1,
    classLogo: '/icons/wizard.png',
    title: 'Ultimate Wizard PvP Guide',
    description: 'Dominate the battlefield with this high-DPS build.',
    tags: ['PvP', 'Meta', 'High DPS'],
    votes: 120,
    comments: 45,
    awards: 3,
    date: 'Jan 25, 2025',
    author: 'Nezmaster',
  },
  {
    id: 2,
    classLogo: '/icons/barbarian.png',
    title: 'Tanky Barbarian Build',
    description: 'A durable build for soaking up damage in team fights.',
    tags: ['PvE', 'Tank', 'Survivability'],
    votes: 85,
    comments: 30,
    awards: 1,
    date: 'Jan 24, 2025',
    author: 'RoguePlayer',
  },
];

const Guides = () => {
  return (
    <GuidesContainer>
      {guidesData.map((guide) => (
        <GuideItem key={guide.id}>
          <GuideInfo>
            <ClassLogo src={guide.classLogo} alt={guide.title} />
            <GuideDetails>
              <GuideTitle>{guide.title}</GuideTitle>
              <GuideMeta>{guide.description} - {guide.tags.join(', ')}</GuideMeta>
              <GuideMeta>By {guide.author} | {guide.date}</GuideMeta>
            </GuideDetails>
          </GuideInfo>
          <Stats>
            <IconButton><FaThumbsUp /> {guide.votes}</IconButton>
            <IconButton><FaRegComment /> {guide.comments}</IconButton>
            <IconButton><FaRegStar /> {guide.awards}</IconButton>
            <IconButton><FaShareAlt /></IconButton>
            <IconButton><FaFlag /></IconButton>
          </Stats>
        </GuideItem>
      ))}
    </GuidesContainer>
  );
};

export default Guides;