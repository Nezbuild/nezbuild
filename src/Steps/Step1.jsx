import React from 'react';

const Step1 = ({ data, updateData }) => {
  return (
    <div
      style={{
        margin: '2rem 0',
        padding: '2rem',
        backgroundColor: '#222',    // Slightly different shade
        border: '1px solid #444',   // Subtle border
        borderRadius: '0.5rem',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
      }}
    >
      <h2
        style={{
          fontSize: '2rem',
          marginBottom: '1.5rem',
          color: '#FFD700',         // keep golden text
          textShadow: '1px 1px 2px #000'
        }}
      >
        Step 1: Title and Short Description
      </h2>

      <label
        style={{
          fontSize: '1.25rem',
          display: 'block',
          marginBottom: '0.5rem',
          color: '#FFD700'
        }}
      >
        Guide Title <span style={{ color: '#FF0000' }}>*</span>
      </label>
      <input
        type="text"
        value={data.title}
        onChange={(e) => updateData('title', e.target.value)}
        placeholder="Enter your guide title"
        style={{
          width: '100%',
          padding: '1rem',
          fontSize: '1.25rem',
          backgroundColor: '#333333',
          color: '#FFD700',
          border: '1px solid #FFD700',
          borderRadius: '0.375rem',
          marginBottom: '1.5rem',
          outline: 'none',
          transition: 'box-shadow 0.3s, border 0.3s',
        }}
        onFocus={(e) => {
          e.target.style.boxShadow = '0 0 6px 2px #FFD700';
        }}
        onBlur={(e) => {
          e.target.style.boxShadow = 'none';
        }}
      />

      <label
        style={{
          fontSize: '1.25rem',
          display: 'block',
          marginBottom: '0.5rem',
          color: '#FFD700'
        }}
      >
        Short Description <span style={{ color: '#FF0000' }}>*</span>
      </label>
      <textarea
        value={data.shortDescription}
        onChange={(e) => updateData('shortDescription', e.target.value)}
        placeholder="Write a short description..."
        style={{
          width: '100%',
          padding: '1rem',
          fontSize: '1.25rem',
          backgroundColor: '#333333',
          color: '#FFD700',
          border: '1px solid #FFD700',
          borderRadius: '0.375rem',
          outline: 'none',
          transition: 'box-shadow 0.3s, border 0.3s',
          resize: 'vertical',       // let user resize vertically if desired
        }}
        onFocus={(e) => {
          e.target.style.boxShadow = '0 0 6px 2px #FFD700';
        }}
        onBlur={(e) => {
          e.target.style.boxShadow = 'none';
        }}
      />
    </div>
  );
};

export default Step1;
