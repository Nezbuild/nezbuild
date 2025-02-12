import React, { useState } from 'react';
import styled from 'styled-components';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // Import Firebase auth

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between Sign In and Sign Up
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState(''); // For Sign Up only
  const [error, setError] = useState('');

  const handleAuth = async () => {
    setError(''); // Reset error state
    try {
      if (isSignUp) {
        // Sign Up Logic
        if (password !== retypePassword) {
          setError('Passwords do not match.');
          return;
        }
        await createUserWithEmailAndPassword(auth, email, password);
        alert('Sign-up successful!');
      } else {
        // Sign In Logic
        await signInWithEmailAndPassword(auth, email, password);
        alert('Sign-in successful!');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthContainer>
      <ContentWrapper>
        {/* Right Section: Auth Form */}
        <AuthFormSection>
          {/* Toggle Buttons */}
          <ToggleButtons>
            <ToggleButton
              active={!isSignUp}
              onClick={() => setIsSignUp(false)}
            >
              Sign In
            </ToggleButton>
            <ToggleButton
              active={isSignUp}
              onClick={() => setIsSignUp(true)}
            >
              Sign Up
            </ToggleButton>
          </ToggleButtons>

          {/* Auth Form */}
          <FormContainer>
            <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {isSignUp && (
              <Input
                type="password"
                placeholder="Retype Password"
                value={retypePassword}
                onChange={(e) => setRetypePassword(e.target.value)}
              />
            )}
            <AuthButton onClick={handleAuth}>
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </AuthButton>
          </FormContainer>
        </AuthFormSection>

        {/* Left Section: Benefits */}
        <BenefitsSection>
          <h2>Benefits of Joining</h2>
          <ul>
            <li>🎮 Access exclusive game guides</li>
            <li>📈 Track your progress and stats</li>
            <li>🧙‍♂️ Participate in community discussions</li>
            <li>🏆 Earn badges and rewards</li>
          </ul>
        </BenefitsSection>
      </ContentWrapper>
    </AuthContainer>
  );
};

export default AuthPage;

// Styled Components
const AuthContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #2F2F2F;
  color: #FFD700;
  padding: 20px;
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: 40px;
  max-width: 1200px;
  width: 100%;
  justify-content: space-between;
  align-items: flex-start;
`;

const BenefitsSection = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #333333;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  color: #FFD700;

  h2 {
    font-size: 1.8rem;
    margin-bottom: 20px;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    font-size: 1.2rem;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
  }

  li::before {
    content: '✔️';
    margin-right: 10px;
  }
`;

const AuthFormSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #333333;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
`;

const ToggleButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const ToggleButton = styled.button`
  background-color: ${({ active }) => (active ? '#FFD700' : '#444444')};
  color: ${({ active }) => (active ? '#2F2F2F' : '#FFD700')};
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;

  &:hover {
    background-color: #FFD700;
    color: #2F2F2F;
  }
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Input = styled.input`
  margin: 10px 0;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #FFD700;
  border-radius: 5px;
  background-color: #2F2F2F;
  color: #FFD700;
  width: 100%;

  &::placeholder {
    color: #FFD700;
  }
`;

const AuthButton = styled.button`
  margin-top: 10px;
  padding: 10px;
  font-size: 1rem;
  font-weight: bold;
  background-color: #FFD700;
  color: #2F2F2F;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #FFFFFF;
    color: #2F2F2F;
  }
`;

const ErrorMessage = styled.div`
  color: #FF0000;
  font-size: 0.9rem;
  margin-bottom: 10px;
`;
