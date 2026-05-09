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

const App = () => {
  const appLocation = useLocation();
  const isAuthPage = appLocation.pathname === '/';
  return (
    <div className="app-layout">
      <main className="main-content">
        <Routes>
          <Route path="/" element={<AuthPage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/reports" element={<MyReportsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/create" element={<CreateReportPage />} />

            {/* Worker Routes */}
            <Route path="/worker/pool" element={<WorkerTasksView mode="pool" />} />
            <Route path="/worker/my-tasks" element={<WorkerTasksView mode="myTasks" />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['Manager', 'Official']} />}>
            <Route path="/manager" element={<ManagerDashboardPage />} />
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
