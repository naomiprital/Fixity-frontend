import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import { AuthPage } from './features/auth/pages/AuthPage/AuthPage';
import HomePage from './features/auth/pages/HomePage/HomePage';
import MyReportsPage from './features/auth/pages/ReportsPage/MyReportsPage';
import ProfilePage from './features/auth/pages/ProfilePage/ProfilePage';
import CreateReportPage from './features/auth/pages/CreateReportPage/CreateReportPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import ManagerDashboardPage from './features/manager/pages/ManagerDashboardPage/ManagerDashboardPage';

const App = () => {
  const appLocation = useLocation();
  const isAuthPage = appLocation.pathname === '/';

  return (

    <div className="app-layout">
      <main className="main-content">
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/reports" element={<MyReportsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/create" element={<CreateReportPage />} />
          <Route element={<ProtectedRoute allowedRoles={['Manager', 'Official']} />}>
            <Route path="/manager" element={<ManagerDashboardPage />} />
          </Route>
        </Routes>
      </main>
      {!isAuthPage && <Navbar />}
    </div>
  );
};

export default App;
