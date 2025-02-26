import React, { useState } from 'react';
import styled from 'styled-components';
import GlobalStyle from '../Styles/GlobalStyle';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendEmailVerification, 
  updateProfile 
} from 'firebase/auth';
import { auth } from '../firebase';

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between Sign In and Sign Up
  const [username, setUsername] = useState(''); // For sign-up
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [error, setError] = useState('');

  const handleAuth = async () => {
    setError('');

    // Validate username in Sign Up mode
    if (isSignUp && !username.trim()) {
      setError('Please enter a username.');
      return;
    }

    // Validate that passwords match in Sign Up mode
    if (isSignUp && password !== retypePassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      if (isSignUp) {
        // Create a new user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Update the user profile with the username
        await updateProfile(userCredential.user, { displayName: username });
        // Send a verification email
        await sendEmailVerification(userCredential.user);
        alert('Sign-up successful! A verification email has been sent. Please verify your email before signing in.');
      } else {
        // Sign in an existing user
        await signInWithEmailAndPassword(auth, email, password);
        alert('Sign-in successful!');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <GlobalStyle />
      <div className="content-container">
        <AuthWrapper>
          <ToggleButtons>
            <ToggleButton active={!isSignUp} onClick={() => setIsSignUp(false)}>
              Sign In
            </ToggleButton>
            <ToggleButton active={isSignUp} onClick={() => setIsSignUp(true)}>
              Sign Up
            </ToggleButton>
          </ToggleButtons>
          <FormContainer>
            <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {isSignUp && (
              <Input 
                type="text" 
                placeholder="Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
              />
            )}
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
        </AuthWrapper>
      </div>
    </>
  );
};

export default AuthPage;

// Styled Components
const AuthWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  background-color: #333333;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 450px;
  margin: 100px auto;
`;

const ToggleButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const ToggleButton = styled.button`
  background-color: ${({ active }) => (active ? '#FFBF00' : '#444444')};
  color: ${({ active }) => (active ? '#2F2F2F' : '#FFBF00')};
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  &:hover {
    background-color: #FFBF00;
    color: #2F2F2F;
  }
`;

const FormContainer = styled.div`
  width: 100%;
  text-align: center;
`;

const Input = styled.input`
  margin: 10px 0;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #FFBF00;
  border-radius: 5px;
  background-color: #2F2F2F;
  color: #FFBF00;
  width: 100%;
  &::placeholder {
    color: #FFBF00;
  }
`;

const AuthButton = styled.button`
  margin-top: 10px;
  padding: 10px;
  font-size: 1rem;
  font-weight: bold;
  background-color: #FFBF00;
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
