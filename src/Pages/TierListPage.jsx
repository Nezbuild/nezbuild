// src/Pages/TierListPage.jsx
import React from 'react';
import GlobalStyle from '../Styles/GlobalStyle';
import styled from 'styled-components';

const TierListPage = () => {
  return (
    <>
      <GlobalStyle />
      <Container className="content-container">
        <Title>Tier Lists</Title>
        <UnderConstruction>Under Construction</UnderConstruction>
        <Message>
          We are currently working on the tier lists and rankings for Dark and Darker classes and strategies.
          Check back soon!
        </Message>
      </Container>
    </>
  );
};

export default TierListPage;

const Container = styled.div`
  padding: 40px;
  max-width: 1125px;
  margin: 40px auto;
  background-color: #2F2F2F;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  text-align: center;
  color: #FFD700;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 20px;
  font-family: 'Playfair Display', serif;
`;

const UnderConstruction = styled.h2`
  font-size: 2rem;
  margin-bottom: 20px;
  color: #FFBF00;
`;

const Message = styled.p`
  font-size: 1.25rem;
  line-height: 1.6;
`;
