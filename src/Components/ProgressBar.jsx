const ProgressBar = ({ currentStep, totalSteps }) => (
    <div style={{ marginBottom: '1rem', width: '100%', background: '#333', borderRadius: '5px' }}>
      <div
        style={{
          width: `${(currentStep / totalSteps) * 100}%`,
          height: '15px',
          background: '#FFD700',
          borderRadius: '5px',
        }}
      ></div>
    </div>
  );
  
  export default ProgressBar; // Ensure there is a default export
  