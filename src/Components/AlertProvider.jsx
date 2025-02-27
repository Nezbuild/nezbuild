// src/Components/AlertProvider.jsx
import React, { createContext, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled, { keyframes } from 'styled-components';

export const AlertContext = createContext();

const DEFAULT_DURATION = 3000; // milliseconds each alert is shown

let idCounter = 0;

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  // Custom alert function to add an alert to the stack
  const showAlert = (message, duration = DEFAULT_DURATION) => {
    const id = idCounter++;
    setAlerts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    }, duration);
  };

  // Override window.alert with our custom function
  useEffect(() => {
    window.alert = showAlert;
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {ReactDOM.createPortal(
        <AlertContainer>
          {alerts.map((alert) => (
            <AlertBox key={alert.id}>{alert.message}</AlertBox>
          ))}
        </AlertContainer>,
        document.body
      )}
    </AlertContext.Provider>
  );
};

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const AlertContainer = styled.div`
  position: fixed;
  top: 70px; /* Adjust to be below your navbar */
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 10000;
  width: 100%;
  max-width: 500px; /* Adjust max width as needed */
`;

const AlertBox = styled.div`
  background: #222;
  color: #FFD700;
  padding: 10px 20px;
  border: 1px solid #FFD700;
  border-radius: 5px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  font-size: 1.2rem;
  animation: ${fadeIn} 0.3s ease;
`;

export default AlertProvider;
