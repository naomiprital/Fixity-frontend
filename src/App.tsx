import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import { AuthPage } from './features/auth/pages/AuthPage/AuthPage';
import HomePage from './features/auth/pages/HomePage/HomePage';
import MyReportsPage from './features/auth/pages/ReportsPage/MyReportsPage';
import ProfilePage from './features/auth/pages/ProfilePage/ProfilePage';
import CreateReportPage from './features/auth/pages/CreateReportPage/CreateReportPage';
import { WorkerTasksView } from './features/worker/pages/WorkerTasksView';
import { ProtectedRoute } from './components/ProtectedRoute';
import ManagerDashboardPage from './features/manager/pages/ManagerDashboardPage/ManagerDashboardPage';
import StaffManagement from './features/pages/OfficialPages/StaffManagement';
import OfficialMap from './features/pages/OfficialPages/OfficialMap';
import OfficialDashboard from './features/pages/OfficialPages/OfficialDashboard';

const App = () => {
  const appLocation = useLocation();
  const isAuthPage = appLocation.pathname === '/';
  return (
    <div className="app-layout">
      <main className="main-content">
        <Routes>
          <Route path="/" element={<AuthPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Citizen Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Citizen']} />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/reports" element={<MyReportsPage />} />
            <Route path="/create" element={<CreateReportPage />} />
          </Route>

          {/* Worker Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Worker']} />}>
            <Route path="/worker/pool" element={<WorkerTasksView mode="pool" />} />
            <Route path="/worker/my-tasks" element={<WorkerTasksView mode="myTasks" />} />
          </Route>

          {/* Manager Routes TODO: Manager routes */}
          <Route element={<ProtectedRoute allowedRoles={['Manager']} />}>
            <Route path="/manager" element={<ManagerDashboardPage />} />
          </Route>

          {/* Official Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Official']} />}>
            <Route path="/official/dashboard" element={<OfficialDashboard />} />
            <Route path="/official/map" element={<OfficialMap />} />
            <Route path="/official/staff" element={<StaffManagement />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isAuthPage && <Navbar />}
    </div>
  );
};

export default App;
