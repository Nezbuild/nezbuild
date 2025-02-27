// src/Components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import AuthPanel from './AuthPanel'; // Your custom auth panel component
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showAuthDropdown, setShowAuthDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      alert('You have signed out successfully!');
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Close auth dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowAuthDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <NavBarContainer>
        <Logo to="/">
          <LogoHighlight>N</LogoHighlight>ezbuild
        </Logo>
        <CenteredNav>
          <NavLinks>
            <NavLink to="/" $active={location.pathname === '/'} aria-label="Home">
              Home
            </NavLink>
            <NavLink to="/Guides" $active={location.pathname === '/Guides'} aria-label="Guides">
              Guides
            </NavLink>
            <NavLink to="/create-guide" $active={location.pathname === '/create-guide'} aria-label="Create Guide">
              Create Guide
            </NavLink>
            <NavLink to="/tier-lists" $active={location.pathname === '/tier-lists'} aria-label="Tier Lists">
              Tier Lists
            </NavLink>
            <NavLink to="/latest-patch" $active={location.pathname === '/latest-patch'} aria-label="Latest Patch Notes">
              Latest Patch Notes
            </NavLink>
          </NavLinks>
        </CenteredNav>
        <AuthLinks>
          {user ? (
            <>
              <UserDisplay>
                Welcome, {user?.displayName || user?.email || 'Guest'}
              </UserDisplay>
              <AuthButton onClick={handleSignOut} aria-label="Sign Out">
                Sign Out
              </AuthButton>
            </>
          ) : (
            <AuthButton onClick={() => setShowAuthDropdown((prev) => !prev)} aria-label="Sign Up / Sign In">
              Sign Up / Sign In
            </AuthButton>
          )}
        </AuthLinks>
        <MobileMenuToggle onClick={() => setMobileMenuOpen((prev) => !prev)}>
          {mobileMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </MobileMenuToggle>
      </NavBarContainer>
      {mobileMenuOpen && (
        <MobileNav>
          <NavLinksMobile>
            <NavLinkMobile to="/" onClick={() => setMobileMenuOpen(false)}>
              Home
            </NavLinkMobile>
            <NavLinkMobile to="/Guides" onClick={() => setMobileMenuOpen(false)}>
              Guides
            </NavLinkMobile>
            <NavLinkMobile to="/create-guide" onClick={() => setMobileMenuOpen(false)}>
              Create Guide
            </NavLinkMobile>
            <NavLinkMobile to="/tier-lists" onClick={() => setMobileMenuOpen(false)}>
              Tier Lists
            </NavLinkMobile>
            <NavLinkMobile to="/latest-patch" onClick={() => setMobileMenuOpen(false)}>
              Latest Patch Notes
            </NavLinkMobile>
          </NavLinksMobile>
          <MobileAuthLinks>
            {user ? (
              <>
                <UserDisplay>
                  Welcome, {user?.displayName || user?.email || 'Guest'}
                </UserDisplay>
                <AuthButton onClick={() => { setMobileMenuOpen(false); handleSignOut(); }}>
                  Sign Out
                </AuthButton>
              </>
            ) : (
              <AuthButton onClick={() => { setMobileMenuOpen(false); navigate('/auth'); }}>
                Sign Up / Sign In
              </AuthButton>
            )}
          </MobileAuthLinks>
        </MobileNav>
      )}
      {showAuthDropdown && (
        <AuthDropdown ref={dropdownRef}>
          <AuthPanel />
        </AuthDropdown>
      )}
    </>
  );
};

export default Navbar;

const NavBarContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  background: linear-gradient(90deg, #0F0F0F, #1A1A1A);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  padding: 0 30px;
  color: #FFD700;
`;

/* Logo remains on the left */
const Logo = styled(Link)`
  font-size: 2.2rem;
  font-family: 'Playfair Display', serif;
  text-decoration: none;
  color: #FFD700;
  cursor: pointer;
  transition: color 0.3s;
  &:hover {
    color: #FFFFFF;
  }
`;

const LogoHighlight = styled.span`
  font-family: 'Dancing Script', cursive;
  font-size: 2.8rem;
`;

/* Center the navigation links container absolutely */
const CenteredNav = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

const NavLinks = styled.div`
  display: flex;
  gap: 25px;
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: ${({ $active }) => ($active ? '#FFFFFF' : '#FFD700')};
  font-size: 1.2rem;
  font-weight: bold;
  position: relative;
  transition: color 0.3s, transform 0.2s;
  &:hover {
    color: #FFFFFF;
    transform: scale(1.05);
  }
  &:after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -4px;
    width: 0%;
    height: 2px;
    background: #FFD700;
    transition: width 0.3s;
  }
  &:hover:after {
    width: 100%;
  }
`;

const AuthLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-left: auto;
`;

const AuthButton = styled.button`
  background-color: #FFD700;
  color: #2F2F2F;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  padding: 8px 15px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  &:hover {
    background-color: #FFFFFF;
    transform: scale(1.05);
  }
`;

const UserDisplay = styled.div`
  font-size: 1.1rem;
  color: #FFD700;
`;

const MobileMenuToggle = styled.button`
  background: none;
  border: none;
  color: #FFD700;
  cursor: pointer;
  display: none;
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileNav = styled.div`
  position: fixed;
  top: 70px;
  left: 0;
  width: 100%;
  background: #1A1A1A;
  padding: 20px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const NavLinksMobile = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const NavLinkMobile = styled(Link)`
  text-decoration: none;
  color: #FFD700;
  font-size: 1.2rem;
  font-weight: bold;
  transition: color 0.3s, transform 0.2s;
  &:hover {
    color: #FFFFFF;
    transform: scale(1.05);
  }
`;

const MobileAuthLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const AuthDropdown = styled.div`
  position: fixed;
  top: 70px;
  right: 30px;
  z-index: 999;
  width: 400px;
  background-color: #2F2F2F;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  padding: 20px;
`;
