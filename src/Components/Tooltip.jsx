const Tooltip = ({ text }) => (
    <span style={{ position: 'relative', cursor: 'pointer' }}>
      <span
        style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#333',
          color: '#FFD700',
          padding: '0.75rem',
          borderRadius: '0.375rem',
          whiteSpace: 'nowrap',
          fontSize: '1rem',
          display: 'none',
          zIndex: '10',
        }}
        className="tooltip-text"
      >
        {text}
      </span>
      <span
        onMouseEnter={(e) => {
          const tooltip = e.currentTarget.querySelector('.tooltip-text');
          if (tooltip) tooltip.style.display = 'block';
        }}
        onMouseLeave={(e) => {
          const tooltip = e.currentTarget.querySelector('.tooltip-text');
          if (tooltip) tooltip.style.display = 'none';
        }}
      >
        ❓
      </span>
    </span>
  );
  
  export default Tooltip; // Ensure this default export exists
  