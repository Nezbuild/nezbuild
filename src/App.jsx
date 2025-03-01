// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './Components/Navbar'; // Navbar Component
import MainPage from './Pages/MainPage'; // Main Page
import GuideCreationPage from './Pages/GuideCreationPage'; // Guide Creation Page
import AboutPage from './Pages/AboutPage'; // About Page
import TierListPage from './Pages/TierListPage'; // Tier List Page
import LatestPatchNotes from './Pages/LatestPatchNotes'; // Latest Patch Notes Page
import GuideViewPage from './Pages/GuideViewPage';
import AuthPage from './Pages/AuthPage'; // Combined Sign-In/Sign-Up Page
import CreditsPage from './Pages/CreditsPage'; // Credits Page
import Guides from './Pages/Guides';
import PrivateRoute from './Components/PrivateRoute'; // Private Route Component
import AlertProvider from './Components/AlertProvider'; // Custom Alert Provider
import Footer from './Components/Footer'; // Footer Component

function App() {
  useEffect(() => {
    // Disable right-click
    document.addEventListener('contextmenu', (event) => event.preventDefault());

    // Disable common DevTools shortcuts
    document.addEventListener('keydown', (event) => {
      if (
        event.key === 'F12' ||
        (event.ctrlKey && event.shiftKey && event.key === 'J') ||
        (event.ctrlKey && event.key === 'U')
      ) {
        event.preventDefault();
      }
    });

    // Detect DevTools opening
    const detectDevTools = () => {
      const threshold = 160;
      const start = performance.now();
      const end = performance.now();
      if (end - start > threshold) {
        alert('DevTools is open!');
      }
    };
    setInterval(detectDevTools, 1000);
  }, []);

  return (
    <AlertProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          {/* This container will grow to fill the available space, pushing the footer down */}
          <div style={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/tier-lists" element={<TierListPage />} />
              <Route path="/latest-patch" element={<LatestPatchNotes />} />
              <Route path="/Guides" element={<Guides />} />
              <Route path="/guides/:guideId" element={<GuideViewPage />} />
              <Route path="/credits" element={<CreditsPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route
                path="/create-guide"
                element={
                  <PrivateRoute>
                    <GuideCreationPage />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<h1>404 - Page Not Found</h1>} />
            </Routes>
          </div>
          {/* Footer placed outside the growing content so it always stays at the bottom */}
          <Footer />
        </div>
      </Router>
    </AlertProvider>
  );
}

export default App;
