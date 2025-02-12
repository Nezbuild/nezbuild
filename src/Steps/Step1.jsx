
const Step1 = ({ data, updateData }) => (
    <div>
      <h2 style={{ fontSize: '2rem' }}>
        Step 1: Title and Short Description
      </h2>
      <label style={{ fontSize: '1.25rem' }}>
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
        }}
      />
      <label style={{ fontSize: '1.25rem' }}>
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
        }}
      />
    </div>
  );
  
  export default Step1; // Ensure this default export exists
  