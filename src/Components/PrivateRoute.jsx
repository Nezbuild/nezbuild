import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase'; // Ensure Firebase is correctly configured

const PrivateRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      (currentUser) => {
        console.log('Auth state changed:', currentUser); // Debugging line
        setUser(currentUser);
        setLoading(false);
      },
      (error) => {
        console.error('Auth state error:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <h3>Loading...</h3>
      </div>
    );
  }

  return user ? children : <Navigate to="/auth" />;
};

export default PrivateRoute;
