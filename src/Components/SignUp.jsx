import React, { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { auth } from '../firebase';
import styled from 'styled-components';

const SignUp = () => {
  const [username, setUsername] = useState(''); // New state for username
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    setError('');

    // Validate that a username was entered
    if (!username) {
      setError('Please enter a username.');
      return;
    }

    // Check if passwords match
    if (password !== retypePassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's displayName with the entered username
      await updateProfile(userCredential.user, { displayName: username });
      
      // Send verification email
      await sendEmailVerification(userCredential.user);
      
      alert('Sign-up successful! A verification email has been sent to your email address. Please verify your email before signing in.');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <SignUpContainer>
      <Form>
        <h2>Sign Up</h2>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
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
        <Input
          type="password"
          placeholder="Retype Password"
          value={retypePassword}
          onChange={(e) => setRetypePassword(e.target.value)}
        />
        <Button onClick={handleSignUp}>Sign Up</Button>
      </Form>
    </SignUpContainer>
  );
};

export default SignUp;

// Styled Components
const SignUpContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end; /* Align form to the right */
  justify-content: center;
  min-height: 100vh;
  padding-right: 50px; /* Add padding for spacing */
  background-color: #2F2F2F;
  color: #FFD700;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #333333;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  width: 300px;
`;

const Input = styled.input`
  margin: 10px 0;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #FFD700;
  border-radius: 5px;
  background-color: #2F2F2F;
  color: #FFD700;

  &::placeholder {
    color: #FFD700;
  }
`;

const Button = styled.button`
  padding: 10px;
  margin-top: 10px;
  font-size: 1rem;
  font-weight: bold;
  color: #2F2F2F;
  background-color: #FFD700;
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
