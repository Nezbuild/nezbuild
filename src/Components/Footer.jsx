// src/Components/Footer.jsx
import React from 'react';
import styled from 'styled-components';

// ------------------ Tweakable Footer Constants ------------------
const FOOTER_BACKGROUND = '#111222'; // Background color of the footer
const FOOTER_PADDING = '20px 0';       // Padding for the footer
const FOOTER_BORDER_TOP = '1px solid #444'; // Top border of the footer
const FOOTER_FONT_SIZE = '1rem';       // Font size for footer text
const FOOTER_COLOR = '#FFBF00';        // Default text color (gold)
const FOOTER_GAP = '30px';             // Gap between links
const FOOTER_HOVER_COLOR = '#FFFFFF';  // Hover color for links
// ----------------------------------------------------------------

const Footer = () => {
  return (
    <FooterContainer>
      <FooterLink href="/">Home</FooterLink>
      <FooterLink href="/guides">Guides</FooterLink>
      <FooterLink href="/create-guide">Create Guide</FooterLink>
      <FooterLink href="/tier-lists">Tier Lists</FooterLink>
      <FooterLink href="/latest-patch">Latest Patch Notes</FooterLink>
      <FooterLink href="/credits">Credits &amp; Appreciation</FooterLink>
    </FooterContainer>
  );
};

export default Footer;

const FooterContainer = styled.footer`
  display: flex;
  justify-content: center;
  gap: ${FOOTER_GAP};
  padding: ${FOOTER_PADDING};
  border-top: ${FOOTER_BORDER_TOP};
  font-size: ${FOOTER_FONT_SIZE};
  color: ${FOOTER_COLOR};
  background: ${FOOTER_BACKGROUND};
`;

const FooterLink = styled.a`
  color: ${FOOTER_COLOR};
  text-decoration: none;
  transition: color 0.3s;
  &:hover {
    color: ${FOOTER_HOVER_COLOR};
  }
`;
