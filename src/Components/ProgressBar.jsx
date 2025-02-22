import React from 'react';

const ProgressBar = ({ currentStep, totalSteps }) => {
  // Ensure the progress never exceeds 100%
  const progressPercent = Math.min((currentStep / totalSteps) * 100, 100);

  return (
    <div
      style={{
        marginBottom: '1rem',
        width: '100%',
        height: '20px',
        background: '#444',
        borderRadius: '10px',
        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.6)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          width: `${progressPercent}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #FFD700 0%, #FFC400 100%)',
          transition: 'width 0.4s ease',
          borderRadius: '10px'
        }}
      />
      {/* Centered label on top of the bar */}
      <span
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#222',
          fontWeight: 'bold',
          pointerEvents: 'none'
        }}
      >
      </span>
    </div>
  );
};

export default ProgressBar;
