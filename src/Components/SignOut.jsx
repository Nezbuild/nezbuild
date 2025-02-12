// src/Components/SignOut.js
import React from 'react';
import { auth } from '../firebase';

const SignOut = () => {
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      alert('Sign-out successful!');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};

 export default SignOut;
