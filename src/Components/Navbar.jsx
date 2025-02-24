import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { auth } from '../firebase';
import { signOut } from "firebase/auth";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

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

  return (
    <NavBarContainer>
      <Logo to="/">
        <LogoHighlight>N</LogoHighlight>ezbuild
      </Logo>
      <NavLinks>
        <NavLink to="/" $active={location.pathname === '/'}>Home</NavLink>
        <NavLink to="/Guides" $active={location.pathname === '/Guides'}>Guides</NavLink>
        <NavLink to="/create-guide" $active={location.pathname === '/create-guide'}>Create Guide</NavLink>
        <NavLink to="/tier-lists" $active={location.pathname === '/tier-lists'}>Tier Lists</NavLink>
        <NavLink to="/latest-patch" $active={location.pathname === '/latest-patch'}>Latest Patch Notes</NavLink>
      </NavLinks>
      <AuthLinks>
        {user ? (
          <>
            <UserDisplay>Welcome, {user?.email || 'Guest'}</UserDisplay>
            <AuthButton onClick={handleSignOut}>Sign Out</AuthButton>
          </>
        ) : (
          <AuthButton onClick={() => navigate('/auth')}>Sign Up / Sign In</AuthButton>
        )}
      </AuthLinks>
    </NavBarContainer>
  );
};

export default Navbar;

// Styled Components
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
  justify-content: space-between;
  padding: 0 30px;
  color: #FFD700;
`;

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
  transition: color 0.3s;
  &:hover {
    color: #FFFFFF;
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
  transition: background-color 0.3s;
  &:hover {
    background-color: #FFFFFF;
  }
`;

const UserDisplay = styled.div`
  font-size: 1.1rem;
  color: #FFD700;
`;
