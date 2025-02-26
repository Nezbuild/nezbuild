import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendEmailVerification, 
  updateProfile 
} from 'firebase/auth';
import { auth } from '../firebase';

const AuthPanel = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [error, setError] = useState('');

  const handleAuth = async () => {
    setError('');
    if (isSignUp && !username.trim()) {
      setError('Please enter a username.');
      return;
    }
    if (isSignUp && password !== retypePassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: username });
        await sendEmailVerification(userCredential.user);
        alert('Sign-up successful! A verification email has been sent. Please verify your email before signing in.');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        alert('Sign-in successful!');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <PanelContainer>
      <ToggleButtonsPanel>
        <ToggleButtonPanel active={!isSignUp} onClick={() => setIsSignUp(false)}>
          Sign In
        </ToggleButtonPanel>
        <ToggleButtonPanel active={isSignUp} onClick={() => setIsSignUp(true)}>
          Sign Up
        </ToggleButtonPanel>
      </ToggleButtonsPanel>
      <FormPanel>
        <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
        {error && <ErrorMessagePanel>{error}</ErrorMessagePanel>}
        {isSignUp && (
          <InputPanel
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        )}
        <InputPanel
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputPanel
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {isSignUp && (
          <InputPanel
            type="password"
            placeholder="Retype Password"
            value={retypePassword}
            onChange={(e) => setRetypePassword(e.target.value)}
          />
        )}
        <AuthButtonPanel onClick={handleAuth}>
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </AuthButtonPanel>
      </FormPanel>
    </PanelContainer>
  );
};

export default AuthPanel;

const PanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ToggleButtonsPanel = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const ToggleButtonPanel = styled.button`
  background-color: ${({ active }) => (active ? '#FFBF00' : '#444444')};
  color: ${({ active }) => (active ? '#2F2F2F' : '#FFBF00')};
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  padding: 8px 15px;
  cursor: pointer;
  &:hover {
    background-color: #FFBF00;
    color: #2F2F2F;
  }
`;

const FormPanel = styled.div`
  width: 100%;
  text-align: center;
`;

const InputPanel = styled.input`
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

const AuthButtonPanel = styled.button`
  margin-top: 10px;
  padding: 10px;
  font-size: 1rem;
  font-weight: bold;
  background-color: #FFBF00;
  color: #2F2F2F;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  &:hover {
    background-color: #FFFFFF;
    color: #2F2F2F;
  }
`;

const ErrorMessagePanel = styled.div`
  color: #FF0000;
  font-size: 0.9rem;
  margin-bottom: 10px;
`;
