import React, { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';
import styled from 'styled-components';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    setError(''); // Reset error state
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Check if the email is verified
      if (!userCredential.user.emailVerified) {
        setError('Your email is not verified. Please verify your email before signing in.');
        await auth.signOut(); // Log out the user until verification
        return;
      }

      alert('Sign-in successful!');
    } catch (error) {
      setError(error.message); // Display error message
    }
  };

  return (
    <SignInContainer>
      <Form>
        <h2>Sign In</h2>
        {error && <ErrorMessage>{error}</ErrorMessage>} {/* Display error if exists */}
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
        <Button onClick={handleSignIn}>Sign In</Button>
      </Form>
    </SignInContainer>
  );
};

export default SignIn;

// Styled Components
const SignInContainer = styled.div`
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
