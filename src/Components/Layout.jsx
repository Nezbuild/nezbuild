// src/Components/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  return (
    <PageContainer>
      <Navbar />
      <ContentWrapper>
        <Outlet />
      </ContentWrapper>
      <Footer />
    </PageContainer>
  );
};

export default Layout;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const ContentWrapper = styled.main`
  flex-grow: 1;
  padding: 20px;
`;
