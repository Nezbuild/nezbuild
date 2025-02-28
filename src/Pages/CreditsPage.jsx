// src/Pages/CreditsPage.jsx
import React from 'react';
import GlobalStyle from '../Styles/GlobalStyle';
import styled from 'styled-components';

const CreditsPage = () => {
  return (
    <>
      <GlobalStyle />
      <MainContainer className="content-container">
        <Title>Credits & Appreciation</Title>
        <Paragraph>
          We extend our heartfelt thanks to <strong>Ironmace</strong>, the visionary team behind 
          <em> Dark and Darker</em>. Their relentless creativity and dedication have not only created 
          an immersive, challenging game that has captivated players around the globe, but also inspired 
          countless community projects and fan creations—including this very site. Their innovative approach 
          to game design and commitment to quality have redefined what it means to explore a dark and thrilling 
          fantasy world.
        </Paragraph>
        <Paragraph>
          As proud members of the Dark and Darker community, we celebrate Ironmace’s achievements and embrace 
          the passion that unites us all. This website is a tribute to the incredible world they have built, 
          and we are honored to contribute to a community that thrives on adventure, challenge, and creativity. 
          Thank you, Ironmace, for sparking our imaginations and for continuously pushing the boundaries of gaming.
        </Paragraph>
      </MainContainer>
    </>
  );
};

export default CreditsPage;

const MainContainer = styled.div`
  padding: 40px;
  max-width: 1125px;
  margin: 0 auto;
  background-color: #2F2F2F;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  color: #FFD700;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
  font-family: 'Playfair Display', serif;
  text-align: center;
`;

const Paragraph = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 20px;
  text-align: justify;
`;
