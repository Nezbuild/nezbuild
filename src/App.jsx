import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './Components/Navbar'; // Navbar Component
import MainPage from './Pages/MainPage'; // Main Page
import GuideCreationPage from './Pages/GuideCreationPage'; // Guide Creation Page
import AboutPage from './Pages/AboutPage'; // About Page
import TierListPage from './Pages/TierListPage'; // Tier List Page
import LatestPatchNotes from './Pages/LatestPatchNotes'; // Latest Patch Notes Page

// Authentication Components
import AuthPage from './Pages/AuthPage'; // Combined Sign-In/Sign-Up Page

// Private Route for Authentication
import PrivateRoute from './Components/PrivateRoute'; // Private Route Component
import Guides from './Pages/Guides';

function App() {
  useEffect(() => {
    // Disable right-click
    document.addEventListener('contextmenu', (event) => event.preventDefault());

    // Disable common DevTools shortcuts
    document.addEventListener('keydown', (event) => {
      if (
        event.key === 'F12' ||
        // (event.ctrlKey && event.shiftKey && event.key === 'I') ||
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
      // debugger;
      const end = performance.now();
      if (end - start > threshold) {
        alert('DevTools is open!');
      }
    };
    setInterval(detectDevTools, 1000);
  }, []);

  return (
    <Router>
      {/* Navbar is displayed on all pages */}
      <Navbar />

      {/* Define Routes for all pages */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainPage />} /> {/* Home Page */}
        <Route path="/about" element={<AboutPage />} /> {/* About Page */}
        <Route path="/tier-lists" element={<TierListPage />} /> {/* Tier List Page */}
        <Route path="/latest-patch" element={<LatestPatchNotes />} /> {/* Latest Patch Notes Page */}
        <Route path="/Guides" element={<Guides />} /> {/* Guides */}

        {/* Authentication Route */}
        <Route path="/auth" element={<AuthPage />} /> {/* Combined Auth Page */}

        {/* Private Routes */}
        <Route
          path="/create-guide"
          element={
            <PrivateRoute>
              <GuideCreationPage />
            </PrivateRoute>
          }
        />

        {/* 404 Route */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
