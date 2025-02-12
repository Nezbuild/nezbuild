const NavigationButtons = ({ currentStep, totalSteps, onNext, onPrevious }) => (
    <div>
      {currentStep > 1 && (
        <button
          onClick={onPrevious}
          style={{
            marginRight: '1rem',
            padding: '1rem 2rem',
            fontSize: '1.5rem',
          }}
        >
          Previous
        </button>
      )}
      {currentStep < totalSteps && (
        <button
          onClick={onNext}
          style={{
            padding: '1rem 2rem',
            fontSize: '1.5rem',
          }}
        >
          Next
        </button>
      )}
    </div>
  );
  
  export default NavigationButtons;
  