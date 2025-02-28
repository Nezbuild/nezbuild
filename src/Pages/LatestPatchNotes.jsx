// src/Pages/LatestPatchNotes.jsx
import React from 'react';
import GlobalStyle from '../Styles/GlobalStyle';
import styled from 'styled-components';

const LatestPatchNotes = () => {
  return (
    <>
      <GlobalStyle />
      <Container className="content-container">
        <Title>Latest Patch Notes</Title>
        <UnderConstruction>Under Construction</UnderConstruction>
        <Message>
          We're currently working on bringing you the latest updates and patch notes for Dark and Darker.
          Please check back soon!
        </Message>
      </Container>
    </>
  );
};

export default LatestPatchNotes;

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
