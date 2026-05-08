import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import { AuthPage } from './features/auth/pages/AuthPage/AuthPage';
import HomePage from './features/auth/pages/HomePage/HomePage';
import ReportsPage from './features/auth/pages/ReportsPage/ReportsPage';
import ProfilePage from './features/auth/pages/ProfilePage/ProfilePage';

const App = () => {
  const appLocation = useLocation();
  const isAuthPage = appLocation.pathname === '/';

  return (
    <div className="app-layout">
      <main className="main-content">
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>
      {!isAuthPage && <Navbar />}
    </div>
  );
};

export default App;
