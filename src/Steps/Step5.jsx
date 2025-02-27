import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Step5 = ({ data, updateData }) => {
  const [isFocused, setIsFocused] = useState(false);

  const editorStyle = {
    fontSize: '1.25rem',
    backgroundColor: '#333',
    color: '#FFD700',
    border: '1px solid #FFD700',
    borderRadius: '0.375rem',
    minHeight: '20px',
    transition: 'box-shadow 0.3s, border 0.3s',
    boxShadow: isFocused ? '0 0 6px 2px #FFD700' : 'none'
  };

  return (
    <div
      style={{
        margin: '2rem 0',
        padding: '2rem',
        backgroundColor: '#222',
        border: '1px solid #444',
        borderRadius: '0.5rem',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
        color: '#FFD700',
      }}
    >
      <h2
        style={{
          fontSize: '2rem',
          marginBottom: '1.5rem',
          textShadow: '1px 1px 2px #000',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        Step 5: Strategy Description
      </h2>

      <ReactQuill
        value={data.strategyDescription}
        onChange={(value) => updateData('strategyDescription', value)}
        placeholder="Write your strategy here..."
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={editorStyle}
      />
    </div>
  );
};

export default Step5;
