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
      <Logo to="/"><span style={{ fontFamily: "'Dancing Script', cursive" }}>N</span>ezbuild</Logo>
      <NavLinks>
        <NavLink to="/" active={location.pathname === '/'}>Home</NavLink>
        <NavLink to="/Guides" active={location.pathname === '/Guides'}>Guides</NavLink>
        <NavLink to="/create-guide" active={location.pathname === '/create-guide'}>Create Guide</NavLink>
        <NavLink to="/tier-lists" active={location.pathname === '/tier-lists'}>Tier Lists</NavLink>
        <NavLink to="/latest-patch" active={location.pathname === '/latest-patch'}>Latest Patch Notes</NavLink>
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
const NavBarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background-color: #0F0F0F;
  color: #FFD700;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
`;

const Logo = styled(Link)`
  font-size: 2rem;
  font-family: 'Playfair Display', serif;
  text-decoration: none;
  color: #FFD700;
  cursor: pointer;

  &:hover {
    color: #FFFFFF;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 20px;
`;

const NavLink = styled(Link).attrs((props) => ({
    // Prevent `active` from being passed to the DOM
    active: undefined,
  }))`
    text-decoration: none;
    color: ${({ active }) => (active ? '#FFFFFF' : '#FFD700')};
    font-size: 1.25rem;
    font-weight: bold;
  
    &:hover {
      color: #FFFFFF;
    }
  `;
  
const AuthLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const AuthButton = styled.button`
  background-color: #FFD700;
  color: #2F2F2F;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  padding: 5px 15px;
  cursor: pointer;

  &:hover {
    background-color: #FFFFFF;
    color: #2F2F2F;
  }
`;

const UserDisplay = styled.div`
  color: #FFD700;
  font-size: 1.1rem;
`;
