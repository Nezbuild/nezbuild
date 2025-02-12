import Tooltip from '../Components/Tooltip';
import ReactQuill from 'react-quill'; // Ensure react-quill is installed
import 'react-quill/dist/quill.snow.css'; // Import ReactQuill styles

const Step5 = ({ data, updateData }) => (
  <div>
    <h2 style={{ fontSize: '2rem' }}>
      Step 4: Strategy Description <Tooltip text="Describe the strategy and tactics for your guide." />
    </h2>
    <ReactQuill
      value={data.strategyDescription}
      onChange={(value) => updateData('strategyDescription', value)}
      placeholder="Write your strategy here..."
      style={{ fontSize: '1.25rem' }}
    />
  </div>
);

export default Step5; // Ensure this export is present
