import { createGlobalStyle } from 'styled-components';
// FFBF00
const GlobalStyle = createGlobalStyle`
  img {
    pointer-events: none; /* Prevent interaction */
    user-drag: none; /* Disable dragging */
    -webkit-user-drag: none;
    -webkit-touch-callout: none; /* Disable long-press save */
    -webkit-user-select: none; /* Disable selection */
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
    
  body {
    margin: 0;
    padding: 0;
    background-color: #000000;  /* Black background */
    color: #FFBF00;  /* Gold text */ 
    font-family: 'Poppins', sans-serif;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: 100vh;
    box-sizing: border-box;
  }

  #root {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 20px;
  }

  /* Apply directly to the content area */
  .content-container {
    background-color: #2F2F2F;  /* Dark Silver / Dark Gray */
    border-radius: 8px;
    padding: 40px;
    width: 100%;
    max-width: 1125px;  /* Adjust max-width as needed */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  }

  /* Styling for headings */
  h2 {
    font-size: 2rem;  /* Increased font size for h2 */
    font-family: 'Playfair Display', serif;
  }

  h3 {
    font-size: 1.75rem;  /* Increased font size for h3 */
    font-family: 'Playfair Display', serif;
  }
`;

export default GlobalStyle;
